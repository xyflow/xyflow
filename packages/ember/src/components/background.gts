import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import { BackgroundVariant, type BackgroundArgs } from '../types.js';

interface Signature {
  Args: BackgroundArgs;
  Element: SVGSVGElement;
}

export default class Background extends Component<Signature> {
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

  <template>
    <svg
      class='ember-flow__background ember-flow__container'
      aria-hidden='true'
      style={{this.patternStyle}}
      ...attributes
    >
      <defs>
        <pattern
          id={{this.patternId}}
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
