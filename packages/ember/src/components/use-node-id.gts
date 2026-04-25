import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import type { UseNodeIdArgs } from '../types.js';

interface Signature {
  Args: UseNodeIdArgs;
  Blocks: {
    default: [string | null];
  };
}

export default class UseNodeId extends Component<Signature> {
  @tracked private contextNodeId: string | null = null;

  get nodeId() {
    return this.contextNodeId;
  }

  registerNodeContext(element: HTMLElement) {
    this.contextNodeId = getNodeId(element);
  }

  unregisterNodeContext() {
    this.contextNodeId = null;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__node-id-access' {{nodeIdContext this}}></span>
    {{yield this.nodeId}}
  </template>
}
