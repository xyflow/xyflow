---
"@xyflow/system": patch
"@xyflow/react": patch
"@xyflow/svelte": patch
"@xyflow/vue": patch
---

Make `useUpdateNodeInternals` return a `Promise<void>` (N.B. we use `tick()` for Svelte) that resolves after node dimensions have been re-measured and the store updated. Callers can now `await updateNodeInternals(id)` before performing layout or other dimension-dependent operations. The `UpdateNodeInternals` type is updated from `void` to `Promise<void>` (backward-compatible - existing callers ignoring the return value are unaffected).

For Svelte specifically, fix non-deterministic delay before `updateNodeInternals` (and automatic remeasurement on `sourcePosition`/`targetPosition`/`type` changes) reflected updated node dimensions. Both paths deferred the measurement via `requestAnimationFrame`, which `await tick()` couldn't wait for. The automatic remeasurement no longer needs any deferral.