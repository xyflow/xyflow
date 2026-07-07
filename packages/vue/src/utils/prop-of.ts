import type { PropType } from 'vue';

/**
 * Builds a single Vue prop declaration whose runtime shape is `{ type: null, required }` — i.e. no
 * runtime type-check, because VueFlow always provides these props itself — but whose *type* is
 * `PropType<T>`, so `defineProps(nodeProps<MyNode>())` recovers precise, generic-aware prop types.
 *
 * Declaring the key is what keeps the prop out of `$attrs`, preventing the `draggable`/`class`
 * attribute leak on custom node components. Consumed only by the generated `*Props()` factories in
 * `props-objects.gen.ts`.
 *
 * @internal
 */
export function propOf<T>(): { type: PropType<T>; required: false };
export function propOf<T>(required: true): { type: PropType<T>; required: true };
export function propOf<T>(required = false): { type: PropType<T>; required: boolean } {
  return { type: null as unknown as PropType<T>, required };
}
