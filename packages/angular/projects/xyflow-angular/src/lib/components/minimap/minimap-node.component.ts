import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * Individual node representation in the minimap.
 * Renders as an SVG rectangle with customizable styling.
 */
@Component({
  selector: 'g[minimap-node]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <rect
      [attr.x]="x"
      [attr.y]="y"
      [attr.width]="width"
      [attr.height]="height"
      [attr.rx]="borderRadius"
      [attr.ry]="borderRadius"
      [attr.fill]="color"
      [attr.stroke]="strokeColor"
      [attr.stroke-width]="strokeWidth"
      [attr.shape-rendering]="shapeRendering"
      [class]="getNodeClasses()"
    />
  `,
})
export class MiniMapNodeComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() borderRadius?: number;
  @Input() className?: string;
  @Input() color?: string;
  @Input() shapeRendering?: string = 'geometricPrecision';
  @Input() strokeColor?: string;
  @Input() strokeWidth?: number;
  @Input() selected?: boolean;

  getNodeClasses(): string {
    const baseClasses = ['angular-flow__minimap-node'];

    if (this.selected) {
      baseClasses.push('selected');
    }

    if (this.className) {
      baseClasses.push(this.className);
    }

    return baseClasses.join(' ');
  }
}
