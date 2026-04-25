import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import listen from '../modifiers/listen.js';
import type { MiniMapNodeArgs } from '../types.js';

interface Signature {
  Args: MiniMapNodeArgs & {
    onClick?: (id: string, event: MouseEvent) => void;
  };
  Element: SVGRectElement;
}

export default class MiniMapNode extends Component<Signature> {
  get classes() {
    return [
      'ember-flow__minimap-node',
      this.args.selected ? 'selected' : undefined,
      this.args.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get borderRadius() {
    return this.args.borderRadius ?? 5;
  }

  get strokeWidth() {
    return this.args.strokeWidth ?? 2;
  }

  get nodeStyle() {
    let declarations = [
      this.args.color ? `fill: ${this.args.color}` : undefined,
      this.args.strokeColor ? `stroke: ${this.args.strokeColor}` : undefined,
      `stroke-width: ${this.strokeWidth}`,
    ].filter(Boolean);

    return htmlSafe(declarations.join('; '));
  }

  handleClick = (event: MouseEvent) => {
    this.args.onClick?.(this.args.id, event);
  };

  <template>
    <rect
      class={{this.classes}}
      data-id={{@id}}
      x={{@x}}
      y={{@y}}
      rx={{this.borderRadius}}
      ry={{this.borderRadius}}
      width={{@width}}
      height={{@height}}
      style={{this.nodeStyle}}
      shape-rendering={{@shapeRendering}}
      {{listen 'click' this.handleClick}}
      ...attributes
    />
  </template>
}
