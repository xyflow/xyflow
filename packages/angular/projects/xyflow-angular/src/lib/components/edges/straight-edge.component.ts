import {
  Component,
  Input,
  computed,
} from '@angular/core';
import { getStraightPath } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';
import { StraightEdgeProps } from './types';

/**
 * Component that can be used inside a custom edge to render a straight line.
 */
@Component({
  selector: 'xy-straight-edge',
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
export class StraightEdgeComponent implements StraightEdgeProps {
  @Input() id?: string;
  @Input() sourceX!: number;
  @Input() sourceY!: number;
  @Input() targetX!: number;
  @Input() targetY!: number;
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

  protected edgePath = computed(() => {
    const [path] = getStraightPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      targetX: this.targetX,
      targetY: this.targetY,
    });
    return path;
  });

  protected labelPosition = computed(() => {
    const [, labelX, labelY] = getStraightPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      targetX: this.targetX,
      targetY: this.targetY,
    });
    return { labelX, labelY };
  });
}
