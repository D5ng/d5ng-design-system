---
name: sync-tokens
description: Figma 변수와 스타일을 @d5ng/tokens로 가져온다. 바뀐 컬렉션만 받아 CSS·TS를 다시 만들고 바뀐 토큰을 요약한다. "토큰 동기화", "Figma 토큰 반영", "Figma 바꿨어" 같은 요청이나 /sync-tokens에 쓴다.
---

# Figma 토큰 동기화

Figma 변수 REST API는 Enterprise 전용이라, Figma MCP의 `use_figma`로 `packages/tokens/figma/export.figma.js`를 실행해 가져온다.

- 대상 파일: `5e7PW74E0sWvXqhHC1fpqz`
- 받은 JSON은 임시 폴더(scratchpad)에 저장한다. 저장소에는 두지 않는다.
- 명령은 저장소 루트에서 실행한다.

## 순서

1. **지문 받기.** Figma MCP 규칙대로 세션을 만들고, `export.figma.js` 내용을 그대로 `use_figma`의 code로 실행한다(`TARGET = null`). 반환된 JSON을 `fingerprints.json`으로 저장한다.
2. **바뀐 것 확인.**

   ```bash
   node packages/tokens/scripts/sync.ts changed <fingerprints.json>
   ```

   "바뀐 것이 없어요"가 나오면 그렇게 알리고 끝낸다.

3. **바뀐 것만 받기.** "다시 받을 것"마다 `TARGET`을 그 이름(컬렉션 이름이나 `"styles"`)으로 바꿔 실행한다. 반환값이 48KB를 넘지 않게 한 번에 하나씩 받는다. 여러 개면 한 메시지에서 병렬로 호출한다. 반환된 JSON은 고치지 않고 그대로 파일로 저장한다.
4. **합치기.**

   ```bash
   node packages/tokens/scripts/sync.ts merge <fingerprints.json> <받은 파일>…
   ```

   지문이 다르다는 오류가 나면 옮기다 바뀌었거나 그사이 Figma가 바뀐 것이다. 1번부터 다시 한다.

5. **생성.**

   ```bash
   pnpm --filter @d5ng/tokens generate
   ```

   실패하면 `generate.ts`를 추측으로 고치지 않는다. 메시지를 보여 주고 어떻게 할지 묻는다. 흔한 경우는 이렇다.
   - **단위를 모르는 scope**: Figma에서 scope를 고칠지, `SCOPE_UNITS`·`NAME_UNITS`에 규칙을 더할지 묻는다.
   - **모드가 Light·Dark가 아님**: 새 테마 방식이 필요한 컬렉션이다. 담을 방법을 정하거나 `EXCLUDED_COLLECTIONS`에 넣는다.
   - **담지 않은 변수를 가리킴, TS 키가 겹침**: Figma 이름이나 별칭을 확인한다.

6. **요약하고 멈추기.**

   ```bash
   node packages/tokens/scripts/sync.ts diff
   ```

   diff 결과와 generate 출력을 보여 주고 멈춘다. 이슈와 PR은 사용자가 확인한 뒤 `/pr` 스킬 규칙대로 만든다. PR 본문에는 diff 결과를 그대로 붙인다.
