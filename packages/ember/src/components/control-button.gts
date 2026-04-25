import Component from '@glimmer/component';

import { safeStyle } from '../utils/style.js';
import type { CssStyle } from '../types.js';

interface Signature {
  Args: {
    className?: string;
    class?: string;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
    style?: CssStyle;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLButtonElement;
}

export default class ControlButton extends Component<Signature> {
  get buttonClasses() {
    return ['ember-flow__controls-button', this.args.class, this.args.className].filter(Boolean).join(' ');
  }

  get buttonStyle() {
    return safeStyle(this.args.style);
  }

  <template>
    <button
      type='button'
      class={{this.buttonClasses}}
      disabled={{@disabled}}
      title={{@title}}
      aria-label={{@ariaLabel}}
      style={{this.buttonStyle}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}
