import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Position, type HandleProps as SystemHandleProps } from '@xyflow/system';

import nodeIdContext, { getNodeId } from '../modifiers/node-id-context.js';
import { safeStyle } from '../utils/style.js';
import type { CssStyle, Node } from '../types.js';

interface Signature {
  Args: Partial<SystemHandleProps> & {
    node?: Node;
    nodeId?: string;
    className?: string;
    class?: string;
    style?: CssStyle;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class Handle extends Component<Signature> {
  @tracked private contextNodeId: string | null = null;

  get type() {
    return this.args.type ?? 'source';
  }

  get position() {
    return this.args.position ?? Position.Top;
  }

  get nodeId() {
    return this.args.nodeId ?? this.args.node?.id ?? this.contextNodeId;
  }

  get handleId() {
    return this.args.id ?? null;
  }

  get isConnectable() {
    return this.args.isConnectable ?? true;
  }

  get isConnectableStart() {
    return this.isConnectable && (this.args.isConnectableStart ?? true);
  }

  get isConnectableEnd() {
    return this.isConnectable && (this.args.isConnectableEnd ?? true);
  }

  get handleClasses() {
    return [
      'ember-flow__handle',
      `ember-flow__handle-${this.position}`,
      this.position,
      this.type,
      'nodrag',
      'nopan',
      this.args.class,
      this.args.className,
      this.isConnectable ? 'connectable' : undefined,
      this.isConnectableStart ? 'connectablestart' : undefined,
      this.isConnectableEnd ? 'connectableend' : undefined,
      this.isConnectable ? 'connectionindicator' : undefined,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get handleStyle() {
    return safeStyle(this.args.style);
  }

  registerNodeContext(element: HTMLElement) {
    this.contextNodeId = getNodeId(element);
  }

  unregisterNodeContext() {
    this.contextNodeId = null;
  }

  <template>
    <div
      class={{this.handleClasses}}
      data-nodeid={{this.nodeId}}
      data-handleid={{this.handleId}}
      data-handlepos={{this.position}}
      data-handletype={{this.type}}
      style={{this.handleStyle}}
      {{nodeIdContext this}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
