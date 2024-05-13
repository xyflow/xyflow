/**
 * Helper function to get the snapshot of a svelte state
 * inside non-svelte files
 * @param value svelte state to take snapshot of
 * @returns the snapshot of the state
 */
export function getSnapshot<T>(value: T): T {
  return $state.snapshot(value);
}
