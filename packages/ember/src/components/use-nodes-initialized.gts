import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseNodesInitializedArgs } from '../types.js';

interface Signature {
  Args: UseNodesInitializedArgs;
  Blocks: {
    default: [boolean];
  };
}

export default class UseNodesInitialized extends Component<Signature> {
  @tracked private store: EmberFlowStore<Node, Edge> | undefined;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get initialized() {
    this.revision;
    return this.store?.nodesInitialized ?? false;
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<Node, Edge> | undefined;

    if (!store || this.store === store) {
      return;
    }

    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }

  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.initialized}}
    {{/if}}
  </template>
}
