import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import flowContext from '../modifiers/flow-context.js';
import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, NodeDataSnapshot, UseNodesDataArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: UseNodesDataArgs;
  Blocks: {
    default: [NodeDataSnapshot<NodeType> | null, NodeDataSnapshot<NodeType>[]];
  };
}

export default class UseNodesData<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType, Edge> | undefined;
  @tracked private contextNodeId: string | null = null;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get nodeIds() {
    if (Array.isArray(this.args.nodeIds)) {
      return this.args.nodeIds;
    }

    return [this.args.nodeIds ?? this.args.nodeId ?? this.contextNodeId].filter((id): id is string => Boolean(id));
  }

  get nodesData() {
    this.revision;

    if (!this.store) {
      return [];
    }

    return this.nodeIds
      .map((id) => this.store?.getNode(id))
      .filter((node): node is NodeType => Boolean(node))
      .map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data,
      })) as NodeDataSnapshot<NodeType>[];
  }

  get nodeData() {
    return this.nodesData[0] ?? null;
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
      {{yield this.nodeData this.nodesData}}
    {{/if}}
  </template>
}
