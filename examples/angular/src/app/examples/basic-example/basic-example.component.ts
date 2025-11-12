import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AngularFlowComponent,
  BackgroundComponent,
  ControlsComponent,
  MinimapComponent,
  PanelComponent,
  BezierEdgeComponent,
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
  selector: 'app-basic-example',
  standalone: true,
  imports: [
    CommonModule,
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
        [fitView]="true"
        (onNodesChange)="onNodesChange($event)"
        (onEdgesChange)="onEdgesChange($event)"
        (onConnect)="onConnect($event)"
        (onInit)="onInit($event)"
      >
        <angular-flow-background
          [variant]="'dots'"
          [gap]="20"
          [size]="1"
        />
        <angular-flow-controls
          [position]="'bottom-left'"
          (zoomIn)="flowInstance?.zoomIn()"
          (zoomOut)="flowInstance?.zoomOut()"
          (fitView)="flowInstance?.fitView()"
        />
        <angular-flow-minimap [position]="'bottom-right'" />
        <angular-flow-panel [position]="'top-left'">
          <div class="info-panel">
            <h2>Basic Example</h2>
            <p>This is a basic Angular Flow example demonstrating:</p>
            <ul>
              <li>✓ Nodes and edges</li>
              <li>✓ Pan and zoom</li>
              <li>✓ Background pattern</li>
              <li>✓ Controls</li>
              <li>✓ Minimap</li>
            </ul>
            <div class="stats">
              <div><strong>Nodes:</strong> {{ nodes().length }}</div>
              <div><strong>Edges:</strong> {{ edges().length }}</div>
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

    .info-panel {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 300px;
    }

    .info-panel h2 {
      margin: 0 0 12px 0;
      font-size: 20px;
      color: #1a1a1a;
    }

    .info-panel p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 14px;
    }

    .info-panel ul {
      margin: 0 0 16px 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
    }

    .info-panel li {
      margin-bottom: 4px;
    }

    .stats {
      display: flex;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
      color: #666;
    }

    .stats strong {
      color: #1a1a1a;
    }
  `],
})
export class BasicExampleComponent {
  width = window.innerWidth - 250; // Subtract sidebar width
  height = window.innerHeight;

  flowInstance: AngularFlowInstance | null = null;

  // Use signals for reactive state
  nodes = signal<AngularNode[]>([
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: 'Node 1' },
    },
    {
      id: '2',
      position: { x: 300, y: 100 },
      data: { label: 'Node 2' },
    },
    {
      id: '3',
      position: { x: 500, y: 100 },
      data: { label: 'Node 3' },
    },
    {
      id: '4',
      position: { x: 300, y: 250 },
      data: { label: 'Node 4' },
    },
    {
      id: '5',
      position: { x: 500, y: 250 },
      data: { label: 'Node 5' },
    },
  ]);

  edges = signal<AngularEdge[]>([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      animated: true,
    },
  ]);

  onNodesChange(changes: NodeChange[]): void {
    this.nodes.update(nodes => applyNodeChanges(changes, nodes));
  }

  onEdgesChange(changes: EdgeChange[]): void {
    this.edges.update(edges => applyEdgeChanges(changes, edges));
  }

  onConnect(connection: Connection): void {
    const newEdge: AngularEdge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };
    this.edges.update(edges => [...edges, newEdge]);
  }

  onInit(instance: AngularFlowInstance): void {
    this.flowInstance = instance;
    console.log('Flow initialized:', instance);
  }
}
