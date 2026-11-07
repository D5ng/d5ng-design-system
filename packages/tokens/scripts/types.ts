// figma/variables.json의 형식이다. figma/export.figma.js가 이 모양으로 내보낸다.

export type Alias = { alias: string };
export type Value = string | number | boolean | Alias;

export type Variable = {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  css: string | null;
  // FLOAT에만 있다. 숫자의 단위를 정하는 데 쓴다.
  scopes?: string[];
  values: Record<string, Value>;
};

export type Collection = {
  name: string;
  modes: string[];
  variables: Variable[];
};

export type TextStyle = {
  name: string;
  bound: Partial<
    Record<"fontFamily" | "fontSize" | "lineHeight" | "fontWeight", string>
  >;
};

export type Effect = {
  type: string;
  x?: number;
  y?: number;
  blur: number;
  spread?: number;
  colorVariable?: string;
};

export type Styles = {
  textStyles: TextStyle[];
  effectStyles: { name: string; effects: Effect[] }[];
};

export type Export = { collections: Collection[] } & Styles;
