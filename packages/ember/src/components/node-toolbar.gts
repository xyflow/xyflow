import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { Position } from '@xyflow/system';

import type { Align } from '@xyflow/system';
import type { CssStyle, Node, NodeToolbarArgs } from '../types.js';

interface Signature<NodeType extends Node = Node> {
  Args: NodeToolbarArgs<NodeType>;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class NodeToolbar<NodeType extends Node = Node> extends Component<Signature<NodeType>> {
  get isActive() {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }

    return Boolean(this.args.node?.selected);
  }

  get dataId() {
    return this.args.nodeId ?? this.args.node?.id;
  }

  get toolbarClasses() {
    return ['ember-flow__node-toolbar', this.args.className].filter(Boolean).join(' ');
  }

  get toolbarStyle() {
    return htmlSafe(`${this.positionStyle}; ${this.toCss(this.args.style)}`);
  }

  private get positionStyle() {
    let position = this.args.position ?? Position.Top;
    let align = this.args.align ?? 'center';
    let offset = this.args.offset ?? 10;
    let alignPosition = this.alignPosition(align);
    let alignTransform = this.alignTransform(align);

    switch (position) {
      case Position.Right:
        return `left: calc(100% + ${offset}px); top: ${alignPosition}; transform: translate(0, ${alignTransform});`;
      case Position.Bottom:
        return `left: ${alignPosition}; top: calc(100% + ${offset}px); transform: translate(${alignTransform}, 0);`;
      case Position.Left:
        return `left: -${offset}px; top: ${alignPosition}; transform: translate(-100%, ${alignTransform});`;
      case Position.Top:
      default:
        return `left: ${alignPosition}; top: -${offset}px; transform: translate(${alignTransform}, -100%);`;
    }
  }

  private alignPosition(align: Align | undefined) {
    if (align === 'start') {
      return '-1px';
    }

    if (align === 'end') {
      return 'calc(100% + 1px)';
    }

    return '50%';
  }

  private alignTransform(align: Align | undefined) {
    if (align === 'start') {
      return '0';
    }

    if (align === 'end') {
      return '-100%';
    }

    return '-50%';
  }

  private toCss(style: CssStyle | undefined) {
    if (!style) {
      return '';
    }

    if (typeof style === 'string') {
      return style;
    }

    return Object.entries(style)
      .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
      .map(([property, value]) => `${property}: ${value};`)
      .join(' ');
  }

  <template>
    {{#if this.isActive}}
      <div
        class={{this.toolbarClasses}}
        data-id={{this.dataId}}
        style={{this.toolbarStyle}}
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}
