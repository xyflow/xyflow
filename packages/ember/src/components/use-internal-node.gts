import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, InternalNode, Node, UseInternalNodeArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: UseInternalNodeArgs;
  Blocks: {
    default: [InternalNode<NodeType> | null];
  };
}

export default class UseInternalNode<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType, Edge> | undefined;
  @tracked private contextNodeId: string | null = null;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get nodeId() {
    return this.args.nodeId ?? this.args.id ?? this.contextNodeId;
  }

  get internalNode() {
    this.revision;
    return this.nodeId ? (this.store?.getInternalNode(this.nodeId) as InternalNode<NodeType> | undefined) ?? null : null;
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

  registerNodeContext(element: HTMLElement) {
    this.contextNodeId = getNodeId(element);
  }

  unregisterNodeContext() {
    this.contextNodeId = null;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    <span hidden aria-hidden='true' class='ember-flow__node-id-access' {{nodeIdContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.internalNode}}
    {{/if}}
  </template>
}
