import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getStraightPath } from '@xyflow/system';
import { BaseEdgeComponent } from './base-edge.component';

@Component({
  selector: 'angular-flow-straight-edge',
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
export class StraightEdgeComponent implements OnInit {
  @Input() id!: string;
  @Input() sourceX!: number;
  @Input() sourceY!: number;
  @Input() targetX!: number;
  @Input() targetY!: number;
  @Input() selected: boolean = false;
  @Input() markerStart?: string;
  @Input() markerEnd?: string;

  edgePath: string = '';

  ngOnInit(): void {
    const [path] = getStraightPath({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      targetX: this.targetX,
      targetY: this.targetY,
    });
    this.edgePath = path;
  }
}
