import type { Component, ComponentInternalInstance, ShallowRef, VNode } from 'vue';
import { h, resolveComponent } from 'vue';

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

/** Vue's `PatchFlags.PROPS`: on update only the keys listed in `dynamicProps` are re-resolved. */
const PATCH_FLAG_PROPS = 8;

/**
 * Tag a child component vnode with the props that changed since the previous render, so Vue's
 * props fast path replaces `setFullProps`, which re-writes every declared prop into the child's
 * `shallowReactive` props object. Vue's compiler emits this for templates; a render function has
 * to derive it. Pass `null` as `prev` on the first render.
 */
function markChangedProps(vnode: VNode, props: Record<string, unknown>, prev: Record<string, unknown> | null) {
  if (!prev) {
    return;
  }

  // the fast path can only re-resolve keys, not remove them, so a vanished key needs a full pass
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

  vnode.patchFlag = PATCH_FLAG_PROPS;
  (vnode as VNode & { dynamicProps: string[] }).dynamicProps = dynamicProps;
}

/**
 * An `h()` that remembers the last props object and tags each vnode via {@link markChangedProps}.
 * Call `reset()` when the child is not rendered, so the next one starts from a full props pass.
 */
export function createChangedPropsRenderer() {
  let prev: Record<string, unknown> | null = null;

  const render = (type: Component, props: Record<string, unknown>) => {
    const vnode = h(type, props);

    markChangedProps(vnode, props, prev);
    prev = props;

    return vnode;
  };

  render.reset = () => {
    prev = null;
  };

  return render;
}

/**
 * Capture an element into `target` from vnode hooks rather than a template ref, which Vue
 * re-registers on every patch and queues a post-flush job for.
 */
export function captureElement<T extends Element>(target: ShallowRef<T | null>) {
  return {
    onVnodeMounted: (vnode: VNode) => {
      target.value = vnode.el as T;
    },
    onVnodeBeforeUnmount: () => {
      target.value = null;
    },
  };
}
