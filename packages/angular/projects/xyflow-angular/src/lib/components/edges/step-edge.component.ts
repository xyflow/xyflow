import {
  Component,
  Input,
  computed,
} from '@angular/core';
import { Position, getSmoothStepPath } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';
import { StepEdgeProps } from './types';

/**
 * Component that can be used inside a custom edge to render a step edge.
 */
@Component({
  selector: 'xy-step-edge',
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
export class StepEdgeComponent implements StepEdgeProps {
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
  @Input() pathOptions?: { offset?: number };

  protected edgePath = computed(() => {
    const [path] = getSmoothStepPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition || Position.Bottom,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition || Position.Top,
      borderRadius: 0, // Step edge has no border radius
      offset: this.pathOptions?.offset,
    });
    return path;
  });

  protected labelPosition = computed(() => {
    const [, labelX, labelY] = getSmoothStepPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition || Position.Bottom,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition || Position.Top,
      borderRadius: 0, // Step edge has no border radius
      offset: this.pathOptions?.offset,
    });
    return { labelX, labelY };
  });
}
