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

import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import listen from '../modifiers/listen.js';
import { toCss } from '../utils/style.js';
import type { CssStyle, Node } from '../types.js';

interface ResizeDetail {
  id: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  direction: number[];
  resizing: boolean;
}

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
  private activeResize:
    | {
        element: HTMLElement;
        store: EmberFlowStore;
        nodeId: string;
        pointerId: number;
        startClientX: number;
        startClientY: number;
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
      }
    | undefined;

  get variant() {
    return this.args.variant ?? ResizeControlVariant.Handle;
  }

  get controlPosition() {
    return this.args.position ?? (this.variant === ResizeControlVariant.Line ? 'right' : 'bottom-right');
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

  handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    let element = event.currentTarget as HTMLElement;
    let store = getFlowStore(element);
    let nodeId = this.args.nodeId ?? this.args.node?.id ?? element.closest<HTMLElement>('.ember-flow__node')?.dataset['id'];
    let node = nodeId ? store?.getNode(nodeId) : undefined;

    if (!store || !nodeId || !node) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let position = store.getNodePosition(node);
    this.activeResize = {
      element,
      store,
      nodeId,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      startWidth: store.getNodeWidth(node),
      startHeight: store.getNodeHeight(node),
    };

    this.args.onResizeStart?.(event as any, {
      x: position.x,
      y: position.y,
      width: store.getNodeWidth(node),
      height: store.getNodeHeight(node),
    });

    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  };

  private handlePointerMove = (event: PointerEvent) => {
    let resize = this.activeResize;
    if (!resize || event.pointerId !== resize.pointerId) {
      return;
    }

    let next = this.getNextResize(event, resize);
    if (!next) {
      return;
    }

    let params = { ...next.position, ...next.dimensions, direction: next.direction };
    if (this.args.shouldResize?.(event as any, params) === false) {
      return;
    }

    this.dispatchResize(resize.element, resize.nodeId, next, true);
    this.args.onResize?.(event as any, params);
  };

  private handlePointerUp = (event: PointerEvent) => {
    let resize = this.activeResize;
    if (!resize || event.pointerId !== resize.pointerId) {
      return;
    }

    let next = this.getNextResize(event, resize);
    if (next) {
      this.dispatchResize(resize.element, resize.nodeId, next, false);
      this.args.onResizeEnd?.(event as any, {
        ...next.position,
        ...next.dimensions,
      });
    }

    this.detachListeners();
  };

  private getNextResize(
    event: PointerEvent,
    resize: NonNullable<NodeResizeControl['activeResize']>,
  ) {
    let zoom = resize.store.viewport.zoom || 1;
    let deltaX = (event.clientX - resize.startClientX) / zoom;
    let deltaY = (event.clientY - resize.startClientY) / zoom;
    let positionParts = this.positionParts;
    let horizontal = this.args.resizeDirection !== 'vertical';
    let vertical = this.args.resizeDirection !== 'horizontal';
    let left = horizontal && positionParts.includes('left');
    let right = horizontal && positionParts.includes('right');
    let top = vertical && positionParts.includes('top');
    let bottom = vertical && positionParts.includes('bottom');

    let x = resize.startX;
    let y = resize.startY;
    let width = resize.startWidth;
    let height = resize.startHeight;

    if (left) {
      width = resize.startWidth - deltaX;
      x = resize.startX + deltaX;
    } else if (right) {
      width = resize.startWidth + deltaX;
    }

    if (top) {
      height = resize.startHeight - deltaY;
      y = resize.startY + deltaY;
    } else if (bottom) {
      height = resize.startHeight + deltaY;
    }

    if (this.args.keepAspectRatio && resize.startHeight > 0) {
      let ratio = resize.startWidth / resize.startHeight;
      if (Math.abs(width - resize.startWidth) >= Math.abs(height - resize.startHeight)) {
        height = width / ratio;
      } else {
        width = height * ratio;
      }
      if (left) {
        x = resize.startX + (resize.startWidth - width);
      }
      if (top) {
        y = resize.startY + (resize.startHeight - height);
      }
    }

    let clampedWidth = Math.min(Math.max(width, this.args.minWidth ?? 10), this.args.maxWidth ?? Number.MAX_VALUE);
    let clampedHeight = Math.min(Math.max(height, this.args.minHeight ?? 10), this.args.maxHeight ?? Number.MAX_VALUE);

    if (left) {
      x += width - clampedWidth;
    }
    if (top) {
      y += height - clampedHeight;
    }

    return {
      position: { x, y },
      dimensions: { width: clampedWidth, height: clampedHeight },
      direction: [left ? -1 : right ? 1 : 0, top ? -1 : bottom ? 1 : 0],
    };
  }

  private dispatchResize(
    element: HTMLElement,
    id: string,
    next: Omit<ResizeDetail, 'id' | 'resizing'>,
    resizing: boolean,
  ) {
    element.dispatchEvent(
      new CustomEvent<ResizeDetail>('ember-flow:node-resize', {
        bubbles: true,
        detail: {
          id,
          position: next.position,
          dimensions: next.dimensions,
          direction: next.direction,
          resizing,
        },
      }),
    );
  }

  private detachListeners() {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    this.activeResize = undefined;
  }

  <template>
    <div
      class={{this.controlClasses}}
      style={{this.controlStyle}}
      {{listen 'pointerdown' this.handlePointerDown}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
