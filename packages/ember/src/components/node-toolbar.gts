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
import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import nodeToolbar from '../modifiers/node-toolbar.js';
import portal from '../modifiers/portal.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { toCss } from '../utils/style.js';
import type { Node, NodeToolbarArgs, NodeToolbarContext } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: NodeToolbarArgs<NodeType>;
  Blocks: {
    default: [EmberFlowStore<NodeType>, NodeToolbarContext<NodeType>];
  };
  Element: HTMLDivElement;
}

export default class NodeToolbar<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType> | undefined;
  @tracked private contextNodeId: string | null = null;

  private viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  private element: HTMLElement | undefined;
  private unsubscribeViewport: (() => void) | undefined;
  private unsubscribeNodeGeometry: (() => void) | undefined;

  get toolbarState() {
    let nodes = this.toolbarNodes;
    let isActive = this.isActive(nodes);

    return {
      nodes,
      isActive,
      shouldRender: isActive && nodes.length > 0,
      classes: this.toolbarClasses,
      dataId: nodes.map((node) => node.id).join(' '),
      style: this.getToolbarStyle(nodes),
      context: this.getToolbarContext(nodes, isActive),
    };
  }

  get toolbarStore() {
    return this.store as EmberFlowStore<NodeType>;
  }

  private isActive(nodes: InternalNodeBase<NodeType>[]) {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }

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

    return [this.args.nodeId ?? this.args.node?.id ?? this.contextNodeId].filter((id): id is string => Boolean(id));
  }

  get toolbarClasses() {
    return ['ember-flow__node-toolbar', this.args.className].filter(Boolean).join(' ');
  }

  private getToolbarTransform(nodes: InternalNodeBase<NodeType>[]) {
    let position = this.args.position ?? Position.Top;
    let align = this.args.align ?? 'center';
    let offset = this.args.offset ?? 10;

    if (nodes.length === 0) {
      return '';
    }

    return getNodeToolbarTransform(
      getInternalNodesBounds(new Map(nodes.map((node) => [node.id, node]))),
      this.viewport,
      position,
      offset,
      align,
    );
  }

  private getToolbarZIndex(nodes: InternalNodeBase<NodeType>[]) {
    return Math.max(...nodes.map((node) => (node.internals?.z ?? 0) + 1), 1);
  }

  private getToolbarStyle(nodes: InternalNodeBase<NodeType>[]) {
    let transform = this.getToolbarTransform(nodes);
    let zIndex = this.getToolbarZIndex(nodes);

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

  private getToolbarContext(
    nodes: InternalNodeBase<NodeType>[],
    isVisible: boolean
  ): NodeToolbarContext<NodeType> {
    return {
      nodes: nodes.map((node) => this.store?.getNode(node.id) ?? node.internals.userNode),
      nodeIds: nodes.map((node) => node.id),
      isVisible,
    };
  }

  registerNodeToolbar(element: HTMLElement) {
    this.element = element;
    this.updateToolbarElement();
  }

  unregisterNodeToolbar() {
    this.element = undefined;
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType> | undefined;

    if (!store) {
      return;
    }

    if (this.store === store) {
      this.viewport = store.getViewport();
      this.updateToolbarElement();
      return;
    }

    this.unsubscribeViewport?.();
    this.unsubscribeNodeGeometry?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange((viewport) => {
      this.viewport = viewport;
      this.updateToolbarElement();
    });
    this.unsubscribeNodeGeometry = store.onNodeGeometryChange((nodeId) => {
      if (this.nodeIds.includes(nodeId)) {
        this.updateToolbarElement();
      }
    });
  }

  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeNodeGeometry?.();
    this.unsubscribeViewport = undefined;
    this.unsubscribeNodeGeometry = undefined;
    this.store = undefined;
    this.element = undefined;
  }

  registerNodeContext(element: HTMLElement) {
    this.contextNodeId = getNodeId(element);
  }

  unregisterNodeContext() {
    this.contextNodeId = null;
  }

  private updateToolbarElement() {
    let element = this.element;
    if (!element) {
      return;
    }

    let nodes = this.toolbarNodes;
    if (!this.isActive(nodes) || nodes.length === 0) {
      return;
    }

    element.style.transform = this.getToolbarTransform(nodes);
    element.style.zIndex = String(this.getToolbarZIndex(nodes));
  }

  <template>
    <span hidden {{flowContext this}}></span>
    <span hidden {{nodeIdContext this}}></span>
    {{#let this.toolbarState as |toolbar|}}
      {{#if toolbar.shouldRender}}
        <div
          class={{toolbar.classes}}
          data-id={{toolbar.dataId}}
          style={{toolbar.style}}
          {{portal '.ember-flow__renderer'}}
          {{nodeToolbar this}}
          ...attributes
        >
          {{yield this.toolbarStore toolbar.context}}
        </div>
      {{/if}}
    {{/let}}
  </template>
}
