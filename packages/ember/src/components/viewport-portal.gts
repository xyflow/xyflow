import Component from '@glimmer/component';

import portal from '../modifiers/portal.js';

interface Signature {
  Blocks: {
    default: [];
  };
  Element: HTMLDivElement;
}

export default class ViewportPortal extends Component<Signature> {
  <template>
    <div class='ember-flow__viewport-portal' {{portal '.ember-flow__viewport-front'}} ...attributes>
      {{yield}}
    </div>
  </template>
}
