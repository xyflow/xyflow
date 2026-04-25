import Component from '@glimmer/component';
import {
  ResizeControlVariant,
  XY_RESIZER_HANDLE_POSITIONS,
  XY_RESIZER_LINE_POSITIONS,
} from '@xyflow/system';

import NodeResizeControl from './node-resize-control.js';
import type { NodeResizerArgs } from '../types.js';

interface Signature {
  Args: NodeResizerArgs;
  Element: HTMLDivElement;
}

export default class NodeResizer extends Component<Signature> {
  linePositions = XY_RESIZER_LINE_POSITIONS;
  handlePositions = XY_RESIZER_HANDLE_POSITIONS;
  lineVariant = ResizeControlVariant.Line;

  get isVisible() {
    if ('isVisible' in this.args) {
      return Boolean(this.args.isVisible);
    }

    return true;
  }

  <template>
    {{#if this.isVisible}}
      {{#each this.linePositions as |position|}}
        <NodeResizeControl
          @node={{@node}}
          @nodeId={{@nodeId}}
          @position={{position}}
          @variant={{this.lineVariant}}
          @color={{@color}}
          @minWidth={{@minWidth}}
          @minHeight={{@minHeight}}
          @maxWidth={{@maxWidth}}
          @maxHeight={{@maxHeight}}
          @keepAspectRatio={{@keepAspectRatio}}
          @autoScale={{@autoScale}}
          @shouldResize={{@shouldResize}}
          @onResizeStart={{@onResizeStart}}
          @onResize={{@onResize}}
          @onResizeEnd={{@onResizeEnd}}
          @className={{@lineClassName}}
          @style={{@lineStyle}}
        />
      {{/each}}
      {{#each this.handlePositions as |position|}}
        <NodeResizeControl
          @node={{@node}}
          @nodeId={{@nodeId}}
          @position={{position}}
          @color={{@color}}
          @minWidth={{@minWidth}}
          @minHeight={{@minHeight}}
          @maxWidth={{@maxWidth}}
          @maxHeight={{@maxHeight}}
          @keepAspectRatio={{@keepAspectRatio}}
          @autoScale={{@autoScale}}
          @shouldResize={{@shouldResize}}
          @onResizeStart={{@onResizeStart}}
          @onResize={{@onResize}}
          @onResizeEnd={{@onResizeEnd}}
          @className={{@handleClassName}}
          @style={{@handleStyle}}
        />
      {{/each}}
    {{/if}}
  </template>
}
