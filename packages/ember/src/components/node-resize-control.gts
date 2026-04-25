import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import {
  ResizeControlVariant,
  type ControlPosition,
  type ResizeControlDirection,
  type ShouldResize,
  type OnResizeStart,
  type OnResize,
  type OnResizeEnd,
} from '@xyflow/system';

import resizeControl from '../modifiers/resize-control.js';
import { toCss } from '../utils/style.js';
import type { CssStyle, Node } from '../types.js';

interface Signature {
  Args: {
    node?: Node;
    nodeId?: string;
    position?: ControlPosition;
    variant?: ResizeControlVariant;
    resizeDirection?: ResizeControlDirection;
    color?: string;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    keepAspectRatio?: boolean;
    autoScale?: boolean;
    shouldResize?: ShouldResize;
    onResizeStart?: OnResizeStart;
    onResize?: OnResize;
    onResizeEnd?: OnResizeEnd;
    className?: string;
    class?: string;
    style?: CssStyle;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class NodeResizeControl extends Component<Signature> {
  get variant() {
    return this.args.variant ?? ResizeControlVariant.Handle;
  }

  get nodeId() {
    return this.args.nodeId ?? this.args.node?.id;
  }

  get controlPosition() {
    return this.args.position ?? (this.variant === ResizeControlVariant.Line ? 'right' : 'bottom-right');
  }

  get minWidth() {
    return this.args.minWidth ?? 10;
  }

  get minHeight() {
    return this.args.minHeight ?? 10;
  }

  get maxWidth() {
    return this.args.maxWidth ?? Number.MAX_VALUE;
  }

  get maxHeight() {
    return this.args.maxHeight ?? Number.MAX_VALUE;
  }

  get keepAspectRatio() {
    return this.args.keepAspectRatio ?? false;
  }

  get positionParts() {
    return this.controlPosition.split('-');
  }

  get controlClasses() {
    return [
      'ember-flow__resize-control',
      'nodrag',
      'nopan',
      ...this.positionParts,
      this.variant,
      this.args.class,
      this.args.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get controlStyle() {
    let declarations = [toCss(this.args.style)];
    let color = this.args.color;

    if (color) {
      declarations.push(this.variant === ResizeControlVariant.Line ? `border-color: ${color};` : `background-color: ${color};`);
    }

    if (this.variant === ResizeControlVariant.Handle && this.args.autoScale !== false) {
      declarations.push('scale: var(--ember-flow-resize-control-scale, 1);');
    }

    let css = declarations.filter(Boolean).join(' ');
    return css ? htmlSafe(css) : undefined;
  }

  <template>
    <div
      class={{this.controlClasses}}
      style={{this.controlStyle}}
      {{resizeControl
        this.nodeId
        this.controlPosition
        this.minWidth
        this.minHeight
        this.maxWidth
        this.maxHeight
        this.keepAspectRatio
        @resizeDirection
        @shouldResize
        @onResizeStart
        @onResize
        @onResizeEnd
      }}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
