import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import nodeContext from '../modifiers/node-context.js';
import listen from '../modifiers/listen.js';
import type { CssStyle, Node, NodeComponent } from '../types.js';

type HandleType = 'source' | 'target';

interface Signature {
  Args: {
    node: Node;
    position?: { x: number; y: number };
    nodeComponent?: NodeComponent;
    nodesFocusable?: boolean;
    disableKeyboardA11y?: boolean;
    onNodeClick?: (node: Node, event: MouseEvent) => void;
    onNodeDoubleClick?: (node: Node, event: MouseEvent) => void;
    onNodeContextMenu?: (node: Node, event: MouseEvent) => void;
    onNodePointerDown?: (node: Node, event: PointerEvent) => void;
    onNodeKeyDown?: (node: Node, event: KeyboardEvent) => void;
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

  get isConnectable() {
    return this.args.node.connectable ?? true;
  }

  get isFocusable() {
    return this.args.node.focusable ?? this.args.nodesFocusable ?? true;
  }

  get nodeRole() {
    return this.args.node.ariaRole ?? (this.isFocusable ? 'group' : undefined);
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

  get position() {
    return this.args.position ?? this.args.node.position;
  }

  get nodeStyle() {
    let { style } = this.args.node;
    let dimensions = [
      this.args.node.width !== undefined ? `width: ${this.args.node.width}px;` : undefined,
      this.args.node.height !== undefined ? `height: ${this.args.node.height}px;` : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    return htmlSafe(`transform: translate(${this.position.x}px, ${this.position.y}px); ${dimensions} ${this.toCss(style)}`);
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
    return !this.nodeComponent && this.nodeType !== 'input';
  }

  get hasSourceHandle() {
    return !this.nodeComponent && this.nodeType !== 'output';
  }

  get targetHandleClasses() {
    return this.handleClasses('target', this.targetPosition);
  }

  get sourceHandleClasses() {
    return this.handleClasses('source', this.sourcePosition);
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

  handleDoubleClick = (event: MouseEvent) => {
    this.args.onNodeDoubleClick?.(this.args.node, event);
  };

  handleContextMenu = (event: MouseEvent) => {
    this.args.onNodeContextMenu?.(this.args.node, event);
  };

  handlePointerDown = (event: PointerEvent) => {
    this.args.onNodePointerDown?.(this.args.node, event);
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.args.disableKeyboardA11y || !this.isFocusable) {
      return;
    }

    this.args.onNodeKeyDown?.(this.args.node, event);
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

  private handleClasses(type: HandleType, position: string) {
    return [
      'ember-flow__handle',
      `ember-flow__handle-${position}`,
      position,
      type,
      'nodrag',
      'nopan',
      this.isConnectable ? 'connectable' : undefined,
      this.isConnectable ? 'connectablestart' : undefined,
      this.isConnectable ? 'connectableend' : undefined,
      this.isConnectable ? 'connectionindicator' : undefined,
    ]
      .filter(Boolean)
      .join(' ');
  }

  <template>
    <div
      class={{this.nodeClasses}}
      data-id={{@node.id}}
      style={{this.nodeStyle}}
      role={{this.nodeRole}}
      tabindex={{if this.isFocusable '0'}}
      aria-roledescription='node'
      aria-label={{if @node.ariaLabel @node.ariaLabel @node.id}}
      {{nodeContext @node.id}}
      {{listen 'click' this.handleClick}}
      {{listen 'dblclick' this.handleDoubleClick}}
      {{listen 'contextmenu' this.handleContextMenu}}
      {{listen 'pointerdown' this.handlePointerDown}}
      {{listen 'keydown' this.handleKeyDown}}
      ...attributes
    >
      {{#if this.hasTargetHandle}}
        <div
          class={{this.targetHandleClasses}}
          data-nodeid={{@node.id}}
          data-handlepos={{this.targetPosition}}
          data-handletype='target'
          {{listen 'pointerdown' this.handleTargetPointerDown}}
        ></div>
      {{/if}}
      {{#if this.nodeComponent}}
        <this.nodeComponent
          @node={{@node}}
          @id={{@node.id}}
          @data={{@node.data}}
          @type={{@node.type}}
          @width={{@node.width}}
          @height={{@node.height}}
          @sourcePosition={{@node.sourcePosition}}
          @targetPosition={{@node.targetPosition}}
          @dragHandle={{@node.dragHandle}}
          @parentId={{@node.parentId}}
          @selected={{@node.selected}}
          @draggable={{@node.draggable}}
          @selectable={{@node.selectable}}
          @deletable={{@node.deletable}}
          @dragging={{@node.dragging}}
          @zIndex={{@node.zIndex}}
          @isConnectable={{this.isConnectable}}
          @positionAbsoluteX={{this.position.x}}
          @positionAbsoluteY={{this.position.y}}
        />
      {{else if this.isDragHandleNode}}
        <div class='container'>
          <div class='drag-handle custom-drag-handle'></div>
        </div>
      {{else}}
        {{this.label}}
      {{/if}}
      {{#if this.hasSourceHandle}}
        <div
          class={{this.sourceHandleClasses}}
          data-nodeid={{@node.id}}
          data-handlepos={{this.sourcePosition}}
          data-handletype='source'
          {{listen 'pointerdown' this.handleSourcePointerDown}}
        ></div>
      {{/if}}
    </div>
  </template>
}
