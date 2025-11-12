import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AngularFlowComponent,
  BackgroundComponent,
  ControlsComponent,
  PanelComponent,
  AngularNode,
  AngularEdge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/angular';

@Component({
  selector: 'app-edge-types',
  standalone: true,
  imports: [
    CommonModule,
    AngularFlowComponent,
    BackgroundComponent,
    ControlsComponent,
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
      >
        <angular-flow-background [variant]="'cross'" />
        <angular-flow-controls [position]="'bottom-left'" />
        <angular-flow-panel [position]="'top-left'">
          <div class="info-panel">
            <h2>Edge Types</h2>
            <p>Different edge rendering styles:</p>
            <ul>
              <li><span class="edge-type bezier">━━</span> Bezier (default)</li>
              <li><span class="edge-type straight">━━</span> Straight</li>
              <li><span class="edge-type step">┗━</span> Step</li>
              <li><span class="edge-type smooth">╰━</span> Smooth Step</li>
            </ul>
            <p class="note">Try connecting nodes to create new edges!</p>
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
    }

    .info-panel p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 14px;
    }

    .info-panel ul {
      margin: 0 0 12px 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
      list-style: none;
    }

    .info-panel li {
      margin-bottom: 8px;
    }

    .edge-type {
      display: inline-block;
      width: 30px;
      text-align: center;
      margin-right: 8px;
      font-weight: bold;
    }

    .edge-type.bezier {
      color: #3b82f6;
    }

    .edge-type.straight {
      color: #10b981;
    }

    .edge-type.step {
      color: #f59e0b;
    }

    .edge-type.smooth {
      color: #8b5cf6;
    }

    .note {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      font-style: italic;
      color: #888;
    }
  `],
})
export class EdgeTypesComponent {
  width = window.innerWidth - 250;
  height = window.innerHeight;

  nodes = signal<AngularNode[]>([
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: 'Bezier Edge' },
    },
    {
      id: '2',
      position: { x: 100, y: 250 },
      data: { label: 'Straight Edge' },
    },
    {
      id: '3',
      position: { x: 100, y: 400 },
      data: { label: 'Step Edge' },
    },
    {
      id: '4',
      position: { x: 100, y: 550 },
      data: { label: 'Smooth Step' },
    },
    {
      id: '5',
      position: { x: 400, y: 100 },
      data: { label: 'Target 1' },
    },
    {
      id: '6',
      position: { x: 400, y: 250 },
      data: { label: 'Target 2' },
    },
    {
      id: '7',
      position: { x: 400, y: 400 },
      data: { label: 'Target 3' },
    },
    {
      id: '8',
      position: { x: 400, y: 550 },
      data: { label: 'Target 4' },
    },
  ]);

  edges = signal<AngularEdge[]>([
    {
      id: 'e1-5',
      source: '1',
      target: '5',
      type: 'default',
      markerEnd: 'url(#angular-flow__arrowclosed)',
    },
    {
      id: 'e2-6',
      source: '2',
      target: '6',
      type: 'straight',
      markerEnd: 'url(#angular-flow__arrowclosed)',
    },
    {
      id: 'e3-7',
      source: '3',
      target: '7',
      type: 'step',
      markerEnd: 'url(#angular-flow__arrowclosed)',
    },
    {
      id: 'e4-8',
      source: '4',
      target: '8',
      type: 'smoothstep',
      markerEnd: 'url(#angular-flow__arrowclosed)',
    },
  ]);

  onNodesChange(changes: NodeChange[]): void {
    this.nodes.update(nodes => applyNodeChanges(changes, nodes));
  }

  onEdgesChange(changes: EdgeChange[]): void {
    this.edges.update(edges => applyEdgeChanges(changes, edges));
  }
}
