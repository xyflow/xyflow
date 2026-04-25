import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { HandleConnection } from '@xyflow/system';

import flowContext from '../modifiers/flow-context.js';
import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { UseHandleConnectionsArgs } from '../types.js';

interface Signature {
  Args: UseHandleConnectionsArgs;
  Blocks: {
    default: [HandleConnection[]];
  };
}

export default class UseHandleConnections extends Component<Signature> {
  @tracked private store: EmberFlowStore | undefined;
  @tracked private contextNodeId: string | null = null;
  @tracked private revision = 0;

  private unsubscribeStore: (() => void) | undefined;

  get nodeId() {
    return this.args.nodeId ?? this.contextNodeId;
  }

  get connections() {
    this.revision;

    if (!this.store || !this.nodeId) {
      return [];
    }

    return this.store.getHandleConnections({
      nodeId: this.nodeId,
      type: this.args.type,
      id: this.args.id,
    });
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element);

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
      {{yield this.connections}}
    {{/if}}
  </template>
}
