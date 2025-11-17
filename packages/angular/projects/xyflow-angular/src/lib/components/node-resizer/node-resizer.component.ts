import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeControlVariant, XY_RESIZER_HANDLE_POSITIONS, XY_RESIZER_LINE_POSITIONS } from '@xyflow/system';

import { NodeResizeControlComponent } from './node-resize-control.component';
import { NodeResizerProps } from './types';

/**
 * The `<xy-node-resizer>` component can be used to add a resize functionality to your
 * nodes. It renders draggable controls around the node to resize in all directions.
 *
 * @example
 * ```html
 * <xy-node-resizer [minWidth]="100" [minHeight]="30"></xy-node-resizer>
 * <div style="padding: 10px">{{ data.label }}</div>
 * ```
 */
@Component({
  selector: 'xy-node-resizer',
  standalone: true,
  imports: [CommonModule, NodeResizeControlComponent],
  template: `
    @if (isVisible) {
      <!-- Line controls -->
      @for (position of linePositions; track position) {
        <xy-node-resize-control
          [className]="lineClassName"
          [style]="lineStyle"
          [nodeId]="nodeId"
          [position]="position"
          [variant]="lineVariant"
          [color]="color"
          [minWidth]="minWidth"
          [minHeight]="minHeight"
          [maxWidth]="maxWidth"
          [maxHeight]="maxHeight"
          [onResizeStart]="onResizeStart"
          [keepAspectRatio]="keepAspectRatio"
          [autoScale]="autoScale"
          [shouldResize]="shouldResize"
          [onResize]="onResize"
          [onResizeEnd]="onResizeEnd"
          (resizeStart)="handleResizeStart($event)"
          (resize)="handleResize($event)"
          (resizeEnd)="handleResizeEnd($event)"
        ></xy-node-resize-control>
      }

      <!-- Handle controls -->
      @for (position of handlePositions; track position) {
        <xy-node-resize-control
          [className]="handleClassName"
          [style]="handleStyle"
          [nodeId]="nodeId"
          [position]="position"
          [variant]="handleVariant"
          [color]="color"
          [minWidth]="minWidth"
          [minHeight]="minHeight"
          [maxWidth]="maxWidth"
          [maxHeight]="maxHeight"
          [onResizeStart]="onResizeStart"
          [keepAspectRatio]="keepAspectRatio"
          [autoScale]="autoScale"
          [shouldResize]="shouldResize"
          [onResize]="onResize"
          [onResizeEnd]="onResizeEnd"
          (resizeStart)="handleResizeStart($event)"
          (resize)="handleResize($event)"
          (resizeEnd)="handleResizeEnd($event)"
        ></xy-node-resize-control>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeResizerComponent implements NodeResizerProps {
  @Input() nodeId?: string;
  @Input() color?: string;
  @Input() handleClassName?: string;
  @Input() handleStyle?: Record<string, any>;
  @Input() lineClassName?: string;
  @Input() lineStyle?: Record<string, any>;
  @Input() isVisible = true;
  @Input() minWidth = 10;
  @Input() minHeight = 10;
  @Input() maxWidth = Number.MAX_VALUE;
  @Input() maxHeight = Number.MAX_VALUE;
  @Input() keepAspectRatio = false;
  @Input() autoScale = true;
  @Input() shouldResize?: (event: any) => boolean;
  @Input() onResizeStart?: (event: any) => void;
  @Input() onResize?: (event: any) => void;
  @Input() onResizeEnd?: (event: any) => void;

  readonly linePositions = XY_RESIZER_LINE_POSITIONS;
  readonly handlePositions = XY_RESIZER_HANDLE_POSITIONS;
  readonly lineVariant = ResizeControlVariant.Line;
  readonly handleVariant = ResizeControlVariant.Handle;

  handleResizeStart(event: any) {
    this.onResizeStart?.(event);
  }

  handleResize(event: any) {
    this.onResize?.(event);
  }

  handleResizeEnd(event: any) {
    this.onResizeEnd?.(event);
  }
}
