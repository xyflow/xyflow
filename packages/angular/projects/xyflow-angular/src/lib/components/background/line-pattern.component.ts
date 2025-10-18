import { Component, Input, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackgroundVariant } from './types';

/**
 * Line pattern component for background grid.
 * Renders lines or crosses based on variant.
 */
@Component({
  selector: 'g[line-pattern]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <path
      [attr.stroke-width]="lineWidth"
      [attr.d]="getPathData()"
      [class]="getPatternClasses()"
    />
  `,
})
export class LinePatternComponent {
  @Input() dimensions: [number, number] = [20, 20];
  @Input() variant: BackgroundVariant = BackgroundVariant.Lines;
  @Input() lineWidth: number = 1;
  @Input() patternClass?: string;

  getPathData(): string {
    const [width, height] = this.dimensions;
    return `M${width / 2} 0 V${height} M0 ${height / 2} H${width}`;
  }

  getPatternClasses(): string {
    const baseClasses = ['angular-flow__background-pattern', this.variant];
    if (this.patternClass) {
      baseClasses.push(this.patternClass);
    }
    return baseClasses.join(' ');
  }
}
