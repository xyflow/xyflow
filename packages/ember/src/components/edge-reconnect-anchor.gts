import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

import EdgeLabel from './edge-label.js';
import flowContext from '../modifiers/flow-context.js';
import listen from '../modifiers/listen.js';
import { getFlowController, type EmberFlowController } from '../store/controller.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { toCss } from '../utils/style.js';
import type { Edge, EdgeReconnectAnchorArgs, EdgeReconnectAnchorEventDetail, Node } from '../types.js';

interface Signature<EdgeType extends Edge = Edge> {
  Args: EdgeReconnectAnchorArgs<EdgeType>;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class EdgeReconnectAnchor<EdgeType extends Edge = Edge> extends Component<Signature<EdgeType>> {
  @tracked private store: EmberFlowStore<Node, EdgeType> | undefined;
  private controller: EmberFlowController<EdgeType> | undefined;

  registerFlowContext(element: HTMLElement) {
    this.store = getFlowStore(element) as EmberFlowStore<Node, EdgeType> | undefined;
    this.controller = getFlowController<EdgeType>(element);
  }

  unregisterFlowContext() {
    this.store = undefined;
    this.controller = undefined;
  }

  get edge() {
    if (this.args.edge) {
      return this.args.edge;
    }

    if (!this.args.edgeId) {
      return undefined;
    }

    return this.store?.getEdge(this.args.edgeId);
  }

  get edgeId() {
    return this.args.edgeId ?? this.args.edge?.id;
  }

  get hasEdge() {
    return Boolean(this.edge);
  }

  get size() {
    return this.args.size ?? 25;
  }

  get x() {
    return this.args.position?.x;
  }

  get y() {
    return this.args.position?.y;
  }

  get classes() {
    return [
      'ember-flow__edgeupdater',
      this.args.type ? `ember-flow__edgeupdater-${this.args.type}` : undefined,
      'nopan',
      'nodrag',
      this.args.class,
      this.args.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get style() {
    return htmlSafe(['width: 100%', 'height: 100%', toCss(this.args.style)].filter(Boolean).join('; '));
  }

  get oppositeType() {
    return this.args.type === 'source' ? 'target' : 'source';
  }

  private findFixedElement(element: HTMLElement) {
    let edgeId = this.edgeId;
    if (!edgeId) {
      return null;
    }

    return element
      .closest('.ember-flow__edge-labels')
      ?.querySelector<HTMLElement>(
        `.ember-flow__edgeupdater-${this.oppositeType}[data-edgeid="${this.escapeAttribute(edgeId)}"]`,
      );
  }

  private escapeAttribute(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  @action
  handlePointerDown(event: PointerEvent) {
    let edge = this.edge;
    if (!edge || !this.args.type || event.button !== 0) {
      return;
    }

    let element = event.currentTarget as HTMLElement;
    let detail: EdgeReconnectAnchorEventDetail<EdgeType> = {
      edge,
      handleType: this.args.type,
      pointerEvent: event,
      fixedElement: this.findFixedElement(element),
    };

    if (this.controller) {
      this.controller.startEdgeReconnect(detail.edge, detail.handleType, detail.pointerEvent, detail.fixedElement);
      return;
    }

    element.dispatchEvent(
      new CustomEvent('ember-flow:edge-reconnect', {
        bubbles: true,
        detail,
      }),
    );
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__edge-reconnect-context' {{flowContext this}}></span>
    {{#if this.hasEdge}}
      <EdgeLabel
        @x={{this.x}}
        @y={{this.y}}
        @width={{this.size}}
        @height={{this.size}}
        @transparent={{true}}
        data-id={{this.edgeId}}
        data-edgeid={{this.edgeId}}
      >
        <div
          class={{this.classes}}
          data-id={{this.edgeId}}
          data-edgeid={{this.edgeId}}
          data-drag-threshold={{@dragThreshold}}
          style={{this.style}}
          {{listen 'pointerdown' this.handlePointerDown}}
          ...attributes
        >
          {{#unless @reconnecting}}
            {{yield}}
          {{/unless}}
        </div>
      </EdgeLabel>
    {{/if}}
  </template>
}
