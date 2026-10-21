import type { Component, ComponentInternalInstance, VNode } from 'vue';
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

/** Vue's `PatchFlags.PROPS`: only the keys listed in `dynamicProps` are re-resolved. */
const PATCH_FLAG_PROPS = 8;

/**
 * Tag a child component vnode with the props that actually changed since the last render.
 *
 * Without a patch flag Vue takes `setFullProps` on every update, re-resolving and re-writing
 * every declared prop into the child's `shallowReactive` props object. A node or edge component
 * takes around twenty props of which a drag frame changes two, so the rest cost a reactive write
 * each, per component, per frame. Vue's compiler derives `dynamicProps` from a template; these
 * props are built in a render function, so derive it by comparing against the previous object.
 *
 * Pass `null` as `prev` on the first render so the child still goes through the full props pass.
 */
export function markChangedProps(vnode: VNode, props: Record<string, unknown>, prev: Record<string, unknown> | null) {
  if (!prev) {
    return;
  }

  // a key that vanished between renders cannot be removed by the fast path, so bail to a full pass
  for (const key in prev) {
    if (!(key in props)) {
      return;
    }
  }

  const dynamicProps: string[] = [];

  for (const key in props) {
    if (props[key] !== prev[key]) {
      dynamicProps.push(key);
    }
  }

  const target = vnode as VNode & { dynamicProps?: string[] | null };
  target.patchFlag = PATCH_FLAG_PROPS;
  target.dynamicProps = dynamicProps;
}
