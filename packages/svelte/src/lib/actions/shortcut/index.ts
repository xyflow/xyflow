// Shortcut action is copied and slightly adjusted from https://github.com/vnphanquang/svelte-put/tree/main/packages/actions/shortcut
// If this discussion https://github.com/vnphanquang/svelte-put/discussions/256 gets resolved, we will use the original action again.

export interface ShortcutEventDetail {
  event: KeyboardEvent;
  trigger: ShortcutTrigger;
}

export type ShortcutModifier = 'alt' | 'ctrl' | 'meta' | 'shift';

export type ShortcutModifierDefinition =
  | ShortcutModifier
  | ShortcutModifier[]
  | ShortcutModifier[][];

export type ShortcutTrigger = {
  enabled?: boolean;
  modifier?: ShortcutModifierDefinition;
  id?: string;
  key: string;
  callback?: (detail: ShortcutEventDetail) => void;
  preventDefault?: boolean;
};

export type ShortcutParameter = {
  enabled?: boolean;
  trigger: Array<ShortcutTrigger> | ShortcutTrigger;
  type?: 'keydown' | 'keyup';
};

export function shortcut(node: Window, param: ShortcutParameter) {
  let { enabled = true, trigger, type = 'keydown' } = param;

  function handler(event: KeyboardEvent) {
    const normalizedTriggers = Array.isArray(trigger) ? trigger : [trigger];
    const modifiedMap = {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      meta: event.metaKey
    };
    for (const trigger of normalizedTriggers) {
      const mergedTrigger = {
        modifier: [],
        preventDefault: false,
        enabled: true,
        ...trigger
      };
      const { modifier, key, callback, preventDefault, enabled: triggerEnabled } = mergedTrigger;
      if (triggerEnabled) {
        if (modifier.length) {
          const modifierDefs = (Array.isArray(modifier) ? modifier : [modifier]).map((def) =>
            typeof def === 'string' ? [def] : def
          );
          const modified = modifierDefs.some((def) =>
            def.every((modifier) => modifiedMap[modifier])
          );
          if (!modified) continue;
        }
        if (event.key === key) {
          if (preventDefault) event.preventDefault();
          const detail = { event, trigger: mergedTrigger };
          callback?.(detail);
        }
      }
    }
  }

  if (enabled) node.addEventListener(type, handler);

  return {
    update: (update: ShortcutParameter) => {
      const { enabled: newEnabled = true, type: newType = 'keydown' } = update;

      if (enabled && (!newEnabled || type !== newType)) {
        node.removeEventListener(type, handler);
      } else if (!enabled && newEnabled) {
        node.addEventListener(newType, handler);
      }

      enabled = newEnabled;
      type = newType;
      trigger = update.trigger;
    },
    destroy: () => {
      node.removeEventListener(type, handler);
    }
  };
}
