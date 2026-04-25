import Component from '@glimmer/component';

import EdgeText from './edge-text.js';
import { safeStyle } from '../utils/style.js';
import type { CssStyle } from '../types.js';

interface Signature {
  Args: {
    id?: string;
    path: string;
    className?: string;
    style?: CssStyle;
    markerStart?: string;
    markerEnd?: string;
    interactionWidth?: number;
    label?: string | number;
    labelX?: number;
    labelY?: number;
    labelStyle?: CssStyle;
    labelShowBg?: boolean;
    labelBgStyle?: CssStyle;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
  };
  Element: SVGGElement;
}

export default class BaseEdge extends Component<Signature> {
  get pathClass() {
    return ['ember-flow__edge-path', this.args.className].filter(Boolean).join(' ');
  }

  get edgeStyle() {
    return safeStyle(this.args.style);
  }

  get interactionWidth() {
    return this.args.interactionWidth ?? 20;
  }

  <template>
    <g ...attributes>
      <path
        id={{@id}}
        class={{this.pathClass}}
        d={{@path}}
        style={{this.edgeStyle}}
        marker-start={{@markerStart}}
        marker-end={{@markerEnd}}
      />
      {{#if this.interactionWidth}}
        <path
          class='ember-flow__edge-interaction'
          d={{@path}}
          stroke-width={{this.interactionWidth}}
        />
      {{/if}}
      <EdgeText
        @x={{@labelX}}
        @y={{@labelY}}
        @label={{@label}}
        @labelStyle={{@labelStyle}}
        @labelShowBg={{@labelShowBg}}
        @labelBgStyle={{@labelBgStyle}}
        @labelBgPadding={{@labelBgPadding}}
        @labelBgBorderRadius={{@labelBgBorderRadius}}
      />
    </g>
  </template>
}
