import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BackgroundVariant = 'dots' | 'lines' | 'cross';

@Component({
  selector: 'angular-flow-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="angular-flow__background" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
      <pattern
        *ngIf="variant === 'dots'"
        [attr.id]="patternId"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="gap * zoom"
        [attr.height]="gap * zoom"
        patternUnits="userSpaceOnUse"
      >
        <circle
          [attr.cx]="size * zoom"
          [attr.cy]="size * zoom"
          [attr.r]="size * zoom"
          [attr.fill]="color"
        />
      </pattern>

      <pattern
        *ngIf="variant === 'lines'"
        [attr.id]="patternId"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="gap * zoom"
        [attr.height]="gap * zoom"
        patternUnits="userSpaceOnUse"
      >
        <path
          [attr.d]="'M ' + (gap * zoom) + ' 0 L 0 0 0 ' + (gap * zoom)"
          [attr.fill]="'none'"
          [attr.stroke]="color"
          [attr.stroke-width]="size"
        />
      </pattern>

      <pattern
        *ngIf="variant === 'cross'"
        [attr.id]="patternId"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="gap * zoom"
        [attr.height]="gap * zoom"
        patternUnits="userSpaceOnUse"
      >
        <path
          [attr.d]="'M ' + (gap * zoom / 2) + ' 0 L ' + (gap * zoom / 2) + ' ' + (gap * zoom) + ' M 0 ' + (gap * zoom / 2) + ' L ' + (gap * zoom) + ' ' + (gap * zoom / 2)"
          [attr.fill]="'none'"
          [attr.stroke]="color"
          [attr.stroke-width]="size"
        />
      </pattern>

      <rect x="0" y="0" width="100%" height="100%" [attr.fill]="'url(#' + patternId + ')'" />
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent {
  @Input() variant: BackgroundVariant = 'dots';
  @Input() gap: number = 20;
  @Input() size: number = 1;
  @Input() color: string = '#81818a';
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() zoom: number = 1;

  patternId = `pattern-${Math.random().toString(36).substring(7)}`;
}
