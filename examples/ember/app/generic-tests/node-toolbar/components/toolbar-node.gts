import type { TOC } from '@ember/component/template-only';
import { Handle, NodeToolbar, Position } from '@xyflow/ember';

import type { Align, Node } from '@xyflow/ember';

type ToolbarNodeData = {
  label: string;
  toolbarPosition?: Position;
  toolbarAlign?: Align;
  toolbarVisible?: boolean;
};

interface Signature {
  Args: {
    node: Node<ToolbarNodeData, 'ToolbarNode'>;
    data: ToolbarNodeData;
  };
}

const ToolbarNode: TOC<Signature> = <template>
  <Handle @node={{@node}} @type='target' @position={{Position.Left}} />
  <NodeToolbar
    @node={{@node}}
    @isVisible={{@data.toolbarVisible}}
    @position={{@data.toolbarPosition}}
    @align={{@data.toolbarAlign}}
  >
    <button type='button'>delete</button>
    <button type='button'>copy</button>
    <button type='button'>expand</button>
  </NodeToolbar>
  <div class='toolbar-node'>
    {{@data.label}}
  </div>
  <Handle @node={{@node}} @type='source' @position={{Position.Right}} />
</template>;

export default ToolbarNode;
