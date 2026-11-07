// Figma 파일의 변수와 스타일을 variables.json 형식으로 내보낸다.
//
// Figma REST API로 변수를 읽으려면 Enterprise 플랜이 필요해서, Figma 안에서 Plugin API로 실행한다.
// `/sync-tokens`가 Figma MCP의 use_figma로 이 파일 내용을 실행한다. 순서는 .claude/skills/sync-tokens/SKILL.md에 있다.
//
// TARGET에 따라 돌려주는 것이 다르다. use_figma의 반환값은 48KB까지라서 한 번에 하나씩 받는다.
// - null: 컬렉션별 지문 `{ fingerprints: { Palette: "…", …, styles: "…" } }`
// - 컬렉션 이름: 그 컬렉션 `{ collection: {…} }`
// - "styles": 텍스트·그림자 스타일 `{ styles: { textStyles, effectStyles } }`
//
// 지문은 내보내는 JSON 문자열의 FNV-1a 해시다. scripts/sync.ts도 같은 방법으로 계산해서 비교하므로
// 내보내는 형식이나 해시 방법을 바꾸면 두 파일을 같이 고친다.
//
// 대상 파일: https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz
// 최상위 await·return을 쓰는 Plugin API 스크립트라서 ESLint·Prettier 대상에서 뺐다.

const TARGET = null;

const fingerprint = (value) => {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

const round = (n) => Math.round(n * 1e4) / 1e4;
const hex = (c) => {
  const h = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  const alpha = c.a !== undefined && c.a < 1 ? h(c.a) : "";
  return `#${h(c.r)}${h(c.g)}${h(c.b)}${alpha}`;
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const variableById = new Map(variables.map((v) => [v.id, v]));
const collectionById = new Map(collections.map((c) => [c.id, c]));

// 다른 변수를 가리키면 "컬렉션:변수 이름"으로 남긴다.
const refOf = (id) => {
  const target = variableById.get(id);
  if (!target) {
    throw new Error(`찾을 수 없는 변수 ${id}`);
  }
  return `${collectionById.get(target.variableCollectionId).name}:${target.name}`;
};

const valueOf = (value) => {
  if (typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    return { alias: refOf(value.id) };
  }
  if (typeof value === "object" && "r" in value) {
    return hex(value);
  }
  return typeof value === "number" ? round(value) : value;
};

// 숫자는 scope(쓰이는 곳)로 단위를 정하므로 FLOAT만 scopes를 담는다.
const exportCollection = (c) => ({
  name: c.name,
  modes: c.modes.map((m) => m.name),
  variables: c.variableIds.map((id) => {
    const v = variableById.get(id);
    return {
      name: v.name,
      type: v.resolvedType,
      css: v.codeSyntax.WEB
        ? v.codeSyntax.WEB.replace(/^var\(--|\)$/g, "")
        : null,
      ...(v.resolvedType === "FLOAT" ? { scopes: v.scopes } : {}),
      values: Object.fromEntries(
        c.modes.map((m) => [m.name, valueOf(v.valuesByMode[m.modeId])]),
      ),
    };
  }),
});

const boundRefs = (bound, keys) =>
  Object.fromEntries(
    keys.filter((k) => bound?.[k]).map((k) => [k, refOf(bound[k].id)]),
  );

const exportStyles = async () => {
  const textStyles = (await figma.getLocalTextStylesAsync()).map((s) => ({
    name: s.name,
    fontFamily: s.fontName.family,
    fontStyle: s.fontName.style,
    fontSize: round(s.fontSize),
    lineHeight:
      s.lineHeight.unit === "AUTO"
        ? { unit: "AUTO" }
        : { unit: s.lineHeight.unit, value: round(s.lineHeight.value) },
    letterSpacing: {
      unit: s.letterSpacing.unit,
      value: round(s.letterSpacing.value),
    },
    bound: boundRefs(s.boundVariables, [
      "fontFamily",
      "fontSize",
      "lineHeight",
      "fontWeight",
      "letterSpacing",
    ]),
  }));

  const effectStyles = (await figma.getLocalEffectStylesAsync()).map((s) => ({
    name: s.name,
    effects: s.effects.map((e) => ({
      type: e.type,
      x: e.offset ? round(e.offset.x) : undefined,
      y: e.offset ? round(e.offset.y) : undefined,
      blur: round(e.radius),
      spread: e.spread === undefined ? undefined : round(e.spread),
      color: e.color ? hex(e.color) : undefined,
      colorVariable: e.boundVariables?.color
        ? refOf(e.boundVariables.color.id)
        : undefined,
    })),
  }));

  return { textStyles, effectStyles };
};

if (TARGET === null) {
  const fingerprints = Object.fromEntries(
    collections.map((c) => [c.name, fingerprint(exportCollection(c))]),
  );
  fingerprints.styles = fingerprint(await exportStyles());
  return { fingerprints };
}

if (TARGET === "styles") {
  return { styles: await exportStyles() };
}

const target = collections.find((c) => c.name === TARGET);
if (!target) {
  throw new Error(`없는 컬렉션이에요: ${TARGET}`);
}
return { collection: exportCollection(target) };
