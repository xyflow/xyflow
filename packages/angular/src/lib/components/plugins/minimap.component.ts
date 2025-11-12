import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowStoreService } from '../../services/flow-store.service';

@Component({
  selector: 'angular-flow-minimap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="angular-flow__minimap" [class]="'angular-flow__minimap-' + position">
      <svg
        [attr.width]="width"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
      >
        <rect
          x="0"
          y="0"
          [attr.width]="width"
          [attr.height]="height"
          [attr.fill]="backgroundColor"
        />

        <!-- Render minimap nodes -->
        <rect
          *ngFor="let node of store.nodes()"
          [attr.x]="getNodeX(node)"
          [attr.y]="getNodeY(node)"
          [attr.width]="getNodeWidth(node)"
          [attr.height]="getNodeHeight(node)"
          [attr.fill]="node.selected ? nodeColorSelected : nodeColor"
          [attr.stroke]="nodeBorderColor"
          [attr.stroke-width]="1"
          rx="2"
        />

        <!-- Viewport indicator -->
        <rect
          class="angular-flow__minimap-viewport"
          [attr.x]="getViewportX()"
          [attr.y]="getViewportY()"
          [attr.width]="getViewportWidth()"
          [attr.height]="getViewportHeight()"
          fill="none"
          [attr.stroke]="viewportColor"
          [attr.stroke-width]="2"
        />
      </svg>
    </div>
  `,
  styles: [`
    .angular-flow__minimap {
      position: absolute;
      z-index: 1000;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .angular-flow__minimap-bottom-left {
      bottom: 16px;
      left: 16px;
    }

    .angular-flow__minimap-bottom-right {
      bottom: 16px;
      right: 16px;
    }

    .angular-flow__minimap-top-left {
      top: 16px;
      left: 16px;
    }

    .angular-flow__minimap-top-right {
      top: 16px;
      right: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimapComponent {
  @Input() width: number = 200;
  @Input() height: number = 150;
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-right';
  @Input() nodeColor: string = '#e2e8f0';
  @Input() nodeColorSelected: string = '#3b82f6';
  @Input() nodeBorderColor: string = '#cbd5e0';
  @Input() backgroundColor: string = '#f7fafc';
  @Input() viewportColor: string = '#3b82f6';

  constructor(public store: FlowStoreService) {}

  getNodeX(node: any): number {
    // Scale node position to minimap
    return (node.position.x * this.width) / 1000; // Simplified scaling
  }

  getNodeY(node: any): number {
    return (node.position.y * this.height) / 1000;
  }

  getNodeWidth(node: any): number {
    return ((node.width || 150) * this.width) / 1000;
  }

  getNodeHeight(node: any): number {
    return ((node.height || 40) * this.height) / 1000;
  }

  getViewportX(): number {
    const viewport = this.store.viewport();
    return (-viewport.x * this.width) / (1000 * viewport.zoom);
  }

  getViewportY(): number {
    const viewport = this.store.viewport();
    return (-viewport.y * this.height) / (1000 * viewport.zoom);
  }

  getViewportWidth(): number {
    const viewport = this.store.viewport();
    return (this.store.width() * this.width) / (1000 * viewport.zoom);
  }

  getViewportHeight(): number {
    const viewport = this.store.viewport();
    return (this.store.height() * this.height) / (1000 * viewport.zoom);
  }
}
