<script lang="ts">
  import {
    shortcut,
    type ShortcutEventDetail,
    type ShortcutModifierDefinition
  } from '@svelte-put/shortcut';
  import { isInputDOMNode, isMacOs } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { KeyHandlerProps } from './types';
  import type { KeyDefinition, KeyDefinitionObject } from '$lib/types';

  type $$Props = KeyHandlerProps;

  export let selectionKey: $$Props['selectionKey'] = 'Shift';
  export let multiSelectionKey: $$Props['multiSelectionKey'] = isMacOs() ? 'Meta' : 'Control';
  export let deleteKey: $$Props['deleteKey'] = 'Backspace';
  export let panActivationKey: $$Props['panActivationKey'] = ' ';
  export let zoomActivationKey: $$Props['zoomActivationKey'] = isMacOs() ? 'Meta' : 'Control';

  const {
    selectionKeyPressed,
    multiselectionKeyPressed,
    deleteKeyPressed,
    panActivationKeyPressed,
    zoomActivationKeyPressed
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

  function resetAll() {
    selectionKeyPressed.set(false);
    multiselectionKeyPressed.set(false);
    deleteKeyPressed.set(false);
    panActivationKeyPressed.set(false);
    zoomActivationKeyPressed.set(false);
  }
</script>

<svelte:window
  on:blur={resetAll}
  on:contextmenu={resetAll}
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
