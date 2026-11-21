#!/usr/bin/env bash
# npm에 실제로 올라갈 tgz로 Next 예제 앱(apps/next)을 빌드해 봐요.
# npm은 한 번 쓴 번호를 다시 못 써서, 올리기 전에 쓰는 쪽에서 깨지지 않는지 봐요.
# 레지스트리에는 아무것도 남지 않아요. main으로 가는 PR에서는 CI(pack-check)가 돌려요.
#
#   scripts/check-pack.sh
#
# 필요한 것: pnpm, 네트워크(예제 앱의 next·react를 받아요)
set -euo pipefail

cd "$(dirname "$0")/.."
version=$(node -p "require('./packages/react/package.json').version")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

pnpm --filter "./packages/*" build
pnpm --filter @d5ng/react pack --pack-destination "$tmp"
tgz="d5ng-react-$version.tgz"

# workspace 안에서는 workspace:*가 tgz 대신 packages/react를 읽어서 밖에서 빌드해요.
# tsconfig는 복사하지 않아요. 루트 밖 extends를 Turbopack이 못 읽고, 없으면 Next가 기본값을 만들어요.
cp -r apps/next/app apps/next/package.json "$tmp/"
cd "$tmp"
npm pkg set "dependencies.@d5ng/react=file:./$tgz"

# Next가 빌드 도중에 typescript를 깔면 /_global-error 프리렌더가 실패해서 먼저 깔아요(2026-11-11 확인).
pnpm add -D typescript @types/node
pnpm build

echo "✓ $tgz로 apps/next 빌드 통과"
