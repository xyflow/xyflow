import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import {
  Position,
  getInternalNodesBounds,
  getNodeToolbarTransform,
  type InternalNodeBase,
  type Viewport,
} from '@xyflow/system';

import flowContext from '../modifiers/flow-context.js';
import portal from '../modifiers/portal.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { toCss } from '../utils/style.js';
import type { Node, NodeToolbarArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: NodeToolbarArgs<NodeType>;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class NodeToolbar<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType> | undefined;
  @tracked private viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  private unsubscribeViewport: (() => void) | undefined;

  get isActive() {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }

    let nodes = this.toolbarNodes;

    if (this.store) {
      return nodes.length === 1 && Boolean(nodes[0]?.selected) && this.store.selectedNodes.length === 1;
    }

    return nodes.length === 1 && Boolean(nodes[0]?.selected);
  }

  get toolbarNodes() {
    this.store?.revision;
    let ids = this.nodeIds;

    if (!this.store) {
      return [];
    }

    return ids
      .map((id) => (id ? this.store?.getInternalNode(id) : undefined))
      .filter((node): node is InternalNodeBase<NodeType> => Boolean(node));
  }

  get nodeIds() {
    if (Array.isArray(this.args.nodeId)) {
      return this.args.nodeId;
    }

    return [this.args.nodeId ?? this.args.node?.id].filter((id): id is string => Boolean(id));
  }

  get dataId() {
    return this.toolbarNodes.map((node) => node.id).join(' ');
  }

  get shouldRender() {
    return this.isActive && this.toolbarNodes.length > 0;
  }

  get toolbarClasses() {
    return ['ember-flow__node-toolbar', this.args.className].filter(Boolean).join(' ');
  }

  get toolbarStyle() {
    let nodes = this.toolbarNodes;
    let position = this.args.position ?? Position.Top;
    let align = this.args.align ?? 'center';
    let offset = this.args.offset ?? 10;
    let zIndex = Math.max(...nodes.map((node) => (node.internals?.z ?? 0) + 1), 1);
    let transform = '';

    if (nodes.length > 0) {
      transform = getNodeToolbarTransform(
        getInternalNodesBounds(new Map(nodes.map((node) => [node.id, node]))),
        this.viewport,
        position,
        offset,
        align,
      );
    }

    return htmlSafe(
      [
        'position: absolute',
        'pointer-events: all',
        'transform-origin: 0 0',
        transform ? `transform: ${transform}` : undefined,
        `z-index: ${zIndex}`,
        toCss(this.args.style),
      ]
        .filter(Boolean)
        .join('; '),
    );
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType> | undefined;

    if (!store) {
      return;
    }

    if (this.store === store) {
      this.viewport = store.getViewport();
      return;
    }

    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange((viewport) => {
      this.viewport = { ...viewport };
    });
  }

  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
  }

  <template>
    <span hidden {{flowContext this}}></span>
    {{#if this.shouldRender}}
      <div
        class={{this.toolbarClasses}}
        data-id={{this.dataId}}
        style={{this.toolbarStyle}}
        {{portal 'root'}}
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}
