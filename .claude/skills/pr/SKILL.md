---
name: pr
description: 작업이 끝난 브랜치의 변경을 이슈, 커밋, PR로 한 번에 올린다. 이슈를 먼저 만들고 PR 본문의 `Closes #번호`로 연결하며, 라벨과 담당자를 맞춘다. 사용자가 "PR 올려줘", "PR 만들어줘", "이슈 만들어줘", "이슈랑 PR 같이", "올려줘", "/pr"이라고 하거나, 작업을 마무리하고 develop에 보내려 할 때, 이슈만 따로 만들 때 쓴다. release, hotfix, 머지는 다루지 않는다.
---

# 이슈 → 커밋 → PR

규칙은 같은 폴더의 `rules.md`(글쓰기, 커밋과 PR 제목, 이슈와 PR의 역할, 이슈, PR, 라벨)가 기준이다. **시작할 때 먼저 읽는다.** 이 파일은 그 규칙을 어떤 순서로 적용하는지만 다룬다. 규칙이 바뀌면 `rules.md`를 고친다.

`gh`를 못 쓰면(클라우드) GitHub MCP로 같은 일을 한다. `gh issue list`는 `list_issues`, `gh issue create`는 `issue_write`, `gh pr create`는 `create_pull_request`, `gh issue view`는 `issue_read`다. 본문은 문자열로 넘겨서 셸이 백틱을 바꾸지 않는다.

## 1. 상태 확인

```bash
git branch --show-current
git status --short
git log --oneline develop..HEAD
```

- **develop이나 main에 있으면** 커밋하지 않고 `git flow feature start <kebab-case>`(git-flow가 없으면 `git checkout -b feature/<kebab-case>`)로 브랜치를 먼저 딴다. 변경은 그대로 따라온다
- **연결된 이슈가 이미 있는지** 본다. 사용자가 번호를 말했거나 `gh issue list --assignee @me --state open`에 같은 일이 있으면 새로 만들지 않고 그 번호를 쓴다
- 변경이 두 가지 일로 나뉘면 멈추고 사용자에게 알린다. PR 하나에는 한 가지 일만 담는다

## 2. 라벨 고르기

`.github/labels.json`의 `description`을 읽고 고른다. 사용자에게 묻지 않는다.

- `type:` 하나
- 건드린 `packages/*`마다 `pkg:`
- 해당되면 `breaking`, `a11y`

이슈와 PR에 **같은 라벨**을 붙인다.

## 3. changeset 정하기

`packages/*`의 배포물이 바뀌었으면 changeset이 필요하다. 스토리·테스트·문서만 바뀌었으면 넣지 않는다. 브랜치에 `.changeset/*.md`가 이미 있으면 그걸 고친다.

- 등급은 `docs/release.md`의 "변경 종류별 번호" 표로 고른다. **0.x 동안은 `major`를 쓰지 않는다**(1.0.0이 된다). `breaking` 라벨을 붙였으면 0.x에서는 `minor`다
- 패키지는 tokens만 바꿨어도 `@d5ng/react`다
- 만들 때는 `pnpm changeset add --patch @d5ng/react -m "<본문>"`처럼 등급과 본문을 넘긴다(`--minor`도 같다). 인자 없이 실행하면 대화형이라 멈춘다

## 4. 초안을 한 번에 보여주기

아래를 한 메시지에 모아 보여주고, 사용자가 확인하면 5단계로 간다. 고쳐 달라고 하면 고쳐서 다시 보여준다.

- **이슈**: 제목, 본문
- **커밋**: 메시지 (이미 커밋이 있으면 생략)
- **PR**: 제목, 본문
- **라벨**
- **changeset**: 등급, 본문 (필요 없으면 이유 한 줄)

쓸 때 놓치기 쉬운 것:

- 이슈 본문은 `rules.md` "이슈" 표의 섹션을 `### 섹션 이름`으로 직접 쓴다. 웹 폼이 만드는 모양과 같게 하려는 것이다. `docs`·`chore`는 섹션 없이 두세 줄
- 이슈에는 문제와 이유, PR에는 어떻게 바꿨는지. **PR 첫 문장이 이슈 첫 문장을 되풀이하면 다시 쓴다**
- PR 제목이 squash 커밋 제목이 된다. 커밋 메시지와 같은 형식(`type(scope): 한글 명사형 요약`)이고 scope는 `packages/*` 폴더 이름, 저장소 전체면 생략한다
- PR 본문 마지막 줄은 `Closes #번호`. 이슈를 아직 안 만들었으면 초안에는 `Closes #(이슈 생성 후)`로 둔다
- 참조자(`Co-Authored-By`, 생성 표기, 세션 링크)는 어디에도 넣지 않는다

## 5. 올리기

본문은 **항상 파일로 넘긴다.** `--body "..."`로 넘기면 셸이 백틱을 `` \` ``로 바꿔서 코드 블록이 깨진다(#12에서 실제로 깨졌다). 파일은 저장소 밖 임시 폴더에 둔다.

```bash
tmp=$(mktemp -d)
# $tmp/issue.md, $tmp/pr.md 에 Write 도구로 본문을 쓴다

gh issue create --title "<제목>" --body-file "$tmp/issue.md" \
  --assignee @me --label "type: ..." --label "pkg: ..."
# 출력된 URL에서 이슈 번호를 읽어 pr.md의 Closes 줄을 채운다

git add <파일들>                        # changeset 파일도 함께
git commit -m "<type(scope): 요약>"     # 훅이 lint·commitlint를 돌린다. --no-verify 금지
git push -u origin HEAD                 # pre-push 훅이 타입 검사를 돌린다

gh pr create --base develop --title "<제목>" --body-file "$tmp/pr.md" \
  --assignee @me --label "type: ..." --label "pkg: ..."
```

- 훅이 실패하면 우회하지 않고 원인을 고친 뒤 **새 커밋을 만든다**(squash 머지라 커밋이 늘어도 괜찮다)
- 올린 뒤 `gh issue view <번호>`로 본문의 코드 블록과 섹션이 제대로 보이는지 한 번 본다

## 6. 멈추기

PR 링크와 이슈 링크를 알려주고 끝낸다. **머지는 사용자가 직접 한다.**
