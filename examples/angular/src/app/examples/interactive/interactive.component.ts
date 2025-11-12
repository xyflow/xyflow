import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AngularFlowComponent,
  BackgroundComponent,
  ControlsComponent,
  MinimapComponent,
  PanelComponent,
  AngularNode,
  AngularEdge,
  AngularFlowInstance,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/angular';

@Component({
  selector: 'app-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AngularFlowComponent,
    BackgroundComponent,
    ControlsComponent,
    MinimapComponent,
    PanelComponent,
  ],
  template: `
    <div class="example-container">
      <angular-flow
        [nodes]="nodes()"
        [edges]="edges()"
        [width]="width"
        [height]="height"
        [fitView]="false"
        [minZoom]="0.1"
        [maxZoom]="4"
        (onNodesChange)="onNodesChange($event)"
        (onEdgesChange)="onEdgesChange($event)"
        (onConnect)="onConnect($event)"
        (onInit)="onInit($event)"
        (onNodeClick)="onNodeClick($event)"
        (onEdgeClick)="onEdgeClick($event)"
      >
        <angular-flow-background
          [variant]="backgroundVariant()"
          [gap]="20"
        />
        <angular-flow-controls
          [position]="'bottom-left'"
          (zoomIn)="flowInstance?.zoomIn()"
          (zoomOut)="flowInstance?.zoomOut()"
          (fitView)="flowInstance?.fitView()"
        />
        <angular-flow-minimap [position]="'bottom-right'" />
        <angular-flow-panel [position]="'top-left'">
          <div class="control-panel">
            <h2>Interactive Example</h2>
            <div class="controls">
              <button (click)="addNode()" class="btn btn-primary">
                + Add Node
              </button>
              <button (click)="deleteSelected()" class="btn btn-danger">
                🗑 Delete Selected
              </button>
              <button (click)="clearAll()" class="btn btn-secondary">
                Clear All
              </button>
            </div>
            <div class="settings">
              <label>
                Background:
                <select [(ngModel)]="backgroundVariant" (change)="onBackgroundChange($event)">
                  <option value="dots">Dots</option>
                  <option value="lines">Lines</option>
                  <option value="cross">Cross</option>
                </select>
              </label>
            </div>
            <div class="stats">
              <div><strong>Nodes:</strong> {{ nodes().length }}</div>
              <div><strong>Edges:</strong> {{ edges().length }}</div>
              <div><strong>Selected:</strong> {{ selectedCount }}</div>
            </div>
          </div>
        </angular-flow-panel>
      </angular-flow>
    </div>
  `,
  styles: [`
    .example-container {
      width: 100%;
      height: 100vh;
      position: relative;
    }

    .control-panel {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 300px;
    }

    .control-panel h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .settings {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .settings label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .settings select {
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
    }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .stats strong {
      color: #1a1a1a;
    }
  `],
})
export class InteractiveComponent {
  width = window.innerWidth - 250;
  height = window.innerHeight;

  flowInstance: AngularFlowInstance | null = null;
  backgroundVariant = signal<'dots' | 'lines' | 'cross'>('dots');
  selectedCount = 0;
  nodeCounter = 5;

  nodes = signal<AngularNode[]>([
    {
      id: '1',
      position: { x: 250, y: 100 },
      data: { label: 'Node 1' },
    },
    {
      id: '2',
      position: { x: 100, y: 250 },
      data: { label: 'Node 2' },
    },
    {
      id: '3',
      position: { x: 400, y: 250 },
      data: { label: 'Node 3' },
    },
    {
      id: '4',
      position: { x: 250, y: 400 },
      data: { label: 'Node 4' },
    },
  ]);

  edges = signal<AngularEdge[]>([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
    },
  ]);

  onNodesChange(changes: NodeChange[]): void {
    this.nodes.update(nodes => applyNodeChanges(changes, nodes));
    this.updateSelectedCount();
  }

  onEdgesChange(changes: EdgeChange[]): void {
    this.edges.update(edges => applyEdgeChanges(changes, edges));
  }

  onConnect(connection: Connection): void {
    const newEdge: AngularEdge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      animated: true,
    };
    this.edges.update(edges => [...edges, newEdge]);
  }

  onInit(instance: AngularFlowInstance): void {
    this.flowInstance = instance;
  }

  onNodeClick(event: { event: MouseEvent; node: AngularNode }): void {
    console.log('Node clicked:', event.node);
  }

  onEdgeClick(event: { event: MouseEvent; edge: AngularEdge }): void {
    console.log('Edge clicked:', event.edge);
  }

  addNode(): void {
    this.nodeCounter++;
    const newNode: AngularNode = {
      id: `${this.nodeCounter}`,
      position: {
        x: Math.random() * 500 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: `Node ${this.nodeCounter}` },
    };
    this.nodes.update(nodes => [...nodes, newNode]);
  }

  deleteSelected(): void {
    this.nodes.update(nodes => nodes.filter(node => !node.selected));
    this.edges.update(edges => edges.filter(edge => !edge.selected));
  }

  clearAll(): void {
    this.nodes.set([]);
    this.edges.set([]);
  }

  onBackgroundChange(event: any): void {
    this.backgroundVariant.set(event.target.value);
  }

  updateSelectedCount(): void {
    this.selectedCount = this.nodes().filter(n => n.selected).length +
                        this.edges().filter(e => e.selected).length;
  }
}
