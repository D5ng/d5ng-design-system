// figma/variables.json으로 src/generated/의 CSS·TS 파일을 만든다.
// 이름은 Figma 코드 이름(code syntax)을 그대로 쓰고, 이 스크립트는 값과 단위만 붙인다.
// 모르는 값이 나오면 추측하지 않고 실패한다. Figma가 바뀌면 여기서 먼저 알 수 있게 하려는 것이다.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Alias = { alias: string };
type Value = string | number | boolean | Alias;

type Variable = {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  css: string | null;
  values: Record<string, Value>;
};

type Collection = { name: string; modes: string[]; variables: Variable[] };

type TextStyle = {
  name: string;
  bound: Partial<
    Record<"fontFamily" | "fontSize" | "lineHeight" | "fontWeight", string>
  >;
};

type Effect = {
  type: string;
  x?: number;
  y?: number;
  blur: number;
  spread?: number;
  colorVariable?: string;
};

type Export = {
  collections: Collection[];
  textStyles: TextStyle[];
  effectStyles: { name: string; effects: Effect[] }[];
};

// Foundation만 담는다. 컴포넌트 전용 컬렉션은 그 컴포넌트를 만들 때 추가한다.
const COLLECTIONS = [
  "Palette",
  "Color",
  "Spacing",
  "Radius",
  "Typography",
  "Motion",
];
// Figma 설명에 레거시로 적혀 있고 현재 Layout 가이드(1040/640)와 값이 다르다.
const EXCLUDED = new Set(["Spacing:layout/page-max", "Spacing:layout/gutter"]);
// 쓰는 쪽이 고르는 용도별 스타일만 담는다. Scale/* 같은 조합은 쓰는 컴포넌트가 생기면 넣는다.
const TEXT_STYLES = [
  "Display",
  "Heading/Page",
  "Heading/Section",
  "Heading/Group",
  "Body/Default",
  "Body/Small",
  "Caption",
  "Label/Default",
  "Code/Block",
];
// Figma에는 글꼴 이름만 있어서, 글꼴을 불러오지 못했을 때 쓸 대체 글꼴을 붙인다.
const FONT_FALLBACK: Record<string, string> = {
  "font/family/base": "system-ui, sans-serif",
  "font/family/code": "ui-monospace, monospace",
};
const THEME_SELECTOR: Record<string, string> = {
  Light: ':root,\n[data-theme="light"]',
  Dark: '[data-theme="dark"]',
};
const ROOT_FONT_SIZE = 16;

const root = new URL("../", import.meta.url);
const data = JSON.parse(
  readFileSync(new URL("figma/variables.json", root), "utf8"),
) as Export;

const fail = (message: string): never => {
  throw new Error(`[tokens] ${message}`);
};

const round = (n: number) => Number(n.toFixed(4));
const isAlias = (value: Value): value is Alias =>
  typeof value === "object" && "alias" in value;

// "컬렉션:이름" → 변수. 가리키는 변수가 담는 범위 밖에 있으면 실패한다.
const included = new Map<string, Variable>();
for (const collection of data.collections) {
  if (!COLLECTIONS.includes(collection.name)) {
    continue;
  }
  for (const variable of collection.variables) {
    const key = `${collection.name}:${variable.name}`;
    if (!EXCLUDED.has(key)) {
      included.set(key, variable);
    }
  }
}

const cssName = (key: string): string => {
  const variable =
    included.get(key) ?? fail(`담지 않은 변수를 가리켜요: ${key}`);
  return variable.css ?? fail(`코드 이름이 없어요: ${key}`);
};

const unitOf = (collection: string, name: string): string => {
  if (collection === "Spacing" || collection === "Radius") {
    return "px";
  }
  if (collection === "Typography" && /^font\/(size|line-height)\//.test(name)) {
    return "rem";
  }
  if (collection === "Typography" && name.startsWith("font/weight/")) {
    return "";
  }
  if (collection === "Motion" && name.startsWith("duration/")) {
    return "ms";
  }
  if (collection === "Motion" && name === "press/max-width-reduction") {
    return "px";
  }
  if (collection === "Motion" && name === "press/max-reduction") {
    return "";
  }
  return fail(`단위를 모르는 숫자예요: ${collection}:${name}`);
};

const cssValue = (collection: string, variable: Variable, value: Value) => {
  if (isAlias(value)) {
    return `var(--${cssName(value.alias)})`;
  }
  if (variable.type === "COLOR" && typeof value === "string") {
    return value;
  }
  if (variable.type === "FLOAT" && typeof value === "number") {
    const unit = unitOf(collection, variable.name);
    const n = unit === "rem" ? round(value / ROOT_FONT_SIZE) : round(value);
    return `${String(n)}${unit}`;
  }
  if (variable.type === "STRING" && typeof value === "string") {
    const fallback = FONT_FALLBACK[variable.name];
    return fallback ? `"${value}", ${fallback}` : value;
  }
  return fail(`처리할 수 없는 값이에요: ${collection}:${variable.name}`);
};

// 그림자는 테마마다 색이 달라서 Color와 같은 블록에 둔다.
// :root에만 두면 var()가 :root에서 라이트 색으로 계산된 채 상속돼서 다크 영역에서도 라이트 그림자가 나온다.
const shadows = data.effectStyles.map((style) => {
  const layers = style.effects.map((e) => {
    if (e.type !== "DROP_SHADOW" || e.colorVariable === undefined) {
      return fail(`처리할 수 없는 그림자예요: ${style.name}`);
    }
    const lengths = [e.x ?? 0, e.y ?? 0, e.blur, e.spread ?? 0]
      .map((n) => `${String(round(n))}px`)
      .join(" ");
    return `${lengths} var(--${cssName(e.colorVariable)})`;
  });
  return {
    name: style.name,
    css: style.name.replaceAll("/", "-"),
    value: layers.join(", "),
  };
});

// ---- tokens.css

const HEADER =
  "자동 생성 파일이에요. 직접 고치지 말고 `pnpm generate`를 실행해요.";
const blocks: string[] = [];
const rootLines: string[] = [];
const themeLines: Record<string, string[]> = { Light: [], Dark: [] };
let declarationCount = 0;

for (const collection of data.collections) {
  if (!COLLECTIONS.includes(collection.name)) {
    continue;
  }
  const themed = collection.modes.length > 1;
  if (themed && collection.modes.join() !== "Light,Dark") {
    fail(`모드가 Light·Dark가 아니에요: ${collection.name}`);
  }
  for (const variable of collection.variables) {
    if (EXCLUDED.has(`${collection.name}:${variable.name}`)) {
      continue;
    }
    const name = cssName(`${collection.name}:${variable.name}`);
    for (const mode of collection.modes) {
      const value =
        variable.values[mode] ?? fail(`${mode} 값이 없어요: ${name}`);
      const line = `  --${name}: ${cssValue(collection.name, variable, value)};`;
      const target = themed ? themeLines[mode] : rootLines;
      (target ?? fail(`모르는 모드예요: ${mode}`)).push(line);
    }
    declarationCount += 1;
  }
}
for (const shadow of shadows) {
  for (const lines of Object.values(themeLines)) {
    lines.push(`  --${shadow.css}: ${shadow.value};`);
  }
  declarationCount += 1;
}

blocks.push(`/* ${HEADER} */`);
blocks.push(`:root {\n${rootLines.join("\n")}\n}`);
for (const [mode, lines] of Object.entries(themeLines)) {
  const selector = THEME_SELECTOR[mode] ?? fail(`모르는 모드예요: ${mode}`);
  blocks.push(`${selector} {\n${lines.join("\n")}\n}`);
}

// ---- vars.ts

type Tree = { [key: string]: Tree | string };

const camel = (segment: string) =>
  segment.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const setPath = (tree: Tree, path: string[], value: string, key: string) => {
  let node = tree;
  for (const [i, raw] of path.entries()) {
    const segment = camel(raw);
    if (i === path.length - 1) {
      if (segment in node) {
        fail(`TS 키가 겹쳐요: ${key}`);
      }
      node[segment] = value;
      return;
    }
    const next = node[segment] ?? {};
    if (typeof next === "string") {
      return fail(`TS 키가 겹쳐요: ${key}`);
    }
    node[segment] = next;
    node = next;
  }
};

// Palette는 내보내지 않는다. 컴포넌트가 원본값 대신 용도별 이름을 쓰게 하려는 것이다.
const vars: Tree = {};
for (const key of included.keys()) {
  const [collection = "", name = ""] = key.split(":");
  if (collection === "Palette") {
    continue;
  }
  const path =
    collection === "Color" ? ["color", ...name.split("/")] : name.split("/");
  setPath(vars, path, `var(--${cssName(key)})`, key);
}
for (const shadow of shadows) {
  setPath(vars, shadow.name.split("/"), `var(--${shadow.css})`, shadow.name);
}

const ts = (value: unknown) => JSON.stringify(value, null, 2);

// ---- textStyles.ts

const varPath = (key: string) => {
  const [collection = "", name = ""] = key.split(":");
  if (collection !== "Typography") {
    fail(`Typography가 아닌 변수예요: ${key}`);
  }
  cssName(key);
  return `vars${name
    .split("/")
    .map((s) => (/^\d/.test(s) ? `[${s}]` : `.${camel(s)}`))
    .join("")}`;
};

const textStyleLines = TEXT_STYLES.map((styleName) => {
  const style =
    data.textStyles.find((s) => s.name === styleName) ??
    fail(`텍스트 스타일이 없어요: ${styleName}`);
  const props = (
    ["fontFamily", "fontSize", "lineHeight", "fontWeight"] as const
  ).map((prop) => {
    const key =
      style.bound[prop] ??
      fail(`${styleName}의 ${prop}이 변수에 묶여 있지 않아요`);
    return `    ${prop}: ${varPath(key)},`;
  });
  const key = camel(styleName.toLowerCase().replaceAll("/", "-"));
  return `  ${key}: {\n${props.join("\n")}\n  },`;
});

// ---- 쓰기

const out = new URL("src/generated/", root);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("tokens.css", out), `${blocks.join("\n\n")}\n`);
writeFileSync(
  new URL("vars.ts", out),
  `// ${HEADER}\n\nexport const vars = ${ts(vars)} as const;\n`,
);
writeFileSync(
  new URL("textStyles.ts", out),
  `// ${HEADER}\n\nimport { vars } from "./vars";\n\nexport const textStyles = {\n${textStyleLines.join("\n")}\n} as const;\n`,
);

console.log(
  `[tokens] CSS 변수 ${String(declarationCount)}개 (다크 재정의 ${String(themeLines.Dark?.length ?? 0)}개), 텍스트 스타일 ${String(TEXT_STYLES.length)}개`,
);
