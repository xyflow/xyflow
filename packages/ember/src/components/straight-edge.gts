import Component from '@glimmer/component';

import BaseEdge from './base-edge.js';
import { getStraightPath } from '@xyflow/system';
import type { StraightEdgeProps } from '../types.js';

interface Signature {
  Args: StraightEdgeProps;
  Element: SVGGElement;
}

export default class StraightEdge extends Component<Signature> {
  get pathData() {
    return getStraightPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
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
