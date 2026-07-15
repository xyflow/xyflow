import type { ComponentInternalInstance } from 'vue';

/**
 * Convert an event name to its Vue handler-prop key.
 * E.g. 'nodeClick' -> 'onNodeClick', 'update:nodes' -> 'onUpdate:nodes'.
 */
export function toHandlerKey(event: string) {
  const [head, ...rest] = event.split(':');
  const camel = head.replace(/(?:^|-)(\w)/g, (_, c: string) => c.toUpperCase());
  return `on${camel}${rest.length ? `:${rest.join(':')}` : ''}`;
}

/**
 * Whether a template listener/handler for `event` is bound on the component's vnode — e.g. `@node-click`
 * (`onNodeClick`) or `@update:nodes` (`onUpdate:nodes`, what a `v-model:nodes` desugars to). Reads raw
 * `vnode.props`, so pass the instance captured at setup; the vnode isn't reactive, so this is a
 * point-in-time check.
 */
export function hasVNodeListener(inst: ComponentInternalInstance | null, event: string): boolean {
  return !!inst?.vnode.props?.[toHandlerKey(event)];
}
