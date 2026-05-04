#!/usr/bin/env bash
# Builds @xyflow/system, @xyflow/react, and @xyflow/svelte, then packs them into example-apps/packed-libs/
# (stable names: xyflow-system.tgz, xyflow-react.tgz, xyflow-svelte.tgz).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/example-apps/packed-libs"

mkdir -p "$OUT"
rm -f "$OUT"/xyflow-*.tgz

cd "$ROOT"
pnpm --filter @xyflow/system --filter @xyflow/react --filter @xyflow/svelte run build

(cd "$ROOT/packages/system" && pnpm pack --out "$OUT/xyflow-system.tgz")
(cd "$ROOT/packages/react" && pnpm pack --out "$OUT/xyflow-react.tgz")
(cd "$ROOT/packages/svelte" && pnpm pack --out "$OUT/xyflow-svelte.tgz")

echo "Packed to $OUT"
