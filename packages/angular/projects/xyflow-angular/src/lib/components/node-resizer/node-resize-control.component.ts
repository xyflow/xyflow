import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  inject,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  XYResizer,
  ResizeControlVariant,
  type XYResizerInstance,
  type XYResizerChange,
  type XYResizerChildChange,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  handleExpandParent,
  evaluateAbsolutePosition,
  ParentExpandChild,
  XYPosition,
  ControlPosition,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import { ResizeControlProps } from './types';

@Component({
  selector: 'xy-node-resize-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #resizeControl
      [class]="getControlClasses()"
      [ngStyle]="getControlStyle()"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./node-resize-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeResizeControlComponent implements OnInit, OnDestroy, ResizeControlProps {
  @ViewChild('resizeControl', { static: true })
  resizeControlRef!: ElementRef<HTMLDivElement>;

  @Input() nodeId?: string;
  @Input() position?: ControlPosition;
  @Input() variant: ResizeControlVariant = ResizeControlVariant.Handle;
  @Input() className?: string;
  @Input() style?: Record<string, any>;
  @Input() color?: string;
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
  @Input() resizeDirection?: 'horizontal' | 'vertical';

  @Output() resizeStart = new EventEmitter<any>();
  @Output() resize = new EventEmitter<any>();
  @Output() resizeEnd = new EventEmitter<any>();

  private flowStateService = inject(FlowStateService);
  private resizer: XYResizerInstance | null = null;
  private defaultPositions: Record<ResizeControlVariant, ControlPosition> = {
    [ResizeControlVariant.Line]: 'right',
    [ResizeControlVariant.Handle]: 'bottom-right',
  };

  constructor() {
    // Effect to handle scale changes for auto-scaling
    effect(() => {
      if (this.variant === ResizeControlVariant.Handle && this.autoScale) {
        const transform = this.flowStateService.transform;
        const scale = Math.max(1 / transform[2], 1);
        if (this.resizeControlRef?.nativeElement) {
          this.resizeControlRef.nativeElement.style.scale = `${scale}`;
        }
      }
    });
  }

  ngOnInit() {
    this.initializeResizer();
  }

  ngOnDestroy() {
    this.resizer?.destroy();
    this.resizer = null;
  }

  private initializeResizer() {
    if (!this.resizeControlRef?.nativeElement || !this.getEffectiveNodeId()) {
      return;
    }

    this.resizer = XYResizer({
      domNode: this.resizeControlRef.nativeElement,
      nodeId: this.getEffectiveNodeId()!,
      getStoreItems: () => {
        return {
          nodeLookup: this.flowStateService.nodeLookup,
          transform: this.flowStateService.transform,
          snapGrid: [15, 15] as [number, number], // TODO: Get from service
          snapToGrid: false, // TODO: Get from service
          nodeOrigin: this.flowStateService.nodeOrigin,
          paneDomNode: null, // TODO: Get from service
        };
      },
      onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
        this.handleResizerChange(change, childChanges);
      },
      onEnd: ({ width, height }) => {
        const id = this.getEffectiveNodeId()!;
        const dimensionChange: NodeDimensionChange = {
          id,
          type: 'dimensions',
          resizing: false,
          dimensions: {
            width,
            height,
          },
        };
        this.flowStateService.triggerNodeChanges([dimensionChange]);
      },
    });

    this.updateResizerConfig();
  }

  private handleResizerChange(change: XYResizerChange, childChanges: XYResizerChildChange[]) {
    const changes: NodeChange[] = [];
    const id = this.getEffectiveNodeId()!;
    const nextPosition = { x: change.x, y: change.y };
    const node = this.flowStateService.nodeLookup.get(id);

    // TODO: Implement parent expansion logic when parentLookup type is fixed
    // if (node && node.expandParent && node.parentId) {
    //   // Parent expansion logic here
    // }

    if (nextPosition.x !== undefined && nextPosition.y !== undefined) {
      const positionChange: NodePositionChange = {
        id,
        type: 'position',
        position: { ...(nextPosition as XYPosition) },
      };
      changes.push(positionChange);
    }

    if (change.width !== undefined && change.height !== undefined) {
      const setAttributes = !this.resizeDirection ? true : this.resizeDirection === 'horizontal' ? 'width' : 'height';
      const dimensionChange: NodeDimensionChange = {
        id,
        type: 'dimensions',
        resizing: true,
        setAttributes,
        dimensions: {
          width: change.width,
          height: change.height,
        },
      };

      changes.push(dimensionChange);
    }

    for (const childChange of childChanges) {
      const positionChange: NodePositionChange = {
        ...childChange,
        type: 'position',
      };
      changes.push(positionChange);
    }

    this.flowStateService.triggerNodeChanges(changes);
  }

  private updateResizerConfig() {
    if (!this.resizer) return;

    const controlPosition = this.position ?? this.defaultPositions[this.variant];

    this.resizer.update({
      controlPosition,
      boundaries: {
        minWidth: this.minWidth,
        minHeight: this.minHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
      },
      keepAspectRatio: this.keepAspectRatio,
      resizeDirection: this.resizeDirection,
      onResizeStart: (event: any) => {
        this.onResizeStart?.(event);
        this.resizeStart.emit(event);
      },
      onResize: (event: any) => {
        this.onResize?.(event);
        this.resize.emit(event);
      },
      onResizeEnd: (event: any) => {
        this.onResizeEnd?.(event);
        this.resizeEnd.emit(event);
      },
      shouldResize: this.shouldResize,
    });
  }

  private getEffectiveNodeId(): string | undefined {
    // In Angular, we'll need to implement a way to get the current node context
    // For now, we'll require nodeId to be passed explicitly
    return this.nodeId;
  }

  getControlClasses(): string {
    const controlPosition = this.position ?? this.defaultPositions[this.variant];
    const positionClassNames = controlPosition.split('-');

    return [
      'xy-flow__resize-control',
      'nodrag',
      ...positionClassNames,
      this.variant,
      this.className
    ].filter(Boolean).join(' ');
  }

  getControlStyle(): Record<string, any> {
    const isHandleControl = this.variant === ResizeControlVariant.Handle;
    const colorProperty = isHandleControl ? 'backgroundColor' : 'borderColor';

    return {
      ...this.style,
      ...(this.color && { [colorProperty]: this.color }),
    };
  }
}
