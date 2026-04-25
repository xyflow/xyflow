import type { TOC } from '@ember/component/template-only';
import { Handle, Position } from '@xyflow/ember';

import type { Node } from '@xyflow/ember';

interface Signature {
  Args: {
    node: Node;
    data: {
      label?: string;
    };
  };
}

const CustomHandleNode: TOC<Signature> = <template>
  <Handle @node={{@node}} @id='in' @type='target' @position={{Position.Left}} />
  <span>{{@data.label}}</span>
  <Handle @node={{@node}} @id='out' @type='source' @position={{Position.Right}} />
</template>;

export default CustomHandleNode;
