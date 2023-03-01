<script lang="ts">
  import { shortcut } from '@svelte-put/shortcut';

  import { useStore } from '$lib/store';
  import type { KeyHandlerProps } from './types';
  import type { KeyDefinition, KeyDefinitionObject } from '$lib/types';

  const { selectionKeyPressed, deleteKeyPressed } = useStore();

  type $$Props = KeyHandlerProps;

  export let selectionKey: $$Props['selectionKey'] = 'Shift';
  export let deleteKey: $$Props['deleteKey'] = 'Backspace';

  function isKeyObject(key?: KeyDefinition): key is KeyDefinitionObject {
    return typeof key === 'object';
  }

  $: selectionKeyString = typeof selectionKey === 'string' ? selectionKey : selectionKey!.key;
  $: selectionKeyModifier = isKeyObject(selectionKey) ? selectionKey?.modifier : [];

  $: deleteKeyString = typeof deleteKey === 'string' ? deleteKey : deleteKey!.key;
  $: deleteKeyModifier = isKeyObject(deleteKey) ? deleteKey?.modifier : [];
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
        key: deleteKeyString,
        modifier: deleteKeyModifier,
        callback: () => deleteKeyPressed.set(true)
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
/>
