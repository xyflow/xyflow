import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { initialConnection, type ConnectionState, type InternalNodeBase } from '@xyflow/system';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { Edge, Node, UseConnectionArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: UseConnectionArgs;
  Blocks: {
    default: [ConnectionState<InternalNodeBase<NodeType>>];
  };
}

export default class UseConnection<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType, Edge> | undefined;
  @tracked private connection: ConnectionState<InternalNodeBase<NodeType>> = initialConnection;

  private unsubscribeConnection: (() => void) | undefined;

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType, Edge> | undefined;

    if (!store || this.store === store) {
      return;
    }

    this.unsubscribeConnection?.();
    this.store = store;
    this.unsubscribeConnection = store.onConnectionChange((connection) => {
      this.connection = connection as ConnectionState<InternalNodeBase<NodeType>>;
    });
  }

  unregisterFlowContext() {
    this.unsubscribeConnection?.();
    this.unsubscribeConnection = undefined;
    this.store = undefined;
    this.connection = initialConnection;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.connection}}
    {{/if}}
  </template>
}
