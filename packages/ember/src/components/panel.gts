import Component from '@glimmer/component';

import type { PanelArgs } from '../types.js';

interface Signature {
  Args: PanelArgs;
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class Panel extends Component<Signature> {
  get positionClasses() {
    let position = this.args.position ?? 'top-left';
    return position.replace('-', ' ');
  }

  <template>
    <div class='ember-flow__panel {{this.positionClasses}}' ...attributes>
      {{yield}}
    </div>
  </template>
}
