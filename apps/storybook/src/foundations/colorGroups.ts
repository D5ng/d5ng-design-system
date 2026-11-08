import { vars } from "@d5ng/tokens";

import variables from "../../../../packages/tokens/figma/variables.json";

// Colors 스토리에 보여 줄 묶음이에요.
// 역할 색 목록과 설명은 Figma Color 페이지의 "01 Semantic" 표를 따라요.
// Figma에서 역할 색을 더하거나 이름을 바꾸면 여기도 같이 고쳐요.

export type ColorToken = {
  // Figma 변수 이름이에요. 예: "fg/neutral-muted"
  name: string;
  // 묶음 안에서 보여 줄 짧은 이름이에요. 예: "neutral-muted"
  label: string;
  // "var(--d5ng-color-fg-neutral-muted)"
  value: string;
  // "vars.color.fg.neutralMuted"
  path: string;
  // 모드별로 가리키는 팔레트예요. 예: { Light: "gray/700", Dark: "gray/400" }
  aliases: Record<string, string>;
};

export type ColorFamily = {
  title: string;
  description?: string;
  tokens: ColorToken[];
};

export type ColorSection = {
  title: string;
  description: string;
  families: ColorFamily[];
};

type FamilySpec = { title: string; description: string; tokens: string[] };
type SectionSpec = {
  title: string;
  description: string;
  families: FamilySpec[];
};

const roleSections: SectionSpec[] = [
  {
    title: "Foreground · 글자와 아이콘",
    description: "글자와 아이콘처럼 바탕 위에 놓이는 요소의 색입니다.",
    families: [
      {
        title: "Neutral",
        description:
          "기본 글자와 아이콘입니다. neutral은 본문과 제목, muted는 보조 설명, subtle은 보조 정보와 캡션에 씁니다.",
        tokens: ["fg/neutral", "fg/neutral-muted", "fg/neutral-subtle"],
      },
      {
        title: "Brand",
        description: "링크와 브랜드를 강조하는 글자입니다.",
        tokens: ["fg/brand"],
      },
      {
        title: "Status",
        description:
          "정보, 성공, 주의, 오류를 알리는 글자입니다. 상태는 색만으로 전달하지 않습니다.",
        tokens: ["fg/informative", "fg/positive", "fg/warning", "fg/critical"],
      },
      {
        title: "On solid",
        description:
          "진한 면 위의 흰 글자와 아이콘입니다. Primary 버튼에는 on-action-primary, Danger처럼 다른 강조 버튼에는 on-action-solid를 씁니다.",
        tokens: [
          "fg/on-brand-solid",
          "fg/on-action-primary",
          "fg/on-action-solid",
        ],
      },
      {
        title: "Disabled · Placeholder",
        description:
          "비활성 글자와 입력 예시입니다. placeholder는 라벨을 대체하지 않습니다.",
        tokens: ["fg/disabled", "fg/placeholder"],
      },
      {
        title: "Code",
        description: "코드와 고정폭 정보입니다.",
        tokens: ["fg/code"],
      },
    ],
  },
  {
    title: "Background · 배경과 면",
    description: "화면 바탕과 그 위에 놓이는 면의 색입니다.",
    families: [
      {
        title: "Layer",
        description:
          "화면의 바탕입니다. 기본 바탕, 한 단계 낮은 바탕, 떠 있는 표면 순입니다.",
        tokens: ["bg/layer-default", "bg/layer-basement", "bg/layer-floating"],
      },
      {
        title: "Neutral",
        description: "약한 중립 면과 그 위의 호버, 눌림 상태입니다.",
        tokens: [
          "bg/neutral-weak",
          "bg/neutral-weak-hover",
          "bg/neutral-weak-pressed",
        ],
      },
      {
        title: "Brand",
        description: "브랜드를 강조하는 면입니다.",
        tokens: ["bg/brand-solid", "bg/brand-solid-pressed", "bg/brand-weak"],
      },
      {
        title: "Status",
        description: "상태를 알리는 영역의 옅은 바탕입니다.",
        tokens: [
          "bg/informative-weak",
          "bg/positive-weak",
          "bg/warning-weak",
          "bg/critical-weak",
        ],
      },
      {
        title: "Action · Primary",
        description: "Primary 버튼의 기본, 호버, 눌림 상태입니다.",
        tokens: [
          "bg/action-primary",
          "bg/action-primary-hover",
          "bg/action-primary-pressed",
        ],
      },
      {
        title: "Action · Critical",
        description: "되돌리기 어려운 동작 버튼의 기본, 호버, 눌림 상태입니다.",
        tokens: [
          "bg/action-critical",
          "bg/action-critical-hover",
          "bg/action-critical-pressed",
        ],
      },
      {
        title: "Disabled",
        description: "비활성 요소의 바탕입니다.",
        tokens: ["bg/disabled"],
      },
      {
        title: "Code · Highlight",
        description: "코드 블록과 강조 표시의 바탕입니다.",
        tokens: ["bg/code", "bg/highlight"],
      },
      {
        title: "Scrim",
        description: "모달 뒤를 가리는 반투명 막입니다.",
        tokens: ["bg/scrim"],
      },
    ],
  },
  {
    title: "Stroke · 테두리와 구분선",
    description: "테두리, 구분선, 포커스 링의 색입니다.",
    families: [
      {
        title: "Neutral",
        description:
          "구분선과 테두리입니다. subtle에서 strong으로 갈수록 진하고, 입력 경계처럼 알아봐야 하는 곳에는 strong을 씁니다.",
        tokens: [
          "stroke/neutral-subtle",
          "stroke/neutral-muted",
          "stroke/neutral-weak",
          "stroke/neutral-strong",
        ],
      },
      {
        title: "Brand · Focus",
        description: "브랜드 테두리와 키보드 포커스 링입니다.",
        tokens: ["stroke/brand-solid", "stroke/focus-ring"],
      },
      {
        title: "Critical",
        description: "오류가 있는 입력의 경계입니다.",
        tokens: ["stroke/critical"],
      },
    ],
  },
  {
    title: "Effect · 그림자",
    description: "떠 있는 표면의 그림자 색입니다.",
    families: [
      {
        title: "Shadow",
        description: "작은 영역, 메뉴와 팝오버, 넓은 표면 순입니다.",
        tokens: ["effect/shadow-sm", "effect/shadow-md", "effect/shadow-lg"],
      },
    ],
  },
];

// 특정 컴포넌트만 쓰는 색이에요. 이름으로 묶고, 어디에도 안 맞으면 "기타"로 보내요.
const componentGroups: { title: string; match: RegExp }[] = [
  { title: "Action · Neutral", match: /action-neutral/ },
  { title: "Inverse", match: /on-inverse/ },
  { title: "Snackbar", match: /snackbar/ },
  { title: "Badge", match: /badge|notification/ },
  { title: "Switch", match: /switch/ },
  { title: "Select", match: /select/ },
  { title: "Dialog", match: /dialog/ },
  { title: "Chip", match: /chip/ },
  { title: "Link", match: /link/ },
  { title: "Skeleton", match: /skeleton/ },
  { title: "Help Bubble", match: /help-bubble/ },
];

type Alias = { alias: string };
type Collection = {
  name: string;
  modes: string[];
  variables: { name: string; values: Record<string, Alias | string> }[];
};

const color = (variables.collections as Collection[]).find(
  (collection) => collection.name === "Color",
);
if (!color) {
  throw new Error("variables.json에 Color 컬렉션이 없어요.");
}

const camelCase = (text: string) =>
  text.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());

// "Palette:gray/900"에서 컬렉션 이름을 빼요. 다른 역할 색을 가리키면 "fg/critical"처럼 남아요.
const aliasName = (value: Alias | string) =>
  typeof value === "string" ? value : value.alias.replace(/^[^:]+:/, "");

const colorVars = vars.color as Record<string, Record<string, string>>;

const tokens = new Map(
  color.variables.map((variable) => {
    const [property = "", role = ""] = variable.name.split("/");
    const key = camelCase(role);
    const value = colorVars[property]?.[key];
    if (!value) {
      throw new Error(`vars.color에 ${variable.name}이 없어요.`);
    }
    const token: ColorToken = {
      name: variable.name,
      label: role,
      value,
      path: `vars.color.${property}.${key}`,
      aliases: Object.fromEntries(
        color.modes.map((mode) => {
          const modeValue = variable.values[mode];
          return [mode, modeValue === undefined ? "" : aliasName(modeValue)];
        }),
      ),
    };
    return [variable.name, token];
  }),
);

const take = (name: string) => {
  const token = tokens.get(name);
  if (!token) {
    throw new Error(
      `${name}이 Figma Color 컬렉션에 없어요. colorGroups.ts의 목록을 고쳐요.`,
    );
  }
  return token;
};

export const sections: ColorSection[] = roleSections.map((section) => ({
  ...section,
  families: section.families.map((family) => ({
    ...family,
    tokens: family.tokens.map(take),
  })),
}));

const roleNames = new Set(
  roleSections.flatMap((section) =>
    section.families.flatMap((family) => family.tokens),
  ),
);
const rest = [...tokens.values()].filter((token) => !roleNames.has(token.name));

const componentFamilies: ColorFamily[] = componentGroups
  .map((group) => ({
    title: group.title,
    tokens: rest.filter((token) => group.match.test(token.name)),
  }))
  .filter((family) => family.tokens.length > 0);

const grouped = new Set(
  componentFamilies.flatMap((family) =>
    family.tokens.map((token) => token.name),
  ),
);
const others = rest.filter((token) => !grouped.has(token.name));

export const componentSection: ColorSection = {
  title: "Component · 컴포넌트 전용",
  description: "특정 컴포넌트만 쓰는 색입니다. 앱에서는 위의 역할 색을 씁니다.",
  families: [
    ...componentFamilies,
    ...(others.length > 0 ? [{ title: "기타", tokens: others }] : []),
  ],
};
