<script lang="ts">
  import { shortcut } from '@svelte-put/shortcut';

  import { useStore } from '$lib/store';
  import type { KeyHandlerProps } from './types';
  import type { KeyDefinition, KeyDefinitionObject } from '$lib/types';
  import { isMacOs } from '@xyflow/system';

  type $$Props = KeyHandlerProps;

  export let selectionKey: $$Props['selectionKey'] = 'Shift';
  export let multiSelectionKey: $$Props['multiSelectionKey'] = isMacOs() ? 'Meta' : 'Control';
  export let deleteKey: $$Props['deleteKey'] = 'Backspace';
  export let panActivationKey: $$Props['panActivationKey'] = ' ';

  const {
    selectionKeyPressed,
    multiselectionKeyPressed,
    deleteKeyPressed,
    panActivationKeyPressed
  } = useStore();

  function isKeyObject(key?: KeyDefinition): key is KeyDefinitionObject {
    return typeof key === 'object';
  }

  $: selectionKeyString = typeof selectionKey === 'string' ? selectionKey : selectionKey!.key;
  $: selectionKeyModifier = isKeyObject(selectionKey) ? selectionKey?.modifier : [];

  $: multiSelectionKeyString =
    typeof multiSelectionKey === 'string' ? multiSelectionKey : multiSelectionKey!.key;
  $: multiSelectionKeyModifier = isKeyObject(multiSelectionKey) ? multiSelectionKey?.modifier : [];

  $: deleteKeyString = typeof deleteKey === 'string' ? deleteKey : deleteKey!.key;
  $: deleteKeyModifier = isKeyObject(deleteKey) ? deleteKey?.modifier : [];

  $: panActivationKeyString =
    typeof panActivationKey === 'string' ? panActivationKey : panActivationKey!.key;
  $: panActivationKeyModifier = isKeyObject(panActivationKey) ? panActivationKey?.modifier : [];
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      {
        key: selectionKeyString,
        modifier: selectionKeyModifier,
        callback: () => selectionKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        key: selectionKeyString,
        modifier: selectionKeyModifier,
        callback: () => selectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        key: multiSelectionKeyString,
        modifier: multiSelectionKeyModifier,
        callback: () => multiselectionKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        key: multiSelectionKeyString,
        modifier: multiSelectionKeyModifier,
        callback: () => multiselectionKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        key: deleteKeyString,
        modifier: deleteKeyModifier,
        callback: () => {
          deleteKeyPressed.set(true);
        }
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        key: deleteKeyString,
        modifier: deleteKeyModifier,
        callback: () => deleteKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: [
      {
        key: panActivationKeyString,
        modifier: panActivationKeyModifier,
        callback: () => panActivationKeyPressed.set(true)
      }
    ],
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: [
      {
        key: panActivationKeyString,
        modifier: panActivationKeyModifier,
        callback: () => panActivationKeyPressed.set(false)
      }
    ],
    type: 'keyup'
  }}
/>
