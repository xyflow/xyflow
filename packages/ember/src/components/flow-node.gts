import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import listen from '../modifiers/listen.js';
import type { CssStyle, Node, NodeComponent } from '../types.js';

type HandleType = 'source' | 'target';

interface Signature {
  Args: {
    node: Node;
    nodeComponent?: NodeComponent;
    onNodeClick?: (node: Node, event: MouseEvent) => void;
    onNodePointerDown?: (node: Node, event: PointerEvent) => void;
    onHandlePointerDown?: (node: Node, handleType: HandleType, event: PointerEvent) => void;
  };
  Element: HTMLDivElement;
}

export default class FlowNode extends Component<Signature> {
  get nodeType() {
    return this.args.node.type ?? 'default';
  }

  get nodeClass() {
    return this.args.node.class ?? this.args.node.className ?? '';
  }

  get isDraggable() {
    return this.args.node.draggable ?? true;
  }

  get isSelectable() {
    return this.args.node.selectable ?? true;
  }

  get isSelected() {
    return this.args.node.selected ?? false;
  }

  get nodeClasses() {
    let classes = [
      'ember-flow__node',
      `ember-flow__node-${this.nodeType}`,
      this.nodeClass,
    ];

    if (this.isDraggable) {
      classes.push('draggable', 'nopan');
    }

    if (this.isSelectable) {
      classes.push('selectable');
    }

    if (this.isSelected) {
      classes.push('selected');
    }

    return classes.filter(Boolean).join(' ');
  }

  get nodeStyle() {
    let { position, style } = this.args.node;
    return htmlSafe(`transform: translate(${position.x}px, ${position.y}px); ${this.toCss(style)}`);
  }

  get label() {
    let label = this.args.node.data['label'];
    return typeof label === 'string' || typeof label === 'number'
      ? label
      : this.args.node.id;
  }

  get targetPosition() {
    return this.args.node.targetPosition ?? 'top';
  }

  get sourcePosition() {
    return this.args.node.sourcePosition ?? 'bottom';
  }

  get hasTargetHandle() {
    return this.nodeType !== 'input';
  }

  get hasSourceHandle() {
    return this.nodeType !== 'output';
  }

  get isDragHandleNode() {
    return this.nodeType === 'DragHandleNode';
  }

  get nodeComponent() {
    return this.args.nodeComponent as any;
  }

  handleClick = (event: MouseEvent) => {
    this.args.onNodeClick?.(this.args.node, event);
  };

  handlePointerDown = (event: PointerEvent) => {
    this.args.onNodePointerDown?.(this.args.node, event);
  };

  handleTargetPointerDown = (event: PointerEvent) => {
    this.args.onHandlePointerDown?.(this.args.node, 'target', event);
  };

  handleSourcePointerDown = (event: PointerEvent) => {
    this.args.onHandlePointerDown?.(this.args.node, 'source', event);
  };

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
    <div
      class={{this.nodeClasses}}
      data-id={{@node.id}}
      style={{this.nodeStyle}}
      role='group'
      aria-label={{if @node.ariaLabel @node.ariaLabel @node.id}}
      {{listen 'click' this.handleClick}}
      {{listen 'pointerdown' this.handlePointerDown}}
      ...attributes
    >
      {{#if this.hasTargetHandle}}
        <div
          class='ember-flow__handle ember-flow__handle-{{this.targetPosition}} target connectionindicator'
          data-nodeid={{@node.id}}
          data-handleid='target'
          data-handlepos={{this.targetPosition}}
          {{listen 'pointerdown' this.handleTargetPointerDown}}
        ></div>
      {{/if}}
      {{#if this.nodeComponent}}
        <this.nodeComponent @node={{@node}} @data={{@node.data}} />
      {{else if this.isDragHandleNode}}
        <div class='container'>
          <div class='drag-handle custom-drag-handle'></div>
        </div>
      {{else}}
        {{this.label}}
      {{/if}}
      {{#if this.hasSourceHandle}}
        <div
          class='ember-flow__handle ember-flow__handle-{{this.sourcePosition}} source connectionindicator'
          data-nodeid={{@node.id}}
          data-handleid='source'
          data-handlepos={{this.sourcePosition}}
          {{listen 'pointerdown' this.handleSourcePointerDown}}
        ></div>
      {{/if}}
    </div>
  </template>
}
