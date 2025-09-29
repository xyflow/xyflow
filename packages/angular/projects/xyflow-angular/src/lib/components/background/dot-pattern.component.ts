import { Component, Input, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Dot pattern component for background grid.
 * Renders circular dots at regular intervals.
 */
@Component({
  selector: 'g[dot-pattern]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <circle
      [attr.cx]="radius"
      [attr.cy]="radius"
      [attr.r]="radius"
      [class]="getPatternClasses()"
    />
  `,
})
export class DotPatternComponent {
  @Input() radius: number = 1;
  @Input() patternClass?: string;

  getPatternClasses(): string {
    const baseClasses = ['angular-flow__background-pattern', 'dots'];
    if (this.patternClass) {
      baseClasses.push(this.patternClass);
    }
    return baseClasses.join(' ');
  }
}
