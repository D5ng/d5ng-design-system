import { readdirSync } from "node:fs";

// 커밋 메시지 규칙의 기준. CLAUDE.md "커밋과 PR 제목"을 기계로 검사한다.
// feature는 squash 머지라 develop에 남는 건 PR 제목이다. 나중에 CI에서 PR 제목도 이 설정으로 검사한다.

// scope는 패키지 폴더 이름이다. 패키지가 늘어나도 여기를 고치지 않는다.
const packages = readdirSync(new URL("./packages", import.meta.url), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// GitHub이 squash 커밋 제목 끝에 붙이는 " (#12)"는 요약의 일부로 보지 않는다.
const summaryOf = (subject) => (subject ?? "").replace(/\s*\(#\d+\)$/, "");

const local = {
  rules: {
    "subject-hangul": ({ subject }) => [
      /[가-힣]/.test(summaryOf(subject)),
      "요약은 한글로 써요. 예: feat(react): Button 로딩 상태 추가",
    ],
    // 명사형인지 완벽히 가릴 수는 없어서, 문장으로 끝나는 흔한 경우만 잡는다.
    "subject-noun-form": ({ subject }) => [
      !/[다요함.]$/.test(summaryOf(subject)),
      "요약은 짧은 명사형으로 써요. '추가했어요' 대신 '추가'",
    ],
    "no-attribution": ({ raw }) => [
      !/co-authored-by:|generated with|claude\.ai\/code/i.test(raw ?? ""),
      "Co-Authored-By, 'Generated with', 세션 링크 같은 참조자는 넣지 않아요",
    ],
    "body-yo-style": ({ body }) => [
      (body ?? "")
        .split("\n")
        .filter((line) => line.trim() !== "")
        .every((line) => /요[.!?)]*$/.test(line.trim())),
      "본문은 ~요체로 써요",
    ],
    "body-max-lines": ({ body }, _when, max) => [
      (body ?? "").split("\n").filter((line) => line.trim() !== "").length <=
        max,
      `본문은 ${String(max)}줄 이하로 짧게 써요`,
    ],
  },
};

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [local],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "chore", "test"],
    ],
    "scope-enum": [2, "always", packages],
    // 영어 대소문자 규칙이라 "Button 로딩 상태 추가" 같은 한글 요약을 잘못 막는다.
    "subject-case": [0],
    "header-max-length": [2, "always", 72],

    "subject-hangul": [2, "always"],
    "subject-noun-form": [2, "always"],
    "no-attribution": [2, "always"],
    "body-yo-style": [1, "always"],
    "body-max-lines": [1, "always", 3],
  },
};
