// Figma 파일의 변수와 스타일을 variables.json 형식으로 내보낸다.
//
// Figma REST API로 변수를 읽으려면 Enterprise 플랜이 필요해서, Figma 안에서 Plugin API로 실행한다.
// Claude Code에서 Figma MCP의 use_figma로 이 파일 내용을 그대로 실행하고,
// 반환된 JSON을 variables.json에 저장한 뒤 `pnpm --filter @d5ng/tokens generate`를 실행한다.
//
// use_figma의 반환값은 48KB까지라서 PART를 1, 2로 바꿔 두 번 실행하고 합친다.
// 1은 Palette·Color, 2는 나머지 컬렉션과 텍스트·그림자 스타일이다.
// 합칠 때는 collections를 이어 붙이고 textStyles·effectStyles는 2의 것을 쓴다.
//
// 대상 파일: https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz
// 최상위 await·return을 쓰는 Plugin API 스크립트라서 ESLint·Prettier 대상에서 뺐다.

const PART = 1;
const PART_1 = ["Palette", "Color"];

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

const inPart = (c) => PART_1.includes(c.name) === (PART === 1);

const exportedCollections = collections.filter(inPart).map((c) => ({
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
      values: Object.fromEntries(
        c.modes.map((m) => [m.name, valueOf(v.valuesByMode[m.modeId])]),
      ),
    };
  }),
}));

const boundRefs = (bound, keys) =>
  Object.fromEntries(
    keys.filter((k) => bound?.[k]).map((k) => [k, refOf(bound[k].id)]),
  );

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

return PART === 1
  ? { collections: exportedCollections }
  : { collections: exportedCollections, textStyles, effectStyles };
