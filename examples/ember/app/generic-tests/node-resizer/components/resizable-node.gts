import type { TOC } from '@ember/component/template-only';
import { Handle, NodeResizer, Position } from '@xyflow/ember';

import type { Node } from '@xyflow/ember';

interface Signature {
  Args: {
    node: Node;
    data: {
      label?: string;
    };
  };
}

const ResizableNode: TOC<Signature> = <template>
  <NodeResizer
    @node={{@node}}
    @isVisible={{@node.selected}}
    @minWidth={{100}}
    @minHeight={{60}}
    @color='#2563eb'
  />
  <Handle @node={{@node}} @type='target' @position={{Position.Left}} />
  <span>{{@data.label}}</span>
  <Handle @node={{@node}} @type='source' @position={{Position.Right}} />
</template>;

export default ResizableNode;
