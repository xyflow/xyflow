import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { EdgeComponentProps } from '../../types';

@Component({
  selector: 'angular-flow-base-edge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <g [attr.class]="'angular-flow-edge ' + (selected ? 'selected' : '')">
      <path
        [attr.id]="id"
        [attr.d]="path"
        [attr.class]="'angular-flow-edge-path ' + (selected ? 'selected' : '')"
        [attr.marker-start]="markerStart"
        [attr.marker-end]="markerEnd"
        [style.stroke]="stroke || '#b1b1b7'"
        [style.stroke-width]="strokeWidth || 1"
        fill="none"
      />
      <path
        [attr.d]="path"
        class="angular-flow-edge-interaction"
        fill="none"
        stroke="transparent"
        [attr.stroke-width]="interactionWidth || 20"
      />
      <ng-content></ng-content>
    </g>
  `,
  styles: [`
    .angular-flow-edge-path {
      stroke: #b1b1b7;
      stroke-width: 1;
      fill: none;
    }

    .angular-flow-edge-path.selected {
      stroke: #555;
      stroke-width: 2;
    }

    .angular-flow-edge-interaction {
      cursor: pointer;
      pointer-events: stroke;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseEdgeComponent {
  @Input() id!: string;
  @Input() path!: string;
  @Input() selected: boolean = false;
  @Input() markerStart?: string;
  @Input() markerEnd?: string;
  @Input() stroke?: string;
  @Input() strokeWidth?: number;
  @Input() interactionWidth?: number;
}
