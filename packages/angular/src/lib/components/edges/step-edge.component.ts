import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getStepPath, Position } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';

@Component({
  selector: 'angular-flow-step-edge',
  standalone: true,
  imports: [CommonModule, BaseEdgeComponent],
  template: `
    <angular-flow-base-edge
      [id]="id"
      [path]="edgePath"
      [selected]="selected"
      [markerStart]="markerStart"
      [markerEnd]="markerEnd"
    >
      <ng-content></ng-content>
    </angular-flow-base-edge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepEdgeComponent implements OnInit {
  @Input() id!: string;
  @Input() sourceX!: number;
  @Input() sourceY!: number;
  @Input() targetX!: number;
  @Input() targetY!: number;
  @Input() sourcePosition: Position = 'right';
  @Input() targetPosition: Position = 'left';
  @Input() selected: boolean = false;
  @Input() markerStart?: string;
  @Input() markerEnd?: string;
  @Input() offset?: number;

  edgePath: string = '';

  ngOnInit(): void {
    const [path] = getStepPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition,
      offset: this.offset,
    });
    this.edgePath = path;
  }
}
