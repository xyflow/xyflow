import type { Component, ComponentInternalInstance } from 'vue';
import { resolveComponent } from 'vue';

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

/**
 * Resolve the component to render for a node/edge `type`:
 * - a matching template slot wins, otherwise the registered type
 * - a string type name is resolved against the app's globally-registered components.
 *
 * Returns `undefined` when the type can't be resolved (callers fall back to the `default` type and emit the missing-type error).
 */
export function resolveTypeComponent(
  slot: unknown,
  type: unknown,
  name: string,
  inst: ComponentInternalInstance | null,
): Component | undefined {
  if (slot) {
    return slot as Component;
  }

  if (typeof type === 'string') {
    return inst && name in inst.appContext.components ? (resolveComponent(name, false) as Component) : undefined;
  }

  return (type as Component) || undefined;
}
