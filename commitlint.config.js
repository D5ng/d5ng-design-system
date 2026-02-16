export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "design",
        "refactor",
        "style",
        "docs",
        "test",
        "chore",
        "perf",
        "ci",
        "revert",
      ],
    ],

    "type-case": [2, "always", "lower-case"],

    "header-max-length": [2, "always", 72],

    "subject-full-stop": [2, "never", "."],

    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
  },
};
