import {
  Component,
  Input,
  computed,
} from '@angular/core';
import { Position, getBezierPath } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';
import { BezierEdgeProps } from './types';

/**
 * Component that can be used inside a custom edge to render a bezier curve.
 */
@Component({
  selector: 'xy-bezier-edge',
  standalone: true,
  imports: [BaseEdgeComponent],
  template: `
    <xy-base-edge
      [id]="id"
      [path]="edgePath()"
      [labelX]="labelPosition().labelX"
      [labelY]="labelPosition().labelY"
      [label]="label"
      [labelStyle]="labelStyle"
      [labelShowBg]="labelShowBg"
      [labelBgStyle]="labelBgStyle"
      [labelBgPadding]="labelBgPadding"
      [labelBgBorderRadius]="labelBgBorderRadius"
      [style]="style"
      [markerEnd]="markerEnd"
      [markerStart]="markerStart"
      [interactionWidth]="interactionWidth ?? 20"
      [className]="className"
    />
  `
})
export class BezierEdgeComponent implements BezierEdgeProps {
  @Input() id?: string;
  @Input() sourceX!: number;
  @Input() sourceY!: number;
  @Input() targetX!: number;
  @Input() targetY!: number;
  @Input() sourcePosition?: Position;
  @Input() targetPosition?: Position;
  @Input() label?: string;
  @Input() labelStyle?: { [key: string]: any };
  @Input() labelShowBg?: boolean;
  @Input() labelBgStyle?: { [key: string]: any };
  @Input() labelBgPadding?: [number, number];
  @Input() labelBgBorderRadius?: number;
  @Input() style?: { [key: string]: any };
  @Input() markerEnd?: string;
  @Input() markerStart?: string;
  @Input() interactionWidth?: number;
  @Input() className?: string;
  @Input() pathOptions?: { curvature?: number };

  protected edgePath = computed(() => {
    const [path] = getBezierPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition,
      curvature: this.pathOptions?.curvature,
    });
    return path;
  });

  protected labelPosition = computed(() => {
    const [, labelX, labelY] = getBezierPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition,
      curvature: this.pathOptions?.curvature,
    });
    return { labelX, labelY };
  });
}
