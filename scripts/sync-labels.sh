#!/usr/bin/env bash
# GitHub 저장소의 라벨을 .github/labels.json과 맞춘다.
#
#   scripts/sync-labels.sh           만들고 갱신만 한다. 파일에 없는 라벨은 목록만 보여준다
#   scripts/sync-labels.sh --prune   파일에 없는 라벨을 지운다 (붙어 있던 이슈·PR에서도 사라진다)
#
# 필요한 것: gh(로그인된 상태), jq
set -euo pipefail

cd "$(dirname "$0")/.."
LABELS_FILE=.github/labels.json
export LC_ALL=C

prune=false
if [[ "${1:-}" == "--prune" ]]; then
  prune=true
fi

# 1. 파일에 있는 라벨: 없으면 만들고, 있으면 색과 설명을 덮어쓴다
while IFS=$'\t' read -r name color description; do
  gh label create "$name" --color "$color" --description "$description" --force </dev/null
  echo "✓ $name"
done < <(jq -r '.[] | [.name, .color, .description] | @tsv' "$LABELS_FILE")

# 2. 파일에 없는 라벨
extra=$(comm -13 \
  <(jq -r '.[].name' "$LABELS_FILE" | sort) \
  <(gh label list --limit 500 --json name --jq '.[].name' | sort))

if [[ -z "$extra" ]]; then
  echo "파일에 없는 라벨: 없음"
  exit 0
fi

if [[ "$prune" == true ]]; then
  while IFS= read -r name; do
    gh label delete "$name" --yes </dev/null
    echo "✗ $name (삭제)"
  done <<<"$extra"
else
  echo "파일에 없는 라벨 (지우려면 --prune):"
  sed 's/^/  - /' <<<"$extra"
fi
