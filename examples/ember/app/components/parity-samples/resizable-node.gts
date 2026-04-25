import type { TOC } from '@ember/component/template-only';
import { Handle, NodeResizer, Position } from '@xyflow/ember';

import type { Node } from '@xyflow/ember';

type ResizableNodeData = {
  label: string;
  detail?: string;
};

interface Signature {
  Args: {
    node: Node<ResizableNodeData, 'ResizableNode'>;
    data: ResizableNodeData;
  };
}

const ResizableNode: TOC<Signature> = <template>
  <NodeResizer
    @node={{@node}}
    @isVisible={{@node.selected}}
    @minWidth={{120}}
    @minHeight={{64}}
    @color='#4f46e5'
  />
  <Handle @node={{@node}} @type='target' @position={{Position.Left}} />
  <div class='parity-resizable-node__body'>
    <strong>{{@data.label}}</strong>
    {{#if @data.detail}}
      <small>{{@data.detail}}</small>
    {{/if}}
  </div>
  <Handle @node={{@node}} @type='source' @position={{Position.Right}} />
</template>;

export default ResizableNode;
