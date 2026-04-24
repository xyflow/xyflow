import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { Position, getBezierPath } from '@xyflow/system';

import type { CssStyle, Edge, Node } from '../types.js';

interface Signature {
  Args: {
    edge: Edge;
    source: Node;
    target: Node;
  };
  Element: SVGSVGElement;
}

export default class FlowEdge extends Component<Signature> {
  get path() {
    let sourcePosition = this.args.source.sourcePosition ?? Position.Bottom;
    let targetPosition = this.args.target.targetPosition ?? Position.Top;
    let source = this.getHandlePosition(this.args.source, sourcePosition);
    let target = this.getHandlePosition(this.args.target, targetPosition);

    return getBezierPath({
      sourceX: source.x,
      sourceY: source.y,
      sourcePosition,
      targetX: target.x,
      targetY: target.y,
      targetPosition,
    })[0];
  }

  get edgeClass() {
    let classes = ['ember-flow__edge'];

    if (this.args.edge.type) {
      classes.push(`ember-flow__edge-${this.args.edge.type}`);
    }

    if (this.args.edge.animated) {
      classes.push('animated');
    }

    if (this.args.edge.selected) {
      classes.push('selected');
    }

    if (this.args.edge.selectable !== false) {
      classes.push('selectable');
    }

    let edgeClass = this.args.edge.class ?? this.args.edge.className;
    if (edgeClass) {
      classes.push(edgeClass);
    }

    return classes.join(' ');
  }

  get edgeStyle() {
    return this.args.edge.style ? htmlSafe(this.toCss(this.args.edge.style)) : undefined;
  }

  get svgStyle() {
    let zIndex = this.args.edge.zIndex ?? (this.args.source.parentId || this.args.target.parentId ? 1 : 0);
    return htmlSafe(`z-index: ${zIndex};`);
  }

  get interactionWidth() {
    return (this.args.edge.interactionWidth ?? 20) + 4;
  }

  get markerStart() {
    return this.markerUrl(this.args.edge.markerStart);
  }

  get markerEnd() {
    return this.markerUrl(this.args.edge.markerEnd);
  }

  private markerUrl(marker: Edge['markerStart']) {
    if (!marker) {
      return undefined;
    }

    let type = typeof marker === 'string' ? marker : marker.type;
    return `url('#1__type=${type}')`;
  }

  private toCss(style: CssStyle) {
    if (typeof style === 'string') {
      return style;
    }

    return Object.entries(style)
      .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
      .map(([property, value]) => `${property}: ${value};`)
      .join(' ');
  }

  private getHandlePosition(node: Node, position: Position) {
    let width = node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
    let height = node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
    let { x, y } = node.position;

    switch (position) {
      case Position.Top:
        return { x: x + width / 2, y };
      case Position.Right:
        return { x: x + width, y: y + height / 2 };
      case Position.Bottom:
        return { x: x + width / 2, y: y + height };
      case Position.Left:
        return { x, y: y + height / 2 };
    }
  }

  <template>
    <svg class='ember-flow__edge-wrapper' style={{this.svgStyle}}>
      <g
        class={{this.edgeClass}}
        id={{@edge.id}}
        data-id={{@edge.id}}
        data-testid='rf__edge-{{@edge.id}}'
        role='group'
        aria-label={{if @edge.ariaLabel @edge.ariaLabel @edge.id}}
      >
        <path
          class='ember-flow__edge-path'
          d={{this.path}}
          style={{this.edgeStyle}}
          marker-start={{this.markerStart}}
          marker-end={{this.markerEnd}}
        />
        <path
          class='ember-flow__edge-interaction'
          d={{this.path}}
          stroke-width={{this.interactionWidth}}
        />
      </g>
    </svg>
  </template>
}
