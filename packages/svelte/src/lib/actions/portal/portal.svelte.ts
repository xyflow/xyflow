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
  const { domNode } = $derived(useStore());

  let destroyEffect: (() => void) | undefined;
  // svelte-ignore state_referenced_locally
  if (domNode) {
    // if the domNode is already mounted, we can directly try to mount the node
    tryToMount(node, domNode, target);
  } else {
    // if the domNode is not mounted yet, we need to wait for it to be ready
    destroyEffect = $effect.root(() => {
      $effect(() => {
        tryToMount(node, domNode, target);
        destroyEffect?.();
      });
    });
  }

  return {
    async update(target: Portal | undefined) {
      tryToMount(node, domNode, target);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      destroyEffect?.();
    }
  };
}
