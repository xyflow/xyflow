import type { TOC } from '@ember/component/template-only';
import { BaseEdge } from '@xyflow/ember';

type StatusEdgeData = {
  status?: string;
};

interface Signature {
  Args: {
    id: string;
    path: string;
    labelX: number;
    labelY: number;
    markerStart?: string;
    markerEnd?: string;
    data?: StatusEdgeData;
    interactionWidth?: number;
  };
}

const StatusEdge: TOC<Signature> = <template>
  <BaseEdge
    data-testid='custom-status-edge'
    @id={{@id}}
    @path={{@path}}
    @className='parity-status-edge__path'
    @style='stroke: #db2777; stroke-width: 3;'
    @markerStart={{@markerStart}}
    @markerEnd={{@markerEnd}}
    @interactionWidth={{@interactionWidth}}
    @label={{if @data.status @data.status 'custom edge'}}
    @labelX={{@labelX}}
    @labelY={{@labelY}}
    @labelBgStyle='fill: #fdf2f8; stroke: #f9a8d4;'
    @labelStyle='fill: #831843; font-weight: 700;'
    @labelBgBorderRadius={{5}}
  />
</template>;

export default StatusEdge;
