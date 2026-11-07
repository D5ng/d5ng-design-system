// `/sync-tokens`에서 쓰는 도구다. 실행 순서는 .claude/skills/sync-tokens/SKILL.md에 있다.
//
//   changed <지문 파일>             Figma 지문과 variables.json을 비교해 다시 받을 것을 알려 준다
//   merge <지문 파일> <받은 파일>…  받은 컬렉션·스타일을 variables.json에 합친다
//   diff                            커밋된 variables.json과 비교해 바뀐 토큰을 보여 준다
//
// 지문은 따로 저장하지 않고 variables.json에서 매번 계산한다.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { Collection, Export, Styles, Value, Variable } from "./types";

const STYLES = "styles";
const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const variablesFile = new URL("../figma/variables.json", import.meta.url);

const fail = (message: string): never => {
  throw new Error(`[tokens] ${message}`);
};

// figma/export.figma.js의 fingerprint와 같은 계산이다. 한쪽을 바꾸면 다른 쪽도 바꾼다.
const fingerprint = (value: unknown) => {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

const readJson = (path: string | URL): unknown =>
  JSON.parse(readFileSync(path, "utf8"));

const stylesOf = (data: Export): Styles => ({
  textStyles: data.textStyles,
  effectStyles: data.effectStyles,
});

const localFingerprints = (data: Export) =>
  new Map([
    ...data.collections.map((c) => [c.name, fingerprint(c)] as const),
    [STYLES, fingerprint(stylesOf(data))],
  ]);

const readFingerprints = (path: string): Record<string, string> => {
  const data = readJson(path) as { fingerprints?: Record<string, string> };
  return data.fingerprints ?? fail(`지문 파일이 아니에요: ${path}`);
};

// ---- changed

const changed = (printsPath: string) => {
  const figma = readFingerprints(printsPath);
  const local = localFingerprints(readJson(variablesFile) as Export);
  const toFetch = Object.keys(figma).filter(
    (name) => local.get(name) !== figma[name],
  );
  const removed = [...local.keys()].filter((name) => !(name in figma));

  if (toFetch.length === 0 && removed.length === 0) {
    console.log("바뀐 것이 없어요.");
    return;
  }
  console.log(`다시 받을 것: ${toFetch.join(", ") || "없음"}`);
  if (removed.length > 0) {
    console.log(`Figma에서 사라진 컬렉션: ${removed.join(", ")}`);
  }
};

// ---- merge

const merge = (printsPath: string, partPaths: string[]) => {
  const figma = readFingerprints(printsPath);
  const current = readJson(variablesFile) as Export;

  const received = new Map<string, unknown>();
  for (const path of partPaths) {
    const part = readJson(path) as { collection?: Collection; styles?: Styles };
    if (part.collection) {
      received.set(part.collection.name, part.collection);
    } else if (part.styles) {
      received.set(STYLES, part.styles);
    } else {
      fail(`받은 파일의 형식을 모르겠어요: ${path}`);
    }
  }
  for (const name of received.keys()) {
    if (!(name in figma)) {
      fail(`지문 파일에 없는 이름이에요: ${name}`);
    }
  }

  // 받은 것은 Figma 지문과 같아야 하고, 받지 않은 것은 지금 파일이 Figma와 같아야 한다.
  const pick = (name: string, local: unknown) => {
    const value = received.get(name) ?? local;
    if (fingerprint(value) !== figma[name]) {
      fail(
        received.has(name)
          ? `${name}: 받은 내용이 Figma 지문과 달라요. 옮기다 바뀌었거나 그사이 Figma가 바뀌었으니 다시 받아요`
          : `${name}: Figma에서 바뀌었는데 받은 파일이 없어요`,
      );
    }
    return value;
  };

  const localByName = new Map(current.collections.map((c) => [c.name, c]));
  const collections = Object.keys(figma)
    .filter((name) => name !== STYLES)
    .map((name) => pick(name, localByName.get(name)) as Collection);
  const styles = pick(STYLES, stylesOf(current)) as Styles;

  const next: Export = { collections, ...styles };
  writeFileSync(variablesFile, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `variables.json에 합쳤어요: ${[...received.keys()].join(", ") || "없음"}`,
  );
};

// ---- diff

const show = (value: Value | undefined) => {
  if (value === undefined) {
    return "없음";
  }
  return typeof value === "object" ? `{${value.alias}}` : String(value);
};

const flatten = (data: Export) =>
  new Map(
    data.collections.flatMap((c) =>
      c.variables.map(
        (v) =>
          [`${c.name}:${v.name}`, { modes: c.modes, variable: v }] as const,
      ),
    ),
  );

const describe = (modes: string[], v: Variable) =>
  modes.length === 1
    ? show(v.values[modes[0] ?? ""])
    : modes.map((m) => `${m} ${show(v.values[m])}`).join(" · ");

const diff = () => {
  const before = JSON.parse(
    execFileSync("git", ["show", "HEAD:./figma/variables.json"], {
      cwd: packageRoot,
      encoding: "utf8",
    }),
  ) as Export;
  const after = readJson(variablesFile) as Export;
  const lines: string[] = [];
  let scopesAdded = 0;

  const old = flatten(before);
  const now = flatten(after);
  for (const [key, { modes, variable }] of now) {
    const prev = old.get(key);
    if (!prev) {
      lines.push(`+ ${key}  ${describe(modes, variable)}`);
      continue;
    }
    if (prev.variable.css !== variable.css) {
      lines.push(
        `~ ${key}  코드 이름 ${String(prev.variable.css)} → ${String(variable.css)}`,
      );
    }
    const prevScopes = prev.variable.scopes?.join(", ");
    const scopes = variable.scopes?.join(", ");
    if (prevScopes === undefined && scopes !== undefined) {
      scopesAdded += 1;
    } else if (prevScopes !== scopes) {
      lines.push(
        `~ ${key}  scope ${prevScopes ?? "없음"} → ${scopes ?? "없음"}`,
      );
    }
    for (const mode of new Set([...prev.modes, ...modes])) {
      const a = show(prev.variable.values[mode]);
      const b = show(variable.values[mode]);
      if (a !== b) {
        const label = modes.length > 1 ? `${mode} ` : "";
        lines.push(`~ ${key}  ${label}${a} → ${b}`);
      }
    }
  }
  for (const key of old.keys()) {
    if (!now.has(key)) {
      lines.push(`- ${key}`);
    }
  }

  const styleNames = (data: Export) =>
    new Map(
      [...data.textStyles, ...data.effectStyles].map((s) => [
        s.name,
        JSON.stringify(s),
      ]),
    );
  const oldStyles = styleNames(before);
  const newStyles = styleNames(after);
  for (const [name, json] of newStyles) {
    const prev = oldStyles.get(name);
    if (prev === undefined) {
      lines.push(`+ 스타일 ${name}`);
    } else if (prev !== json) {
      lines.push(`~ 스타일 ${name}`);
    }
  }
  for (const name of oldStyles.keys()) {
    if (!newStyles.has(name)) {
      lines.push(`- 스타일 ${name}`);
    }
  }

  if (scopesAdded > 0) {
    lines.push(`scope를 처음 받은 숫자 변수 ${String(scopesAdded)}개`);
  }
  console.log(lines.length > 0 ? lines.join("\n") : "바뀐 토큰이 없어요.");
};

// ---- 실행

const [command, ...args] = process.argv.slice(2);
if (command === "changed" && args[0] !== undefined) {
  changed(args[0]);
} else if (command === "merge" && args[0] !== undefined) {
  merge(args[0], args.slice(1));
} else if (command === "diff") {
  diff();
} else {
  fail(
    "사용법: sync.ts changed <지문 파일> | merge <지문 파일> <받은 파일>… | diff",
  );
}
