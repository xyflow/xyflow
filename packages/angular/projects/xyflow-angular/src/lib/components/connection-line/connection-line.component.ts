import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import {
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  Position,
  type ConnectionLineType,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';

export interface ConnectionLineProps {
  type?: ConnectionLineType;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  pathOptions?: {
    offset?: number;
    borderRadius?: number;
  };
}

@Component({
  selector: 'xy-connection-line',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      *ngIf="isVisible"
      class="xy-connection-line"
      [class]="className || ''"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000;"
    >
      <defs>
        <marker
          id="xy-connection-line-marker"
          markerWidth="12"
          markerHeight="12"
          refX="11"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M1,1 L1,11 L11,6 z"
            fill="var(--xy-connection-line-color, #b1b1b7)"
            stroke="none"
          />
        </marker>
      </defs>

      <path
        [attr.d]="connectionPath"
        [attr.stroke]="style?.stroke || 'var(--xy-connection-line-color, #b1b1b7)'"
        [attr.stroke-width]="style?.strokeWidth || '2'"
        [attr.stroke-dasharray]="style?.strokeDasharray || '5,5'"
        [attr.marker-end]="'url(#xy-connection-line-marker)'"
        fill="none"
        class="xy-connection-line-path"
      />
    </svg>
  `,
  styleUrls: ['./connection-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionLineComponent implements OnInit, OnDestroy, ConnectionLineProps {
  @Input() type: ConnectionLineType = 'straight' as ConnectionLineType;
  @Input() style?: Partial<CSSStyleDeclaration>;
  @Input() className?: string;
  @Input() pathOptions?: { offset?: number; borderRadius?: number };

  isVisible = false;
  connectionPath = '';

  private destroy$ = new Subject<void>();

  constructor(
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToConnectionState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToConnectionState() {
    combineLatest([
      this.flowState.connectionInProgress$,
      this.flowState.connectionStartHandle$,
      this.flowState.connectionPosition$,
      this.flowState.viewport$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([inProgress, startHandle, position, viewport]) => {
        this.isVisible = inProgress && !!startHandle && !!position;

        if (this.isVisible && startHandle && position) {
          this.updateConnectionPath(startHandle, position, viewport);
        }

        this.cdr.markForCheck();
      });
  }

  private updateConnectionPath(
    startHandle: {
      nodeId: string;
      handleId?: string;
      type: 'source' | 'target';
      position: { x: number; y: number }
    },
    cursorPosition: { x: number; y: number },
    viewport: { x: number; y: number; zoom: number }
  ) {
    // Convert cursor position to flow coordinates
    const flowCursorX = (cursorPosition.x - viewport.x) / viewport.zoom;
    const flowCursorY = (cursorPosition.y - viewport.y) / viewport.zoom;

    // Get the path function based on type
    const pathFunction = this.getPathFunction();

    // Calculate source and target positions
    let sourceX: number, sourceY: number, targetX: number, targetY: number;
    let sourcePosition: Position, targetPosition: Position;

    if (startHandle.type === 'source') {
      sourceX = startHandle.position.x;
      sourceY = startHandle.position.y;
      targetX = flowCursorX;
      targetY = flowCursorY;
      sourcePosition = this.getHandlePosition(startHandle);
      targetPosition = Position.Left; // Default target position
    } else {
      sourceX = flowCursorX;
      sourceY = flowCursorY;
      targetX = startHandle.position.x;
      targetY = startHandle.position.y;
      sourcePosition = Position.Right; // Default source position
      targetPosition = this.getHandlePosition(startHandle);
    }

    // Generate the path
    const pathResult = pathFunction({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      ...this.pathOptions,
    });

    this.connectionPath = typeof pathResult === 'string' ? pathResult : pathResult[0];
  }

  private getPathFunction() {
    switch (this.type) {
      case 'straight':
        return getStraightPath;
      case 'step':
      case 'smoothstep':
        return getSmoothStepPath;
      case 'simplebezier':
        return getBezierPath;
      case 'bezier' as any:
      default:
        return getBezierPath;
    }
  }

  private getHandlePosition(handle: { type: 'source' | 'target' }): Position {
    // This is a simplified implementation
    // In a real scenario, you'd get this from the handle's actual position attribute
    return handle.type === 'source' ? Position.Right : Position.Left;
  }
}
