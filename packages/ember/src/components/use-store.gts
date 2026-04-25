import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseStoreArgs } from '../types.js';

interface Signature<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
  Selected = EmberFlowStore<NodeType, EdgeType>,
> {
  Args: UseStoreArgs<Selected, NodeType, EdgeType>;
  Blocks: {
    default: [Selected, EmberFlowStore<NodeType, EdgeType>];
  };
}

export default class UseStore<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
  Selected = EmberFlowStore<NodeType, EdgeType>,
> extends Component<Signature<NodeType, EdgeType, Selected>> {
  @tracked private store: EmberFlowStore<NodeType, EdgeType> | undefined;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get selected() {
    this.revision;
    let store = this.store;

    if (!store) {
      return undefined as Selected;
    }

    return this.args.selector ? this.args.selector(store) : (store as unknown as Selected);
  }

  get hasStore() {
    return Boolean(this.store);
  }

  get flow() {
    return this.store!;
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType, EdgeType> | undefined;

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
      {{yield this.selected this.flow}}
    {{/if}}
  </template>
}
