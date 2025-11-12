import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'angular-flow-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="angular-flow__controls" [class]="'angular-flow__controls-' + position">
      <button
        *ngIf="showZoom"
        class="angular-flow__controls-button angular-flow__controls-zoomin"
        (click)="onZoomIn()"
        title="Zoom in"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path fill="currentColor" d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>

      <button
        *ngIf="showZoom"
        class="angular-flow__controls-button angular-flow__controls-zoomout"
        (click)="onZoomOut()"
        title="Zoom out"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path fill="none" d="M3 8h10" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>

      <button
        *ngIf="showFitView"
        class="angular-flow__controls-button angular-flow__controls-fitview"
        (click)="onFitView()"
        title="Fit view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path fill="currentColor" d="M2 2h4v2H4v2H2V2zm8 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 0h-2v2h-2v2h4v-4z"/>
        </svg>
      </button>

      <button
        *ngIf="showInteractive"
        class="angular-flow__controls-button angular-flow__controls-interactive"
        (click)="onInteractiveChange()"
        [title]="isInteractive ? 'Disable interactions' : 'Enable interactions'"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path *ngIf="isInteractive" fill="currentColor" d="M8 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/>
          <path *ngIf="!isInteractive" fill="currentColor" d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .angular-flow__controls {
      position: absolute;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .angular-flow__controls-bottom-left {
      bottom: 16px;
      left: 16px;
    }

    .angular-flow__controls-bottom-right {
      bottom: 16px;
      right: 16px;
    }

    .angular-flow__controls-top-left {
      top: 16px;
      left: 16px;
    }

    .angular-flow__controls-top-right {
      top: 16px;
      right: 16px;
    }

    .angular-flow__controls-button {
      width: 32px;
      height: 32px;
      padding: 4px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .angular-flow__controls-button:hover {
      background: #f7fafc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .angular-flow__controls-button:active {
      background: #edf2f7;
    }

    .angular-flow__controls-button svg {
      color: #4a5568;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  @Input() showZoom: boolean = true;
  @Input() showFitView: boolean = true;
  @Input() showInteractive: boolean = true;
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-left';
  @Input() isInteractive: boolean = true;

  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() fitView = new EventEmitter<void>();
  @Output() interactiveChange = new EventEmitter<boolean>();

  onZoomIn(): void {
    this.zoomIn.emit();
  }

  onZoomOut(): void {
    this.zoomOut.emit();
  }

  onFitView(): void {
    this.fitView.emit();
  }

  onInteractiveChange(): void {
    this.isInteractive = !this.isInteractive;
    this.interactiveChange.emit(this.isInteractive);
  }
}
