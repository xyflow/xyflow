import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseNodesArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: UseNodesArgs;
  Blocks: {
    default: [NodeType[]];
  };
}

export default class UseNodes<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType, Edge> | undefined;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get nodes() {
    this.revision;
    return this.store?.getNodes() ?? [];
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType, Edge> | undefined;

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
      {{yield this.nodes}}
    {{/if}}
  </template>
}
