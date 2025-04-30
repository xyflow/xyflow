import { useStore } from '$lib/store';

type Portal = 'viewport-back' | 'viewport-front' | 'root' | 'edge-labels';

function tryToMount(node: Element, domNode: Element | null, target: Portal | undefined) {
  if (!target || !domNode) {
    return;
  }

  const targetEl = target === 'root' ? domNode : domNode.querySelector(`.svelte-flow__${target}`);

  if (targetEl) {
    targetEl.appendChild(node);
  }
}

export function portal(node: Element, target: Portal | undefined) {
  const store = useStore();

  let previousTarget: Portal | undefined = target;

  tryToMount(node, store.domNode, target);

  return {
    async update(target: Portal) {
      if (target !== previousTarget) {
        node.parentNode?.removeChild(node);
        previousTarget = target;
      }
      tryToMount(node, store.domNode, target);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  };
}
