import Component from '@glimmer/component';

import BaseEdge from './base-edge.js';
import { getBezierPath } from '@xyflow/system';
import type { BezierEdgeProps } from '../types.js';

interface Signature {
  Args: BezierEdgeProps;
  Element: SVGGElement;
}

export default class BezierEdge extends Component<Signature> {
  get pathData() {
    return getBezierPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      sourcePosition: this.args.sourcePosition,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
      targetPosition: this.args.targetPosition,
      curvature: this.args.pathOptions?.curvature,
    });
  }

  get path() {
    return this.pathData[0];
  }

  get labelX() {
    return this.pathData[1];
  }

  get labelY() {
    return this.pathData[2];
  }

  <template>
    <BaseEdge
      @id={{@id}}
      @path={{this.path}}
      @labelX={{this.labelX}}
      @labelY={{this.labelY}}
      @label={{@label}}
      @labelStyle={{@labelStyle}}
      @labelShowBg={{@labelShowBg}}
      @labelBgStyle={{@labelBgStyle}}
      @labelBgPadding={{@labelBgPadding}}
      @labelBgBorderRadius={{@labelBgBorderRadius}}
      @markerStart={{@markerStart}}
      @markerEnd={{@markerEnd}}
      @interactionWidth={{@interactionWidth}}
      @style={{@style}}
      ...attributes
    />
  </template>
}
