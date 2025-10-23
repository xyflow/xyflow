import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeResizerComponent, NodeToolbarComponent } from '../../../xyflow-angular/src/public-api';
import { Position } from '@xyflow/system';

@Component({
  selector: 'app-resizable-node',
  standalone: true,
  imports: [CommonModule, NodeResizerComponent, NodeToolbarComponent],
  template: `
    <xy-node-toolbar [position]="toolbarPosition.Top" [align]="'center'" [offset]="10">
      <button (click)="onDelete()" title="Delete node">🗑️</button>
      <button (click)="onDuplicate()" title="Duplicate node">📋</button>
      <button (click)="onEdit()" title="Edit node">✏️</button>
    </xy-node-toolbar>

    <xy-node-resizer [minWidth]="100" [minHeight]="50" color="#3b82f6"></xy-node-resizer>
    <div class="resizable-node-content">
      <h4>{{ data.label }}</h4>
      <p>{{ data.description || 'This node can be resized!' }}</p>
      <div class="handles">
        <div class="handle input-handle" title="Input"></div>
        <div class="handle output-handle" title="Output"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      overflow: visible;
      min-width: 100px;
      min-height: 50px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    }

    :host:hover {
      border-color: #3b82f6;
    }

    :host.selected {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }

    :host.running {
      border-color: #f59e0b !important;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
    }

    :host.success {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
    }

    :host.error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
    }

    .resizable-node-content {
      padding: 12px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      pointer-events: none; /* Let resize handles work */
    }

    h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
    }

    .handles {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: auto;
    }

    .handle {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      cursor: crosshair;
      transition: transform 0.2s ease;
    }

    .input-handle {
      left: -8px;
      background: #10b981;
    }

    .output-handle {
      right: -8px;
      background: #f59e0b;
    }

    .handle:hover {
      transform: scale(1.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableNodeComponent {
  @Input() data: any;

  // NodeToolbar position constants
  toolbarPosition = Position;

  onDelete() {
    console.log('Delete node:', this.data?.id);
    // In a real app, you would emit an event or call a service to delete the node
  }

  onDuplicate() {
    console.log('Duplicate node:', this.data?.id);
    // In a real app, you would emit an event or call a service to duplicate the node
  }

  onEdit() {
    console.log('Edit node:', this.data?.id);
    // In a real app, you would emit an event or show an edit dialog
  }
}
