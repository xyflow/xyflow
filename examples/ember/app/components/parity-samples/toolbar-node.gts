import type { TOC } from '@ember/component/template-only';
import { Handle, NodeToolbar, Position } from '@xyflow/ember';

import type { Node } from '@xyflow/ember';

type ToolbarNodeData = {
  label: string;
  detail?: string;
};

interface Signature {
  Args: {
    node: Node<ToolbarNodeData, 'ToolbarNode'>;
    data: ToolbarNodeData;
  };
}

const ToolbarNode: TOC<Signature> = <template>
  <Handle @type='target' @position={{Position.Left}} />
  <NodeToolbar @position={{Position.Top}} @offset={{12}}>
    <button type='button'>Format</button>
    <button type='button'>Inspect</button>
  </NodeToolbar>
  <div class='parity-toolbar-node__body'>
    <strong>{{@data.label}}</strong>
    {{#if @data.detail}}
      <small>{{@data.detail}}</small>
    {{/if}}
  </div>
  <Handle @type='source' @position={{Position.Right}} />
</template>;

export default ToolbarNode;
