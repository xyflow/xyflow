import Component from '@glimmer/component';

import portal from '../modifiers/portal.js';

interface Signature {
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class EdgeLabelRenderer extends Component<Signature> {
  <template>
    <div {{portal '.ember-flow__edgelabel-renderer'}} ...attributes>
      {{yield}}
    </div>
  </template>
}
