import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

import type { BackgroundArgs } from '../types.js';

interface Signature {
  Args: BackgroundArgs;
  Element: SVGSVGElement;
}

export default class Background extends Component<Signature> {
  get patternStyle() {
    return htmlSafe(`--xy-background-pattern-color-props: ${this.args.color ?? '#81818a'};`);
  }

  get gap() {
    return this.args.gap ?? 16;
  }

  get size() {
    return this.args.size ?? 1;
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
          id='ember-flow-grid'
          width={{this.gap}}
          height={{this.gap}}
          patternUnits='userSpaceOnUse'
        >
          <circle
            class='ember-flow__background-pattern dots'
            cx={{this.size}}
            cy={{this.size}}
            r={{this.size}}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#ember-flow-grid)' />
    </svg>
  </template>
}
