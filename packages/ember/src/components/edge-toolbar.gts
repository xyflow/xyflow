import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { Position, type Viewport } from '@xyflow/system';

import EdgeLabel from './edge-label.js';
import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { getEdgePathData } from '../utils/edge-path.js';
import { toCss } from '../utils/style.js';
import { getViewportOverlayTransform } from '../utils/viewport-overlay.js';
import type { EdgeToolbarArgs, Node } from '../types.js';

interface Signature {
  Args: EdgeToolbarArgs;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class EdgeToolbar extends Component<Signature> {
  @tracked private store: EmberFlowStore | undefined;
  @tracked private viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  private unsubscribeViewport: (() => void) | undefined;

  get edge() {
    this.store?.revision;
    return this.args.edgeId ? this.store?.getEdge(this.args.edgeId) : undefined;
  }

  get isActive() {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }

    return Boolean(this.edge?.selected);
  }

  get point() {
    let edge = this.edge;
    let store = this.store;

    if (this.args.x !== undefined && this.args.y !== undefined) {
      return { x: this.args.x, y: this.args.y };
    }

    if (!edge || !store) {
      return { x: 0, y: 0 };
    }

    let source = store.getNode(edge.source) as Node | undefined;
    let target = store.getNode(edge.target) as Node | undefined;

    if (!source || !target) {
      return { x: 0, y: 0 };
    }

    let [, labelX, labelY] = getEdgePathData(edge, source, target, {
      getNodePosition: (node) => store.getNodePosition(node),
      getNodeWidth: (node) => store.getNodeWidth(node),
      getNodeHeight: (node) => store.getNodeHeight(node),
    });

    return { x: labelX, y: labelY };
  }

  get toolbarClasses() {
    return ['ember-flow__edge-toolbar', this.args.className].filter(Boolean).join(' ');
  }

  get toolbarStyle() {
    let point = this.point;
    let offset = this.screenOffset;
    let transform = getViewportOverlayTransform({
      x: point.x,
      y: point.y,
      zoom: this.viewport.zoom,
      offsetX: offset.x,
      offsetY: offset.y,
      alignX: this.args.alignX ?? 'center',
      alignY: this.args.alignY ?? 'center',
    });
    let zIndex = (this.edge?.zIndex ?? 0) + 1;

    return htmlSafe(
      [
        'position: absolute',
        'pointer-events: all',
        'transform-origin: 0 0',
        `transform: ${transform}`,
        `z-index: ${zIndex}`,
        toCss(this.args.style),
      ]
        .filter(Boolean)
        .join('; '),
    );
  }

  private get screenOffset() {
    let offset = this.args.offset ?? 10;

    switch (this.args.position) {
      case Position.Top:
        return { x: 0, y: -offset };
      case Position.Right:
        return { x: offset, y: 0 };
      case Position.Bottom:
        return { x: 0, y: offset };
      case Position.Left:
        return { x: -offset, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element);

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
    <span {{flowContext this}}></span>
    {{#if this.isActive}}
      <EdgeLabel @edgeId={{@edgeId}} @selectEdgeOnClick={{@selectEdgeOnClick}} @transparent={{true}}>
        <div
          class={{this.toolbarClasses}}
          data-id={{@edgeId}}
          data-position={{@position}}
          data-offset={{@offset}}
          data-align-x={{@alignX}}
          data-align-y={{@alignY}}
          style={{this.toolbarStyle}}
          ...attributes
        >
          {{yield}}
        </div>
      </EdgeLabel>
    {{/if}}
  </template>
}
