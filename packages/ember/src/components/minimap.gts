import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { XYMinimap, type Rect, type Viewport, type XYMinimapInstance } from '@xyflow/system';

import miniMap from '../modifiers/minimap.js';
import listen from '../modifiers/listen.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { MiniMapArgs, Node } from '../types.js';
import MiniMapNode from './minimap-node.js';

interface MiniMapNodeItem<NodeType extends Node = Node> {
  node: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  strokeColor?: string;
  className?: string;
}

interface Signature<NodeType extends Node = Node> {
  Args: MiniMapArgs<NodeType>;
  Element: HTMLDivElement;
}

const defaultWidth = 200;
const defaultHeight = 150;

export default class MiniMap<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  @tracked private store: EmberFlowStore<NodeType> | undefined;
  @tracked private viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  private unsubscribeViewport: (() => void) | undefined;
  private minimapElement: HTMLElement | undefined;
  private minimapInstance: XYMinimapInstance | undefined;

  get width() {
    return this.args.width ?? defaultWidth;
  }

  get height() {
    return this.args.height ?? defaultHeight;
  }

  get positionClasses() {
    let position = this.args.position ?? 'bottom-right';
    return position.replace('-', ' ');
  }

  get viewBB(): Rect {
    let store = this.store;
    let zoom = this.viewport.zoom || 1;

    return {
      x: -this.viewport.x / zoom,
      y: -this.viewport.y / zoom,
      width: (store?.width || 1) / zoom,
      height: (store?.height || 1) / zoom,
    };
  }

  get boundingRect(): Rect {
    let nodeBounds = this.nodeItems.map((item) => ({
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    }));

    return this.getBounds([this.viewBB, ...nodeBounds]);
  }

  get viewScale() {
    let bounds = this.boundingRect;
    return Math.max(bounds.width / this.width, bounds.height / this.height, 1);
  }

  get offset() {
    return (this.args.offsetScale ?? 5) * this.viewScale;
  }

  get viewBoxRect(): Rect {
    let bounds = this.boundingRect;
    let viewWidth = this.viewScale * this.width;
    let viewHeight = this.viewScale * this.height;

    return {
      x: bounds.x - (viewWidth - bounds.width) / 2 - this.offset,
      y: bounds.y - (viewHeight - bounds.height) / 2 - this.offset,
      width: viewWidth + this.offset * 2,
      height: viewHeight + this.offset * 2,
    };
  }

  get viewBox() {
    let box = this.viewBoxRect;
    return `${box.x} ${box.y} ${box.width} ${box.height}`;
  }

  get maskPath() {
    let box = this.viewBoxRect;
    let view = this.viewBB;
    let offset = this.offset;

    return `M${box.x - offset},${box.y - offset}h${box.width + offset * 2}v${box.height + offset * 2}h${-box.width - offset * 2}z M${view.x},${view.y}h${view.width}v${view.height}h${-view.width}z`;
  }

  get labelledBy() {
    return 'ember-flow__minimap-desc';
  }

  get ariaLabel() {
    return this.args.ariaLabel ?? 'Mini Map';
  }

  get rootStyle() {
    let declarations = [
      this.cssVariable('--xy-minimap-background-color-props', this.args.bgColor),
      this.cssVariable('--xy-minimap-mask-background-color-props', this.args.maskColor),
      this.cssVariable('--xy-minimap-mask-stroke-color-props', this.args.maskStrokeColor),
      this.cssVariable(
        '--xy-minimap-mask-stroke-width-props',
        typeof this.args.maskStrokeWidth === 'number'
          ? this.args.maskStrokeWidth * this.viewScale
          : undefined,
      ),
    ].filter(Boolean);

    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }

  get svgStyle() {
    let declarations = [
      this.cssVariable(
        '--xy-minimap-node-stroke-width-props',
        typeof this.args.nodeStrokeWidth === 'number' ? this.args.nodeStrokeWidth : undefined,
      ),
    ].filter(Boolean);

    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }

  get nodeItems(): MiniMapNodeItem<NodeType>[] {
    let store = this.store;
    if (!store) {
      return [];
    }

    store.revision;

    return store
      .getNodes()
      .filter((node) => !node.hidden)
      .map((node) => ({
        node,
        x: store.getNodePosition(node).x,
        y: store.getNodePosition(node).y,
        width: store.getNodeWidth(node),
        height: store.getNodeHeight(node),
        color: this.resolveNodeAttribute(this.args.nodeColor, node) ?? this.nodeBackground(node),
        strokeColor: this.resolveNodeAttribute(this.args.nodeStrokeColor, node),
        className: this.resolveNodeAttribute(this.args.nodeClassName ?? this.args.nodeClass, node),
      }));
  }

  registerMiniMap(element: HTMLElement) {
    let store = getFlowStore(element) as EmberFlowStore<NodeType> | undefined;

    if (!store) {
      return;
    }

    this.minimapElement = element;

    if (this.store === store) {
      this.viewport = store.getViewport();
      this.installOrUpdateMiniMap();
      return;
    }

    this.unsubscribeViewport?.();
    this.minimapInstance?.destroy();
    this.minimapInstance = undefined;
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange((viewport) => {
      this.viewport = { ...viewport };
      this.installOrUpdateMiniMap();
    });
    this.installOrUpdateMiniMap();
  }

  unregisterMiniMap() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.minimapInstance?.destroy();
    this.minimapInstance = undefined;
    this.minimapElement = undefined;
    this.store = undefined;
  }

  handleSvgClick = (event: MouseEvent) => {
    if (!this.args.onClick) {
      return;
    }

    let target = event.currentTarget as SVGSVGElement;
    let rect = target.getBoundingClientRect();
    let box = this.viewBoxRect;
    let x = box.x + ((event.clientX - rect.left) / rect.width) * box.width;
    let y = box.y + ((event.clientY - rect.top) / rect.height) * box.height;

    this.args.onClick(event, { x, y });
  };

  handleNodeClick = (nodeId: string, event: MouseEvent) => {
    let node = this.store?.getNode(nodeId);

    if (!node || !this.args.onNodeClick) {
      return;
    }

    event.stopPropagation();
    this.args.onNodeClick(event, node);
  };

  private getBounds(rects: Rect[]): Rect {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let rect of rects) {
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }

    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1),
    };
  }

  private resolveNodeAttribute(
    attribute: string | ((node: NodeType) => string) | undefined,
    node: NodeType,
  ) {
    return typeof attribute === 'function' ? attribute(node) : attribute;
  }

  private nodeBackground(node: NodeType) {
    let style = node.style;

    if (!style || typeof style === 'string') {
      return undefined;
    }

    let background = style['background'] ?? style['backgroundColor'];
    return background === undefined ? undefined : String(background);
  }

  private cssVariable(name: string, value: string | number | undefined) {
    return value === undefined ? undefined : `${name}: ${value}`;
  }

  private installOrUpdateMiniMap() {
    let store = this.store;
    let svg = this.minimapElement?.querySelector<SVGSVGElement>('.ember-flow__minimap-svg');

    if (!store?.panZoom || !svg) {
      return;
    }

    this.minimapInstance ??= XYMinimap({
      domNode: svg,
      panZoom: store.panZoom,
      getTransform: () => [this.viewport.x, this.viewport.y, this.viewport.zoom],
      getViewScale: () => this.viewScale,
    });

    this.minimapInstance.update({
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height,
      inversePan: this.args.inversePan,
      pannable: this.args.pannable ?? false,
      zoomStep: this.args.zoomStep,
      zoomable: this.args.zoomable ?? false,
    });
  }

  <template>
    <div
      class='ember-flow__minimap ember-flow__panel {{this.positionClasses}}'
      data-testid='ember-flow__minimap'
      style={{this.rootStyle}}
      {{miniMap this}}
      ...attributes
    >
      <svg
        width={{this.width}}
        height={{this.height}}
        viewBox={{this.viewBox}}
        class='ember-flow__minimap-svg'
        role='img'
        aria-labelledby={{this.labelledBy}}
        style={{this.svgStyle}}
        {{listen 'click' this.handleSvgClick}}
      >
        {{#if this.ariaLabel}}
          <title id={{this.labelledBy}}>{{this.ariaLabel}}</title>
        {{/if}}

        {{#each this.nodeItems as |item|}}
          <MiniMapNode
            @id={{item.node.id}}
            @x={{item.x}}
            @y={{item.y}}
            @width={{item.width}}
            @height={{item.height}}
            @borderRadius={{@nodeBorderRadius}}
            @color={{item.color}}
            @strokeColor={{item.strokeColor}}
            @strokeWidth={{@nodeStrokeWidth}}
            @className={{item.className}}
            @selected={{item.node.selected}}
            @shapeRendering='crispEdges'
            @onClick={{this.handleNodeClick}}
          />
        {{/each}}

        <path
          class='ember-flow__minimap-mask'
          d={{this.maskPath}}
          fill-rule='evenodd'
          pointer-events='none'
        />
      </svg>
    </div>
  </template>
}
