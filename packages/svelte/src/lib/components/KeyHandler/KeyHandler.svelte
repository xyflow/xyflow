<script lang="ts">
  import { get } from 'svelte/store';
  import {
    shortcut,
    type ShortcutEventDetail,
    type ShortcutModifierDefinition
  } from '@svelte-put/shortcut';
  import { getElementsToRemove, isInputDOMNode, isMacOs } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { KeyHandlerProps } from './types';
  import type { KeyDefinition, KeyDefinitionObject } from '$lib/types';

  let {
    selectionKey = 'Shift',
    multiSelectionKey = isMacOs() ? 'Meta' : 'Control',
    deleteKey = 'Backspace',
    panActivationKey = ' ',
    zoomActivationKey = isMacOs() ? 'Meta' : 'Control'
  }: KeyHandlerProps = $props();

  const {
    selectionKeyPressed,
    multiselectionKeyPressed,
    deleteKeyPressed,
    panActivationKeyPressed,
    zoomActivationKeyPressed,
    selectionRect,
    onbeforedelete,
    ondelete,
    nodes: _nodes,
    edges: _edges
  } = useStore();

  function isKeyObject(key?: KeyDefinition | null): key is KeyDefinitionObject {
    return key !== null && typeof key === 'object';
  }

  function getModifier(key?: KeyDefinition | null): ShortcutModifierDefinition {
    return isKeyObject(key) ? key.modifier || [] : [];
  }

  function getKeyString(key?: KeyDefinition | null): string {
    if (key === null || key === undefined) {
      // this is a workaround to check if a key is set
      // if not we won't call the callback
      return '';
    }

    return isKeyObject(key) ? key.key : key;
  }

  function getShortcutTrigger(
    key: KeyDefinition | KeyDefinition[] | null | undefined,
    callback: (detail: ShortcutEventDetail) => void
  ) {
    const keys = Array.isArray(key) ? key : [key];
    return keys.map((_key) => {
      const keyString = getKeyString(_key);
      return {
        key: keyString,
        modifier: getModifier(_key),
        enabled: keyString !== null,
        callback
      };
    });
  }

  function resetKeysAndSelection() {
    selectionRect.set(null);
    selectionKeyPressed.set(false);
    multiselectionKeyPressed.set(false);
    deleteKeyPressed.set(false);
    panActivationKeyPressed.set(false);
    zoomActivationKeyPressed.set(false);
  }

  async function handleDelete() {
    const nodes = get(_nodes);
    const edges = get(_edges);
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
      nodesToRemove: selectedNodes,
      edgesToRemove: selectedEdges,
      nodes,
      edges,
      onBeforeDelete: get(onbeforedelete)
    });

    if (matchingNodes.length || matchingEdges.length) {
      _nodes.update((nds) => nds.filter((node) => !matchingNodes.some((mN) => mN.id === node.id)));
      _edges.update((eds) => eds.filter((edge) => !matchingEdges.some((mE) => mE.id === edge.id)));

      get(ondelete)?.({
        nodes: matchingNodes,
        edges: matchingEdges
      });
    }
  }
</script>

<svelte:window
  on:blur={resetKeysAndSelection}
  on:contextmenu={resetKeysAndSelection}
  use:shortcut={{
    trigger: getShortcutTrigger(selectionKey, () => selectionKeyPressed.set(true)),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(selectionKey, () => selectionKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(multiSelectionKey, () => multiselectionKeyPressed.set(true)),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(multiSelectionKey, () => multiselectionKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(deleteKey, (detail) => {
      const isModifierKey =
        detail.originalEvent.ctrlKey ||
        detail.originalEvent.metaKey ||
        detail.originalEvent.shiftKey;
      if (!isModifierKey && !isInputDOMNode(detail.originalEvent)) {
        deleteKeyPressed.set(true);
        handleDelete();
      }
    }),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(deleteKey, () => deleteKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(panActivationKey, () => panActivationKeyPressed.set(true)),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(panActivationKey, () => panActivationKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(zoomActivationKey, () => zoomActivationKeyPressed.set(true)),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(zoomActivationKey, () => zoomActivationKeyPressed.set(false)),
    type: 'keyup'
  }}
/>
