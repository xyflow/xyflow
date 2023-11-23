<script lang="ts">
  import { shortcut, type ShortcutModifierDefinition } from '@svelte-put/shortcut';

  import { useStore } from '$lib/store';
  import type { KeyHandlerProps } from './types';
  import type { KeyDefinition, KeyDefinitionObject } from '$lib/types';
  import { isMacOs } from '@xyflow/system';

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
    return typeof key === 'object';
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
        callback: () => selectionKeyDefinition.key && selectionKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...selectionKeyDefinition,
        callback: () => selectionKeyDefinition.key && selectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...multiSelectionKeyDefinition,
        callback: () => multiSelectionKeyDefinition.key && multiselectionKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...multiSelectionKeyDefinition,
        callback: () => multiSelectionKeyDefinition.key && multiselectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...deleteKeyDefinition,
        callback: () => deleteKeyDefinition.key && deleteKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...deleteKeyDefinition,
        callback: () => deleteKeyDefinition.key && deleteKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...panActivationKeyDefinition,
        callback: () => panActivationKeyDefinition.key && panActivationKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...panActivationKeyDefinition,
        callback: () => panActivationKeyDefinition.key && panActivationKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        ...zoomActivationKeyDefinition,
        callback: () => zoomActivationKeyDefinition.key && zoomActivationKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        ...zoomActivationKeyDefinition,
        callback: () => zoomActivationKeyDefinition.key && zoomActivationKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
/>
