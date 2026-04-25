import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseEdgesArgs } from '../types.js';

interface Signature<EdgeType extends Edge = Edge> {
  Args: UseEdgesArgs;
  Blocks: {
    default: [EdgeType[]];
  };
}

export default class UseEdges<EdgeType extends Edge = Edge> extends Component<Signature<EdgeType>> {
  @tracked private store: EmberFlowStore<Node, EdgeType> | undefined;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get edges() {
    this.revision;
    return this.store?.getEdges() ?? [];
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<Node, EdgeType> | undefined;

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
      {{yield this.edges}}
    {{/if}}
  </template>
}
