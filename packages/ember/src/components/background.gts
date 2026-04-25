import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type { Viewport } from '@xyflow/system';

import background from '../modifiers/background.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import { BackgroundVariant, type BackgroundArgs } from '../types.js';

interface Signature {
  Args: BackgroundArgs;
  Element: SVGSVGElement;
}

export default class Background extends Component<Signature> {
  private element: SVGSVGElement | undefined;
  private store: EmberFlowStore | undefined;
  private unsubscribeViewport: (() => void) | undefined;

  get patternStyle() {
    let declarations = [
      `--xy-background-pattern-color-props: ${this.patternColor}`,
      `--xy-background-color-props: ${this.args.bgColor ?? 'transparent'}`,
    ];

    return htmlSafe(declarations.join('; '));
  }

  get variant() {
    return this.args.variant ?? BackgroundVariant.Dots;
  }

  get isDots() {
    return this.variant === BackgroundVariant.Dots;
  }

  get isCross() {
    return this.variant === BackgroundVariant.Cross;
  }

  get patternColor() {
    return this.args.patternColor ?? this.args.color ?? '#81818a';
  }

  get patternId() {
    return `ember-flow-grid-${this.args.id ?? 'default'}`;
  }

  get gapX() {
    return this.resolveTuple(this.args.gap ?? 20)[0];
  }

  get gapY() {
    return this.resolveTuple(this.args.gap ?? 20)[1];
  }

  get offsetX() {
    return this.resolveTuple(this.args.offset ?? 0)[0];
  }

  get offsetY() {
    return this.resolveTuple(this.args.offset ?? 0)[1];
  }

  get patternSize() {
    if (this.args.size !== undefined) {
      return this.args.size;
    }

    return this.isCross ? 6 : 1;
  }

  get dotRadius() {
    return this.patternSize / 2;
  }

  get patternWidth() {
    return this.isCross ? this.patternSize : this.gapX;
  }

  get patternHeight() {
    return this.isCross ? this.patternSize : this.gapY;
  }

  get patternOffsetX() {
    return this.offsetX + this.patternWidth / 2;
  }

  get patternOffsetY() {
    return this.offsetY + this.patternHeight / 2;
  }

  get lineWidth() {
    return this.args.lineWidth ?? 1;
  }

  get linePath() {
    return `M${this.patternWidth / 2} 0 V${this.patternHeight} M0 ${this.patternHeight / 2} H${this.patternWidth}`;
  }

  get patternTransform() {
    return `translate(-${this.patternOffsetX},-${this.patternOffsetY})`;
  }

  get patternFill() {
    return `url(#${this.patternId})`;
  }

  get patternClasses() {
    return [
      'ember-flow__background-pattern',
      this.variant,
      this.args.patternClass,
      this.args.patternClassName,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private resolveTuple(value: number | [number, number]): [number, number] {
    return Array.isArray(value) ? value : [value, value];
  }

  registerBackground(element: SVGSVGElement) {
    this.element = element;
    let store = getFlowStore(element);

    if (!store) {
      this.syncPattern({ x: 0, y: 0, zoom: 1 });
      return;
    }

    if (this.store === store) {
      this.syncPattern(store.viewport);
      return;
    }

    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(this.syncPattern);
  }

  unregisterBackground() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
    this.element = undefined;
  }

  private syncPattern = (viewport: Viewport) => {
    let element = this.element;
    if (!element) {
      return;
    }

    let pattern = element.querySelector<SVGPatternElement>('pattern');
    if (!pattern) {
      return;
    }

    let zoom = viewport.zoom || 1;
    let [gapX, gapY] = this.resolveTuple(this.args.gap ?? 20);
    let [offsetX, offsetY] = this.resolveTuple(this.args.offset ?? 0);
    let scaledGapX = gapX * zoom || 1;
    let scaledGapY = gapY * zoom || 1;
    let scaledSize = this.patternSize * zoom;
    let patternWidth = this.isCross ? scaledSize : scaledGapX;
    let patternHeight = this.isCross ? scaledSize : scaledGapY;
    let patternOffsetX = offsetX * zoom + patternWidth / 2;
    let patternOffsetY = offsetY * zoom + patternHeight / 2;

    pattern.setAttribute('x', `${viewport.x % scaledGapX}`);
    pattern.setAttribute('y', `${viewport.y % scaledGapY}`);
    pattern.setAttribute('width', `${scaledGapX}`);
    pattern.setAttribute('height', `${scaledGapY}`);
    pattern.setAttribute('patternTransform', `translate(-${patternOffsetX},-${patternOffsetY})`);

    let circle = pattern.querySelector<SVGCircleElement>('circle');
    if (circle) {
      let radius = scaledSize / 2;
      circle.setAttribute('cx', `${radius}`);
      circle.setAttribute('cy', `${radius}`);
      circle.setAttribute('r', `${radius}`);
    }

    let path = pattern.querySelector<SVGPathElement>('path');
    if (path) {
      path.setAttribute(
        'd',
        `M${patternWidth / 2} 0 V${patternHeight} M0 ${patternHeight / 2} H${patternWidth}`,
      );
    }
  };

  <template>
    <svg
      class='ember-flow__background ember-flow__container'
      aria-hidden='true'
      style={{this.patternStyle}}
      {{background this}}
      ...attributes
    >
      <defs>
        <pattern
          id={{this.patternId}}
          x='0'
          y='0'
          width={{this.gapX}}
          height={{this.gapY}}
          patternUnits='userSpaceOnUse'
          patternTransform={{this.patternTransform}}
        >
          {{#if this.isDots}}
            <circle
              class={{this.patternClasses}}
              cx={{this.dotRadius}}
              cy={{this.dotRadius}}
              r={{this.dotRadius}}
            />
          {{else}}
            <path
              class={{this.patternClasses}}
              stroke-width={{this.lineWidth}}
              d={{this.linePath}}
            />
          {{/if}}
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='var(--xy-background-color-props)' />
      <rect width='100%' height='100%' fill={{this.patternFill}} />
    </svg>
  </template>
}
