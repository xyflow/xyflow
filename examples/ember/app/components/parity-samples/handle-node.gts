import type { TOC } from '@ember/component/template-only';
import { Handle, Position } from '@xyflow/ember';

import type { Node } from '@xyflow/ember';

type HandleNodeData = {
  label: string;
  tone?: string;
};

interface Signature {
  Args: {
    node: Node<HandleNodeData, 'HandleNode'>;
    data: HandleNodeData;
  };
}

const HandleNode: TOC<Signature> = <template>
  <Handle
    @node={{@node}}
    @id='in'
    @type='target'
    @position={{Position.Left}}
    @className='parity-custom-handle parity-custom-handle--target'
  />
  <div class='parity-handle-node__body'>
    <strong>{{@data.label}}</strong>
    {{#if @data.tone}}
      <small>{{@data.tone}}</small>
    {{/if}}
  </div>
  <Handle
    @node={{@node}}
    @id='out'
    @type='source'
    @position={{Position.Right}}
    @className='parity-custom-handle parity-custom-handle--source'
  />
</template>;

export default HandleNode;
