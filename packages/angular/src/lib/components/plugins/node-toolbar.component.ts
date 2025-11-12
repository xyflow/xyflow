import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'angular-flow-node-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      class="angular-flow__node-toolbar"
      [class]="'angular-flow__node-toolbar-' + position"
      [style.left.px]="x"
      [style.top.px]="y"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .angular-flow__node-toolbar {
      position: absolute;
      z-index: 1001;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 4px;
      display: flex;
      gap: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .angular-flow__node-toolbar-top {
      transform: translateY(calc(-100% - 8px));
    }

    .angular-flow__node-toolbar-bottom {
      transform: translateY(8px);
    }

    .angular-flow__node-toolbar-left {
      transform: translateX(calc(-100% - 8px));
    }

    .angular-flow__node-toolbar-right {
      transform: translateX(8px);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeToolbarComponent {
  @Input() nodeId!: string;
  @Input() isVisible: boolean = true;
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() x: number = 0;
  @Input() y: number = 0;
}
