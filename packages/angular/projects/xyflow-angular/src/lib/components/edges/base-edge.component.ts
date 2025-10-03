import {
  Component,
  Input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isNumeric } from '@xyflow/system';
import { EdgeTextComponent } from './edge-text.component';
import { BaseEdgeProps } from './types';

/**
 * The BaseEdge component gets used internally for all edges and can be used inside custom edges.
 * It handles the invisible helper edge and the edge label.
 */
@Component({
  selector: 'xy-base-edge',
  standalone: true,
  imports: [CommonModule, EdgeTextComponent],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <path
      [attr.id]="id"
      [attr.d]="path"
      fill="none"
      [class]="'xyflow__edge-path ' + (className || '')"
      [ngStyle]="style || {}"
      [attr.marker-start]="markerStart"
      [attr.marker-end]="markerEnd"
    />

    @if (interactionWidth && interactionWidth > 0) {
      <path
        [attr.d]="path"
        fill="none"
        stroke-opacity="0"
        [attr.stroke-width]="interactionWidth"
        class="xyflow__edge-interaction"
      />
    }

    @if (label && isLabelVisible()) {
      <xy-edge-text
        [x]="labelX!"
        [y]="labelY!"
        [label]="label"
        [labelStyle]="labelStyle"
        [labelShowBg]="labelShowBg ?? true"
        [labelBgStyle]="labelBgStyle"
        [labelBgPadding]="labelBgPadding ?? [2, 4]"
        [labelBgBorderRadius]="labelBgBorderRadius ?? 2"
      />
    }
  `,
  styles: [`
    .xyflow__edge-path {
      stroke: #b1b1b7;
      stroke-width: 1;
      fill: none;
    }

    .xyflow__edge-interaction {
      fill: none;
      stroke: transparent;
      stroke-width: 20;
      cursor: pointer;
    }
  `]
})
export class BaseEdgeComponent implements BaseEdgeProps {
  @Input() path!: string;
  @Input() interactionWidth: number = 20;
  @Input() labelX?: number;
  @Input() labelY?: number;
  @Input() label?: string;
  @Input() labelStyle?: { [key: string]: any };
  @Input() labelShowBg?: boolean;
  @Input() labelBgStyle?: { [key: string]: any };
  @Input() labelBgPadding?: [number, number];
  @Input() labelBgBorderRadius?: number;
  @Input() id?: string;
  @Input() className?: string;
  @Input() style?: { [key: string]: any };
  @Input() markerStart?: string;
  @Input() markerEnd?: string;

  protected isLabelVisible(): boolean {
    return !!(this.labelX !== undefined && this.labelY !== undefined &&
              isNumeric(this.labelX) && isNumeric(this.labelY));
  }
}
