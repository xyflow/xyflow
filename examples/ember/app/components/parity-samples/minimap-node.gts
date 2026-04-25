import type { TOC } from '@ember/component/template-only';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

import type { Node } from '@xyflow/ember';

interface Signature {
  Args: {
    id: string;
    node: Node;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    selected?: boolean;
    onClick: (id: string, event: MouseEvent) => void;
  };
  Element: SVGGElement;
}

const MiniMapNode: TOC<Signature> = <template>
  <g
    data-testid='custom-minimap-node'
    data-id={{@id}}
    class='parity-custom-minimap-node {{if @selected "selected"}}'
    {{on 'click' (fn @onClick @id)}}
    ...attributes
  >
    <rect
      x={{@x}}
      y={{@y}}
      width={{@width}}
      height={{@height}}
      rx='14'
      ry='14'
      fill={{if @color @color '#e0f2fe'}}
      stroke={{if @strokeColor @strokeColor '#0f172a'}}
      stroke-width={{if @strokeWidth @strokeWidth 2}}
    />
    <circle
      cx={{@x}}
      cy={{@y}}
      r='10'
      transform='translate(18 18)'
      fill='#0f172a'
      opacity='0.72'
    />
  </g>
</template>;

export default MiniMapNode;
