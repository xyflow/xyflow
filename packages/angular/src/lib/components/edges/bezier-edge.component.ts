import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getBezierPath } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';
import type { EdgeComponentProps, Position } from '../../types';

@Component({
  selector: 'angular-flow-bezier-edge',
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
export class BezierEdgeComponent implements OnInit {
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
  @Input() curvature?: number;

  edgePath: string = '';

  ngOnInit(): void {
    const [path] = getBezierPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourcePosition: this.sourcePosition,
      targetX: this.targetX,
      targetY: this.targetY,
      targetPosition: this.targetPosition,
      curvature: this.curvature,
    });
    this.edgePath = path;
  }
}
