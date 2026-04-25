import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import EdgeText from './edge-text.js';
import { getEdgePathData } from '../utils/edge-path.js';
import { safeStyle } from '../utils/style.js';
import type { Edge, Node } from '../types.js';

interface Signature {
  Args: {
    edge: Edge;
    source: Node;
    target: Node;
  };
  Element: SVGSVGElement;
}

export default class FlowEdge extends Component<Signature> {
  get pathData() {
    return getEdgePathData(this.args.edge, this.args.source, this.args.target);
  }

  get path() {
    return this.pathData[0];
  }

  get labelX() {
    return this.pathData[1];
  }

  get labelY() {
    return this.pathData[2];
  }

  get label() {
    let label = this.args.edge.label;
    return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;
  }

  get hasLabel() {
    return Boolean(this.label);
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
    return safeStyle(this.args.edge.style);
  }

  get labelStyle() {
    return safeStyle(this.args.edge.labelStyle);
  }

  get labelBgStyle() {
    return safeStyle(this.args.edge.labelBgStyle);
  }

  get labelTransform() {
    return `translate(${this.labelX} ${this.labelY})`;
  }

  get labelBgPadding() {
    return this.args.edge.labelBgPadding ?? [4, 2];
  }

  get labelBgWidth() {
    return Math.max((this.label?.length ?? 0) * 6.5 + this.labelBgPadding[0] * 2, 12);
  }

  get labelBgHeight() {
    return 14 + this.labelBgPadding[1] * 2;
  }

  get labelBgX() {
    return -this.labelBgWidth / 2;
  }

  get labelBgY() {
    return -this.labelBgHeight / 2;
  }

  get labelBgBorderRadius() {
    return this.args.edge.labelBgBorderRadius ?? 2;
  }

  get shouldShowLabelBg() {
    return this.args.edge.labelShowBg ?? true;
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

  get isSelected() {
    return this.args.edge.selected ?? false;
  }

  private markerUrl(marker: Edge['markerStart']) {
    if (!marker) {
      return undefined;
    }

    let type = typeof marker === 'string' ? marker : marker.type;
    return `url('#1__type=${type}')`;
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
        {{#if this.isSelected}}
          <path
            class='ember-flow__edge-selection'
            d={{this.path}}
          />
        {{/if}}
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
        {{#if this.hasLabel}}
          <EdgeText
            @x={{this.labelX}}
            @y={{this.labelY}}
            @label={{this.label}}
            @labelStyle={{@edge.labelStyle}}
            @labelShowBg={{@edge.labelShowBg}}
            @labelBgStyle={{@edge.labelBgStyle}}
            @labelBgPadding={{@edge.labelBgPadding}}
            @labelBgBorderRadius={{@edge.labelBgBorderRadius}}
          />
        {{/if}}
      </g>
    </svg>
  </template>
}
