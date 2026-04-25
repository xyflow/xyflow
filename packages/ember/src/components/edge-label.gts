import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

import flowContext from '../modifiers/flow-context.js';
import listen from '../modifiers/listen.js';
import portal from '../modifiers/portal.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { toCss } from '../utils/style.js';
import type { EdgeLabelArgs } from '../types.js';

interface Signature {
  Args: EdgeLabelArgs;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class EdgeLabel extends Component<Signature> {
  @tracked private store: EmberFlowStore | undefined;

  get classes() {
    return [
      'ember-flow__edge-label',
      this.args.transparent ? 'transparent' : undefined,
      this.args.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get style() {
    let declarations = [
      `transform: translate(-50%, -50%) translate(${this.args.x ?? 0}px, ${this.args.y ?? 0}px)`,
      'pointer-events: all',
      this.args.width !== undefined ? `width: ${this.toPx(this.args.width)}` : undefined,
      this.args.height !== undefined ? `height: ${this.toPx(this.args.height)}` : undefined,
      this.args.selectEdgeOnClick ? 'cursor: pointer' : undefined,
      toCss(this.args.style),
    ].filter(Boolean);

    return htmlSafe(declarations.join('; '));
  }

  registerFlowContext(element: HTMLElement) {
    this.store = getFlowStore(element);
  }

  unregisterFlowContext() {
    this.store = undefined;
  }

  @action
  handleClick(event: MouseEvent) {
    if (!this.args.selectEdgeOnClick || !this.args.edgeId || !this.store) {
      return;
    }

    event.stopPropagation();
    this.store.clearSelection();
    this.store.selectEdge(this.args.edgeId);
  }

  private toPx(value: number | string) {
    return typeof value === 'number' ? `${value}px` : value;
  }

  <template>
    <div
      class={{this.classes}}
      data-id={{@edgeId}}
      style={{this.style}}
      tabindex='-1'
      {{flowContext this}}
      {{portal '.ember-flow__edge-labels'}}
      {{listen 'click' this.handleClick}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
