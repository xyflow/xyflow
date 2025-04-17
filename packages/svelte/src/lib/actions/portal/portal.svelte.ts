import { useStore } from '$lib/store';

type Portal = 'viewport' | 'root';

function tryToMount(node: Element, domNode: Element | null, target: Portal | undefined) {
  if (!target || !domNode) {
    return;
  }

  const targetEl = target === 'root' ? domNode : domNode.querySelector('.svelte-flow__viewport');

  if (targetEl) {
    targetEl.appendChild(node);
  }
}

export default function (node: Element, target: Portal | undefined) {
  const { domNode } = $derived(useStore());

  let previousTarget: Portal | undefined = target;

  tryToMount(node, domNode, target);

  return {
    async update(target: Portal) {
      if (target !== previousTarget) {
        node.parentNode?.removeChild(node);
        previousTarget = target;
      }
      tryToMount(node, domNode, target);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  };
}
