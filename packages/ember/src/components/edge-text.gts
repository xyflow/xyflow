import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import { safeStyle } from '../utils/style.js';
import type { CssStyle } from '../types.js';

interface Signature {
  Args: {
    x?: number;
    y?: number;
    label?: string | number;
    labelStyle?: CssStyle;
    labelShowBg?: boolean;
    labelBgStyle?: CssStyle;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    className?: string;
  };
  Blocks: {
    default: [];
  };
  Element: SVGGElement;
}

export default class EdgeText extends Component<Signature> {
  get label() {
    let label = this.args.label;
    return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;
  }

  get hasLabel() {
    return Boolean(this.label);
  }

  get textClasses() {
    return ['ember-flow__edge-textwrapper', this.args.className].filter(Boolean).join(' ');
  }

  get transform() {
    return `translate(${this.args.x ?? 0} ${this.args.y ?? 0})`;
  }

  get labelStyle() {
    return safeStyle(this.args.labelStyle);
  }

  get labelBgStyle() {
    return safeStyle(this.args.labelBgStyle);
  }

  get labelBgPadding() {
    return this.args.labelBgPadding ?? [4, 2];
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
    return this.args.labelBgBorderRadius ?? 2;
  }

  get shouldShowLabelBg() {
    return this.args.labelShowBg ?? true;
  }

  get emptyStyle() {
    return htmlSafe('');
  }

  <template>
    {{#if this.hasLabel}}
      <g
        class={{this.textClasses}}
        transform={{this.transform}}
        style={{this.emptyStyle}}
        ...attributes
      >
        {{#if this.shouldShowLabelBg}}
          <rect
            class='ember-flow__edge-textbg'
            x={{this.labelBgX}}
            y={{this.labelBgY}}
            width={{this.labelBgWidth}}
            height={{this.labelBgHeight}}
            rx={{this.labelBgBorderRadius}}
            ry={{this.labelBgBorderRadius}}
            style={{this.labelBgStyle}}
          />
        {{/if}}
        <text
          class='ember-flow__edge-text'
          text-anchor='middle'
          dominant-baseline='central'
          style={{this.labelStyle}}
        >{{this.label}}</text>
        {{yield}}
      </g>
    {{/if}}
  </template>
}
