import Component from '@glimmer/component';

import type { ControlsArgs } from '../types.js';

interface Signature {
  Args: ControlsArgs;
  Element: HTMLDivElement;
}

export default class Controls extends Component<Signature> {
  get orientationClass() {
    return this.args.orientation === 'horizontal' ? 'horizontal' : '';
  }

  <template>
    <div
      class='ember-flow__controls ember-flow__panel bottom left {{this.orientationClass}}'
      ...attributes
    >
      <button class='ember-flow__controls-button ember-flow__controls-zoomin' type='button' aria-label='zoom in'>+</button>
      <button class='ember-flow__controls-button ember-flow__controls-zoomout' type='button' aria-label='zoom out'>-</button>
      <button class='ember-flow__controls-button ember-flow__controls-fitview' type='button' aria-label='fit view'>fit</button>
    </div>
  </template>
}
