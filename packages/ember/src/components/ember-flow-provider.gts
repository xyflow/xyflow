import Component from '@glimmer/component';

import EmberFlowStore from '../store/index.js';
import type { Edge, Node } from '../types.js';
import type { Viewport } from '@xyflow/system';

interface Signature<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  Args: {
    initialViewport?: Viewport;
    store?: EmberFlowStore<NodeType, EdgeType>;
  };
  Blocks: {
    default: [EmberFlowStore<NodeType, EdgeType>];
  };
}

export default class EmberFlowProvider<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge,
> extends Component<Signature<NodeType, EdgeType>> {
  private ownedStore = new EmberFlowStore<NodeType, EdgeType>(this.args.initialViewport);

  get store() {
    return this.args.store ?? this.ownedStore;
  }

  <template>
    {{yield this.store}}
  </template>
}
