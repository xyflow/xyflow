import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, map } from 'rxjs';
import type { PanelPosition, FitViewOptionsBase } from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import { PanelComponent } from '../panel/panel.component';
import type { ControlsProps } from '../../types/general';

@Component({
  selector: 'angular-flow-controls',
  standalone: true,
  imports: [CommonModule, PanelComponent],
  template: `
    <angular-flow-panel
      [position]="position"
      [className]="panelClasses"
      [style]="style"
      [attr.aria-label]="ariaLabel || 'Flow controls'"
      data-testid="angular-flow__controls"
    >
      <!-- Zoom In Button -->
      <button
        *ngIf="showZoom"
        type="button"
        class="angular-flow__controls-button angular-flow__controls-zoomin"
        [disabled]="maxZoomReached"
        [title]="'Zoom in'"
        [attr.aria-label]="'Zoom in'"
        (click)="onZoomInClick()"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Zoom Out Button -->
      <button
        *ngIf="showZoom"
        type="button"
        class="angular-flow__controls-button angular-flow__controls-zoomout"
        [disabled]="minZoomReached"
        [title]="'Zoom out'"
        [attr.aria-label]="'Zoom out'"
        (click)="onZoomOutClick()"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Fit View Button -->
      <button
        *ngIf="showFitView"
        type="button"
        class="angular-flow__controls-button angular-flow__controls-fitview"
        [title]="'Fit view'"
        [attr.aria-label]="'Fit view'"
        (click)="onFitViewClick()"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M2 3h12v10H2V3z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M6 7l2 2 2-2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Interactive Toggle Button -->
      <button
        *ngIf="showInteractive"
        type="button"
        class="angular-flow__controls-button angular-flow__controls-interactive"
        [title]="isInteractive ? 'Lock interaction' : 'Unlock interaction'"
        [attr.aria-label]="isInteractive ? 'Lock interaction' : 'Unlock interaction'"
        (click)="onToggleInteractive()"
      >
        <!-- Unlock Icon (when interactive) -->
        <svg *ngIf="isInteractive" width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 7h8v7H4V7zM6 7V5a2 2 0 0 1 4 0v2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
        <!-- Lock Icon (when not interactive) -->
        <svg *ngIf="!isInteractive" width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 7h8v7H4V7zM6 7V5a2 2 0 0 1 4 0v2h-1V5a1 1 0 0 0-2 0v2H6z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Content projection for additional controls -->
      <ng-content></ng-content>
    </angular-flow-panel>
  `,
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements OnInit, OnDestroy {
  @Input() position: PanelPosition = 'bottom-left';
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() showZoom: boolean = true;
  @Input() showFitView: boolean = true;
  @Input() showInteractive: boolean = true;
  @Input() fitViewOptions?: FitViewOptionsBase;
  @Input() style?: Partial<CSSStyleDeclaration>;
  @Input() className?: string;
  @Input() ariaLabel?: string;

  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() fitView = new EventEmitter<void>();
  @Output() interactiveChange = new EventEmitter<boolean>();

  // Component state
  isInteractive = true;
  minZoomReached = false;
  maxZoomReached = false;
  panelClasses = '';

  private destroy$ = new Subject<void>();

  constructor(
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updatePanelClasses();
    this.subscribeToState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePanelClasses(): void {
    const classes = ['angular-flow__controls'];
    if (this.orientation) {
      classes.push(this.orientation);
    }
    if (this.className) {
      classes.push(this.className);
    }
    this.panelClasses = classes.join(' ');
  }

  private subscribeToState(): void {
    // Subscribe to interactive state
    this.flowState.isInteractive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isInteractive => {
        this.isInteractive = isInteractive;
        this.cdr.markForCheck();
      });

    // Subscribe to viewport changes to determine zoom limits
    this.flowState.viewport$
      .pipe(
        takeUntil(this.destroy$),
        map(viewport => ({
          minZoomReached: viewport.zoom <= this.flowState.minZoom,
          maxZoomReached: viewport.zoom >= this.flowState.maxZoom,
        }))
      )
      .subscribe(({ minZoomReached, maxZoomReached }) => {
        this.minZoomReached = minZoomReached;
        this.maxZoomReached = maxZoomReached;
        this.cdr.markForCheck();
      });
  }

  onZoomInClick(): void {
    this.flowState.zoomIn?.();
    this.zoomIn.emit();
  }

  onZoomOutClick(): void {
    this.flowState.zoomOut?.();
    this.zoomOut.emit();
  }

  onFitViewClick(): void {
    this.flowState.fitView(this.fitViewOptions);
    this.fitView.emit();
  }

  onToggleInteractive(): void {
    const newInteractive = !this.isInteractive;

    this.flowState.setElementsSelectable(newInteractive);
    this.flowState.setNodesDraggable(newInteractive);
    this.flowState.setNodesConnectable(newInteractive);

    this.interactiveChange.emit(newInteractive);
  }
}
