import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseKeyPressArgs } from '../types.js';

interface Signature {
  Args: UseKeyPressArgs;
  Blocks: {
    default: [boolean, Set<string>];
  };
}

export default class UseKeyPress extends Component<Signature> {
  @tracked private store: EmberFlowStore<Node, Edge> | undefined;
  @tracked private pressedKeys = new Set<string>();

  private unsubscribeKeys: (() => void) | undefined;

  get keys() {
    let key = this.args.key;
    if (key === undefined) {
      return [];
    }

    if (key === null) {
      return [];
    }

    return Array.isArray(key) ? key : [key];
  }

  get pressed() {
    if (this.keys.length === 0) {
      return false;
    }

    return this.keys.some((key) => this.pressedKeys.has(key));
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<Node, Edge> | undefined;

    if (!store || this.store === store) {
      return;
    }

    this.unsubscribeKeys?.();
    this.store = store;
    this.unsubscribeKeys = store.onKeyChange((keys) => {
      this.pressedKeys = keys;
    });
  }

  unregisterFlowContext() {
    this.unsubscribeKeys?.();
    this.unsubscribeKeys = undefined;
    this.store = undefined;
    this.pressedKeys = new Set();
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.pressed this.pressedKeys}}
    {{/if}}
  </template>
}
