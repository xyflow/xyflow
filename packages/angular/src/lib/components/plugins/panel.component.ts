import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'angular-flow-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="angular-flow__panel" [class]="'angular-flow__panel-' + position">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .angular-flow__panel {
      position: absolute;
      z-index: 1000;
      padding: 16px;
    }

    .angular-flow__panel-top-left {
      top: 16px;
      left: 16px;
    }

    .angular-flow__panel-top-center {
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
    }

    .angular-flow__panel-top-right {
      top: 16px;
      right: 16px;
    }

    .angular-flow__panel-bottom-left {
      bottom: 16px;
      left: 16px;
    }

    .angular-flow__panel-bottom-center {
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
    }

    .angular-flow__panel-bottom-right {
      bottom: 16px;
      right: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  @Input() position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' = 'top-left';
}
