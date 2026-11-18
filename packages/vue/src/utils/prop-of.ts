import type { PropType } from 'vue';

/**
 * Builds a Vue prop declaration typed as `PropType<T>` but with no runtime check (VueFlow supplies these
 * props itself), so `defineProps(nodeProps<MyNode>())` recovers precise generic-aware types. Declaring the
 * key also keeps the prop out of `$attrs`, preventing the `draggable`/`class` leak on custom nodes.
 *
 * @internal
 */
export function propOf<T>(): { type: PropType<T>; required: false };
export function propOf<T>(required: true): { type: PropType<T>; required: true };
export function propOf<T>(required = false): { type: PropType<T>; required: boolean } {
  return { type: null as unknown as PropType<T>, required };
}
