<script lang="ts">
  import { shortcut, type ShortcutModifierDefinition } from '@svelte-put/shortcut';
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

  $: selectionKeyDefinition = {
    key: getKeyString(selectionKey),
    modifier: getModifier(selectionKey)
  };

  $: multiSelectionKeyDefinition = {
    key: getKeyString(multiSelectionKey),
    modifier: getModifier(multiSelectionKey)
  };

  $: deleteKeyDefinition = {
    key: getKeyString(deleteKey),
    modifier: getModifier(deleteKey)
  };

  $: panActivationKeyDefinition = {
    key: getKeyString(panActivationKey),
    modifier: getModifier(panActivationKey)
  };

  $: zoomActivationKeyDefinition = {
    key: getKeyString(zoomActivationKey),
    modifier: getModifier(zoomActivationKey)
  };
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      {
        ...selectionKeyDefinition,
        enabled: selectionKeyDefinition.key !== null,
        callback: () => selectionKeyPressed.set(true)
      }
    ],

    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...selectionKeyDefinition,
        enabled: selectionKeyDefinition.key !== null,
        callback: () => selectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...multiSelectionKeyDefinition,
        enabled: multiSelectionKeyDefinition.key !== null,
        callback: () => multiselectionKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...multiSelectionKeyDefinition,
        enabled: multiSelectionKeyDefinition.key !== null,
        callback: () => multiselectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...deleteKeyDefinition,
        enabled: deleteKeyDefinition.key !== null,
        callback: (detail) => {
          const isModifierKey =
            detail.originalEvent.ctrlKey ||
            detail.originalEvent.metaKey ||
            detail.originalEvent.shiftKey;
          if (!isModifierKey && !isInputDOMNode(detail.originalEvent)) {
            deleteKeyPressed.set(true);
          }
        }
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...deleteKeyDefinition,
        enabled: deleteKeyDefinition.key !== null,
        callback: () => deleteKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...panActivationKeyDefinition,
        enabled: panActivationKeyDefinition.key !== null,
        callback: () => panActivationKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...panActivationKeyDefinition,
        enabled: panActivationKeyDefinition.key !== null,
        callback: () => panActivationKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...zoomActivationKeyDefinition,
        enabled: zoomActivationKeyDefinition.key !== null,
        callback: () => zoomActivationKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...zoomActivationKeyDefinition,
        enabled: zoomActivationKeyDefinition.key !== null,
        callback: () => zoomActivationKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
/>
