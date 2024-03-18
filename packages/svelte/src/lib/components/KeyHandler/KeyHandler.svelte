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

  function getShortcutDefinition(keyString: KeyDefinition | KeyDefinition[] | null | undefined) {
    return Array.isArray(keyString)
      ? keyString.map((key) => ({
          key: getKeyString(key),
          modifier: getModifier(key)
        }))
      : [
          {
            key: getKeyString(keyString),
            modifier: getModifier(keyString)
          }
        ];
  }

  function getShortcutTrigger(
    keyDefinition: KeyDefinitionObject[],
    callback: (detail: ShortcutEventDetail) => void
  ) {
    return keyDefinition.map((definition) => ({
      ...definition,
      enabled: definition.key !== null,
      callback
    }));
  }

  $: selectionKeyDefinition = getShortcutDefinition(selectionKey);

  $: multiSelectionKeyDefinition = getShortcutDefinition(multiSelectionKey);

  $: deleteKeyDefinition = getShortcutDefinition(deleteKey);

  $: panActivationKeyDefinition = getShortcutDefinition(panActivationKey);

  $: zoomActivationKeyDefinition = getShortcutDefinition(zoomActivationKey);
</script>

<svelte:window
  use:shortcut={{
    trigger: getShortcutTrigger(selectionKeyDefinition, () => selectionKeyPressed.set(true)),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(selectionKeyDefinition, () => selectionKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(multiSelectionKeyDefinition, () =>
      multiselectionKeyPressed.set(true)
    ),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(multiSelectionKeyDefinition, () =>
      multiselectionKeyPressed.set(false)
    ),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(deleteKeyDefinition, (detail) => {
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
    trigger: getShortcutTrigger(deleteKeyDefinition, () => deleteKeyPressed.set(false)),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(panActivationKeyDefinition, () =>
      panActivationKeyPressed.set(true)
    ),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(panActivationKeyDefinition, () =>
      panActivationKeyPressed.set(false)
    ),
    type: 'keyup'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(zoomActivationKeyDefinition, () =>
      zoomActivationKeyPressed.set(true)
    ),
    type: 'keydown'
  }}
  use:shortcut={{
    trigger: getShortcutTrigger(zoomActivationKeyDefinition, () =>
      zoomActivationKeyPressed.set(false)
    ),
    type: 'keyup'
  }}
/>
