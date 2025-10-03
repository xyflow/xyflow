import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PanelPosition } from '@xyflow/system';

@Component({
  selector: 'angular-flow-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="angular-flow__panel"
      [class]="panelClasses"
      [style]="style"
      [attr.data-testid]="testId"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  @Input() position: PanelPosition = 'top-left';
  @Input() style?: Partial<CSSStyleDeclaration>;
  @Input() className?: string;
  @Input() testId?: string;

  get panelClasses(): string {
    const classes = ['angular-flow__panel'];
    if (this.position) {
      classes.push(this.position);
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(' ');
  }
}