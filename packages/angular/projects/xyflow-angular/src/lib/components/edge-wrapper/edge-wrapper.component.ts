import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentRef,
  Injector,
  Type,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  ConnectionLineType,
  MarkerType,
  type EdgeMarker,
  type Position,
  type XYPosition,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import type { Edge, Node, EdgeChange, AngularFlowEdge, AngularEdgeTypes } from '../../types/general';

export interface EdgeWrapperProps {
  edge: AngularFlowEdge;
  sourceNode?: Node;
  targetNode?: Node;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  edgeTypes?: AngularEdgeTypes;
  markerEnd?: string;
  markerStart?: string;
  pathOptions?: any;
  interactionWidth?: number;
}

@Component({
  selector: 'xy-edge-wrapper',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule],
  template: `
    <g
      class="xy-edge"
      [class]="edge.className || ''"
      [class.xy-selected]="edge.selected"
      [class.xy-animated]="edge.animated"
      [class.xy-updating]="isUpdating"
      [attr.data-id]="edge.id"
      [attr.data-edgetype]="edge.type"
    >
      <!-- Interaction path (invisible, wider for easier clicking) -->
      <path
        class="xy-edge-interaction"
        [attr.d]="edgePath"
        [attr.stroke-width]="interactionWidth"
        fill="none"
        stroke="transparent"
        (click)="onClick($event)"
        (dblclick)="onDoubleClick($event)"
        (contextmenu)="onContextMenu($event)"
        (mouseenter)="onMouseEnter($event)"
        (mouseleave)="onMouseLeave($event)"
      />

      <!-- Main edge path -->
      <path
        class="xy-edge-path"
        [attr.d]="edgePath"
        [attr.stroke]="edge.style?.stroke || '#b1b1b7'"
        [attr.stroke-width]="edge.style?.strokeWidth || 1"
        [attr.stroke-dasharray]="edge.style?.strokeDasharray"
        [attr.marker-end]="markerEnd"
        [attr.marker-start]="markerStart"
        [style]="getEdgeStyle()"
        fill="none"
      />

      <!-- Edge label -->
      <foreignObject
        *ngIf="edge.label || edge.labelStyle"
        class="xy-edge-label"
        [attr.x]="labelPosition.x - (labelBounds.width / 2)"
        [attr.y]="labelPosition.y - (labelBounds.height / 2)"
        [attr.width]="labelBounds.width"
        [attr.height]="labelBounds.height"
        [attr.transform]="labelTransform"
      >
        <div class="xy-edge-label-text" [style]="getLabelStyle()">
          <!-- Render custom component or template -->
          <ng-container #edgeLabelOutlet></ng-container>

          <!-- Fallback to simple text -->
          <span *ngIf="!hasCustomLabel">{{ edge.label }}</span>
        </div>
      </foreignObject>
    </g>
  `,
  styleUrls: ['./edge-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdgeWrapperComponent implements OnInit, OnDestroy, OnChanges, EdgeWrapperProps {
  @Input() edge!: AngularFlowEdge;
  @Input() sourceNode?: Node;
  @Input() targetNode?: Node;
  @Input() sourceHandleId?: string | null;
  @Input() targetHandleId?: string | null;
  @Input() sourceX!: number;
  @Input() sourceY!: number;
  @Input() targetX!: number;
  @Input() targetY!: number;
  @Input() sourcePosition!: Position;
  @Input() targetPosition!: Position;
  @Input() edgeTypes?: AngularEdgeTypes;
  @Input() markerEnd?: string;
  @Input() markerStart?: string;
  @Input() pathOptions?: any;
  @Input() interactionWidth: number = 20;

  @Output() edgeClick = new EventEmitter<{ event: MouseEvent; edge: AngularFlowEdge }>();
  @Output() edgeDoubleClick = new EventEmitter<{ event: MouseEvent; edge: AngularFlowEdge }>();
  @Output() edgeContextMenu = new EventEmitter<{ event: MouseEvent; edge: AngularFlowEdge }>();
  @Output() edgeMouseEnter = new EventEmitter<{ event: MouseEvent; edge: AngularFlowEdge }>();
  @Output() edgeMouseLeave = new EventEmitter<{ event: MouseEvent; edge: AngularFlowEdge }>();

  @ViewChild('edgeLabelOutlet', { read: ViewContainerRef, static: false })
  edgeLabelOutlet?: ViewContainerRef;

  edgePath = '';
  labelPosition: XYPosition = { x: 0, y: 0 };
  labelBounds = { width: 100, height: 30 };
  labelTransform = '';
  isUpdating = false;
  hasCustomLabel = false;

  private destroy$ = new Subject<void>();
  private labelComponentRef?: ComponentRef<any>;

  constructor(
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.updateEdgePath();
    this.renderEdgeLabel();
    this.subscribeToChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupLabelComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    const relevantChanges = [
      'sourceX', 'sourceY', 'targetX', 'targetY',
      'sourcePosition', 'targetPosition', 'edge'
    ];

    if (relevantChanges.some(key => changes[key] && !changes[key].firstChange)) {
      this.updateEdgePath();
      this.renderEdgeLabel();
      this.cdr.markForCheck();
    }
  }

  private subscribeToChanges() {
    this.flowState.edges$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  private updateEdgePath() {
    const type = this.edge.type || 'default';
    const pathFunction = this.getPathFunction(type);

    const pathResult = pathFunction({
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      targetX: this.targetX,
      targetY: this.targetY,
      sourcePosition: this.sourcePosition,
      targetPosition: this.targetPosition,
      ...this.pathOptions,
    });

    if (typeof pathResult === 'string') {
      this.edgePath = pathResult;
      this.labelPosition = this.calculateDefaultLabelPosition();
    } else {
      // pathResult includes labelX, labelY
      this.edgePath = pathResult[0];
      this.labelPosition = { x: pathResult[1], y: pathResult[2] };
    }
  }

  private getPathFunction(type: string) {
    switch (type) {
      case 'straight':
        return getStraightPath;
      case 'step':
      case 'smoothstep':
        return getSmoothStepPath;
      case 'simplebezier':
        return getBezierPath;
      case 'bezier':
      default:
        return getBezierPath;
    }
  }

  private calculateDefaultLabelPosition(): XYPosition {
    // Calculate midpoint of the edge for label positioning
    const midX = (this.sourceX + this.targetX) / 2;
    const midY = (this.sourceY + this.targetY) / 2;
    return { x: midX, y: midY };
  }

  private renderEdgeLabel() {
    this.cleanupLabelComponent();

    if (!this.edge.label && !this.edge.labelComponent) {
      this.hasCustomLabel = false;
      return;
    }

    if (this.edge.labelComponent && this.edgeLabelOutlet) {
      this.renderLabelComponent();
    } else {
      this.hasCustomLabel = false;
    }

    this.updateLabelBounds();
  }

  private renderLabelComponent() {
    if (!this.edge.labelComponent || !this.edgeLabelOutlet) return;

    const ComponentType = this.edgeTypes?.[this.edge.type || 'default'];
    if (!ComponentType) return;

    const componentInjector = Injector.create({
      providers: [
        { provide: 'EDGE_DATA', useValue: this.edge },
        { provide: 'XYFLOW_EDGE_ID', useValue: this.edge.id },
      ],
      parent: this.injector,
    });

    this.labelComponentRef = this.edgeLabelOutlet.createComponent(ComponentType as any, {
      injector: componentInjector,
    });

    // Pass edge data to component
    if ('data' in this.labelComponentRef.instance) {
      this.labelComponentRef.instance.data = this.edge.data;
    }

    if ('edge' in this.labelComponentRef.instance) {
      this.labelComponentRef.instance.edge = this.edge;
    }

    this.hasCustomLabel = true;
  }

  private cleanupLabelComponent() {
    if (this.labelComponentRef) {
      this.labelComponentRef.destroy();
      this.labelComponentRef = undefined;
    }
    this.edgeLabelOutlet?.clear();
  }

  private updateLabelBounds() {
    // Calculate label bounds based on content
    if (this.edge.label) {
      const text = this.edge.label.toString();
      // Rough estimation - in a real implementation, you'd measure the actual text
      this.labelBounds = {
        width: Math.max(text.length * 8, 20),
        height: 20,
      };
    } else {
      this.labelBounds = { width: 100, height: 30 };
    }

    // Calculate rotation for label if needed
    const angle = Math.atan2(this.targetY - this.sourceY, this.targetX - this.sourceX);
    const shouldRotate = this.edge.labelShowBg === false; // Only rotate if no background

    if (shouldRotate && Math.abs(angle) > Math.PI / 4) {
      const degrees = (angle * 180) / Math.PI;
      this.labelTransform = `rotate(${degrees} ${this.labelPosition.x} ${this.labelPosition.y})`;
    } else {
      this.labelTransform = '';
    }
  }

  getEdgeStyle(): Record<string, any> {
    const style: Record<string, any> = {};

    if (this.edge.style) {
      Object.assign(style, this.edge.style);
    }

    if (this.edge.animated) {
      style['strokeDasharray'] = '5,5';
      style['animation'] = 'xy-edge-dash 0.5s linear infinite';
    }

    return style;
  }

  getLabelStyle(): Record<string, any> {
    const style: Record<string, any> = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
    };

    if (this.edge.labelStyle) {
      Object.assign(style, this.edge.labelStyle);
    }

    if (this.edge.labelShowBg !== false) {
      style['background'] = this.edge.labelBgStyle?.fill || '#ffffff';
      style['padding'] = this.edge.labelBgPadding || [2, 4];
      style['borderRadius'] = this.edge.labelBgBorderRadius || 2;
      style['border'] = '1px solid #d1d5db';
    }

    return style;
  }

  // Event handlers
  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.edgeClick.emit({ event, edge: this.edge });
    this.flowState.onEdgeClick?.(event, this.edge);

    // Handle selection
    if (this.flowState.elementsSelectable) {
      const isSelected = !this.edge.selected;
      const changes: EdgeChange[] = [{
        type: 'select',
        id: this.edge.id,
        selected: isSelected,
      }];
      this.flowState.applyEdgeChanges?.(changes);
    }
  }

  onDoubleClick(event: MouseEvent) {
    event.stopPropagation();
    this.edgeDoubleClick.emit({ event, edge: this.edge });
    this.flowState.onEdgeDoubleClick?.(event, this.edge);
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.edgeContextMenu.emit({ event, edge: this.edge });
    this.flowState.onEdgeContextMenu?.(event, this.edge);
  }

  onMouseEnter(event: MouseEvent) {
    this.edgeMouseEnter.emit({ event, edge: this.edge });
    this.flowState.onEdgeMouseEnter?.(event, this.edge);
  }

  onMouseLeave(event: MouseEvent) {
    this.edgeMouseLeave.emit({ event, edge: this.edge });
    this.flowState.onEdgeMouseLeave?.(event, this.edge);
  }
}
