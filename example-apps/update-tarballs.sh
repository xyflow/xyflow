#!/usr/bin/env bash
# Builds @xyflow/system, @xyflow/react, and @xyflow/svelte, then packs them into example-apps/tarballs/
# (stable names: xyflow-system.tgz, xyflow-react.tgz, xyflow-svelte.tgz).
#
# These archives are committed so example-apps can depend on file:../../tarballs/*.tgz and a fresh
# clone still passes pnpm install. After changing library code, run: pnpm pack:example-tarballs,
# then commit any updated .tgz files and pnpm-lock.yaml when integrity changes.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/example-apps/tarballs"

mkdir -p "$OUT"
rm -f "$OUT"/xyflow-*.tgz

cd "$ROOT"
pnpm --filter @xyflow/system --filter @xyflow/react --filter @xyflow/svelte run build

(cd "$ROOT/packages/system" && pnpm pack --out "$OUT/xyflow-system.tgz")
(cd "$ROOT/packages/react" && pnpm pack --out "$OUT/xyflow-react.tgz")
(cd "$ROOT/packages/svelte" && pnpm pack --out "$OUT/xyflow-svelte.tgz")

echo "Packed to $OUT"
