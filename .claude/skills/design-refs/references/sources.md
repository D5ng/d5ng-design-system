# 어디서 무엇을 읽나

둘 다 공개 문서라 로그인 없이 `curl`로 받는다. 클라우드에서는 프록시가 두 사이트를 막아서(403) web-fetch 에이전트로 읽는다. 받은 내용은 임시 폴더(scratchpad)에 두고 저장소에는 넣지 않는다.

## SEED (seed-design.io)

AI가 읽도록 만든 텍스트 문서(`llms.txt`)가 있다. 경로는 기억으로 조합하지 말고 인덱스에서 찾는다.

| 무엇                                                  | 인덱스                                      | 문서 하나                           |
| ----------------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| 전체                                                  | https://seed-design.io/llms.txt             |                                     |
| 컴포넌트 디자인 스펙(Anatomy, Properties, Guidelines) | https://seed-design.io/components/llms.txt  | `/llms/components/<slug>.txt`       |
| React API(props, 예시)                                | https://seed-design.io/react/llms.txt       | `/llms/react/components/<slug>.txt` |
| Foundations(색, 타이포, 간격, 모션, 상태 등)          | https://seed-design.io/foundations/llms.txt | `/llms/foundations/<이름>.txt`      |
| 패턴                                                  | https://seed-design.io/patterns/llms.txt    |                                     |

문서에 기본값이 빠진 경우가 많다(ActionButton의 기본 size가 그랬다). 그럴 때는 GitHub 소스를 본다. 저장소는 `daangn/seed-design`, 기본 브랜치는 `dev`다.

| 무엇                                        | 경로                                              |
| ------------------------------------------- | ------------------------------------------------- |
| React 컴포넌트(props, 동작)                 | `packages/react/src/components/<Name>/<Name>.tsx` |
| 스타일 recipe(variant, `defaultVariants`)   | `packages/qvism-preset/src/recipes/<slug>.ts`     |
| 컴포넌트 스펙 원본(slot별 속성, 크기·색 값) | `packages/rootage/components/<slug>.yaml`         |

```bash
gh api repos/daangn/seed-design/contents/<경로> --jq .content | base64 -d
# 경로를 모르면
gh api "search/code?q=repo:daangn/seed-design+filename:<파일명>" --jq '.items[].path'
```

클라우드에서 GitHub 접근이 이 저장소로 좁혀 있으면 `gh api`가 막힌다. `https://raw.githubusercontent.com/daangn/seed-design/dev/<경로>`를 web-fetch 에이전트로 읽는다.

SEED 공식 Docs MCP(`@seed-design/docs-mcp`)가 연결돼 있으면 위보다 먼저 쓴다. 같은 문서와 Rootage 스펙을 바로 조회할 수 있다.

## Montage (montage.wanted.co.kr)

`llms.txt`도 MCP도 없다. 서버에서 렌더링하는 페이지라 `curl`로 받은 HTML에 본문이 들어 있다. 길면 web-fetch 에이전트에게 요약을 맡긴다.

- 목록: https://montage.wanted.co.kr/sitemap.xml
- 컴포넌트: `/docs/components/<분류>/<slug>/<탭>`
  - `design`: 사용 가이드, 위계(Hierarchy), Do/Don't
  - `web`: props 표, 예시 코드
  - `ios`, `android`: 필요할 때만
- Foundations: `/docs/foundations/base-material/` 아래 `colors/semantic`, `colors/atomic`, `typography`, `grid`, `elevation/normal`, `elevation/spread`, `icons`
- 패키지는 `@montage-ui/core`이고 소스는 공개돼 있지 않다. 문서에 없는 동작은 "확인 못 함"으로 둔다.

```bash
curl -s https://montage.wanted.co.kr/docs/components/actions/button/web \
  | sed 's/<[^>]*>/\n/g' | grep -v '^\s*$'
```
