import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node } from '../types.js';

interface Signature<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  Blocks: {
    default: [EmberFlowStore<NodeType, EdgeType>];
  };
}

export default class UseEmberFlow<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
> extends Component<Signature<NodeType, EdgeType>> {
  @tracked private store: EmberFlowStore<NodeType, EdgeType> | undefined;

  registerFlowContext(element: HTMLElement) {
    this.store = getFlowStore(element) as EmberFlowStore<NodeType, EdgeType> | undefined;
  }

  unregisterFlowContext() {
    this.store = undefined;
  }

  get hasStore() {
    return Boolean(this.store);
  }

  get flow(): EmberFlowStore<NodeType, EdgeType> {
    return this.store!;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.flow}}
    {{/if}}
  </template>
}
