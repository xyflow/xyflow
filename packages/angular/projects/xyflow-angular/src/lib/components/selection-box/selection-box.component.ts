import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { FlowStateService } from '../../services/flow-state.service';

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
}

@Component({
  selector: 'xy-selection-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="selectionRect"
      class="xy-selection-box"
      [style.left.px]="selectionRect.x"
      [style.top.px]="selectionRect.y"
      [style.width.px]="selectionRect.width"
      [style.height.px]="selectionRect.height"
    ></div>
  `,
  styleUrls: ['./selection-box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBoxComponent implements OnInit, OnDestroy {
  selectionRect: SelectionRect | null = null;
  private isSelecting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    this.subscribeToInteractions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    // Only start selection on left click with shift key
    if (event.button !== 0 || !event.shiftKey) {
      return;
    }

    // Prevent default to avoid text selection
    event.preventDefault();
    event.stopPropagation();

    this.startSelection(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isSelecting) {
      this.updateSelection(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isSelecting) {
      this.endSelection();
    }
  }

  private subscribeToInteractions() {
    // Subscribe to flow state changes if needed
    this.flowState.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Update selection coordinates if viewport changes during selection
        if (this.isSelecting) {
          this.cdr.markForCheck();
        }
      });
  }

  private startSelection(event: MouseEvent) {
    this.isSelecting = true;
    
    // Get coordinates relative to the flow container
    const containerRect = this.getFlowContainer()?.getBoundingClientRect();
    if (!containerRect) return;

    const startX = event.clientX - containerRect.left;
    const startY = event.clientY - containerRect.top;

    this.selectionRect = {
      x: startX,
      y: startY,
      width: 0,
      height: 0,
      startX,
      startY,
    };

    this.cdr.markForCheck();
  }

  private updateSelection(event: MouseEvent) {
    if (!this.selectionRect) return;

    const containerRect = this.getFlowContainer()?.getBoundingClientRect();
    if (!containerRect) return;

    const currentX = event.clientX - containerRect.left;
    const currentY = event.clientY - containerRect.top;

    const { startX, startY } = this.selectionRect;

    this.selectionRect = {
      ...this.selectionRect,
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY),
    };

    this.cdr.markForCheck();
  }

  private endSelection() {
    if (!this.selectionRect) return;

    // Convert selection rectangle to flow coordinates
    const viewport = this.flowState.viewport;
    const flowRect = {
      x: (this.selectionRect.x - viewport.x) / viewport.zoom,
      y: (this.selectionRect.y - viewport.y) / viewport.zoom,
      width: this.selectionRect.width / viewport.zoom,
      height: this.selectionRect.height / viewport.zoom,
    };

    // Select nodes in the area
    this.flowState.selectNodesInArea(flowRect);

    // Clean up
    this.isSelecting = false;
    this.selectionRect = null;
    this.cdr.markForCheck();
  }

  private getFlowContainer(): HTMLElement | null {
    // Find the flow container element
    return this.elementRef.nativeElement.closest('.angular-flow') as HTMLElement;
  }
}