type PortalOptions = {
  target?: string;
  domNode: Element | null;
};

function tryToMount(node: Element, domNode: Element | null, target: string | undefined) {
  if (!domNode) {
    return;
  }

  const targetEl = target ? domNode.querySelector(target) : domNode;

  if (targetEl) {
    targetEl.appendChild(node);
  }
}

export default function (node: Element, { target, domNode }: PortalOptions) {
  tryToMount(node, domNode, target);

  return {
    async update({ target, domNode }: PortalOptions) {
      tryToMount(node, domNode, target);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  };
}
