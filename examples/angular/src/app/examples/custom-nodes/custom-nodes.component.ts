import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AngularFlowComponent,
  BackgroundComponent,
  ControlsComponent,
  PanelComponent,
  HandleDirective,
  AngularNode,
  AngularEdge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/angular';

@Component({
  selector: 'app-custom-node',
  standalone: true,
  imports: [CommonModule, HandleDirective],
  template: `
    <div class="custom-node" [class.selected]="selected">
      <div class="custom-node-header">
        <strong>{{ data.label }}</strong>
      </div>
      <div class="custom-node-body">
        <p>{{ data.description }}</p>
      </div>
      <div class="custom-node-handles">
        <div
          angularFlowHandle="target"
          [nodeId]="id"
          [position]="'left'"
          class="custom-handle custom-handle-left"
        ></div>
        <div
          angularFlowHandle="source"
          [nodeId]="id"
          [position]="'right'"
          class="custom-handle custom-handle-right"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .custom-node {
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 16px;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .custom-node.selected {
      border-color: #1d4ed8;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    }

    .custom-node-header {
      margin-bottom: 8px;
      font-size: 16px;
      color: #1a1a1a;
    }

    .custom-node-body {
      font-size: 14px;
      color: #666;
    }

    .custom-node-handles {
      position: relative;
    }

    .custom-handle {
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .custom-handle-left {
      left: -22px;
    }

    .custom-handle-right {
      right: -22px;
    }
  `],
})
export class CustomNodeComponent {
  id!: string;
  data: any = {};
  selected: boolean = false;
}

@Component({
  selector: 'app-custom-nodes',
  standalone: true,
  imports: [
    CommonModule,
    AngularFlowComponent,
    BackgroundComponent,
    ControlsComponent,
    PanelComponent,
    CustomNodeComponent,
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
      >
        <angular-flow-background [variant]="'lines'" />
        <angular-flow-controls [position]="'bottom-left'" />
        <angular-flow-panel [position]="'top-left'">
          <div class="info-panel">
            <h2>Custom Nodes</h2>
            <p>This example demonstrates custom node components with:</p>
            <ul>
              <li>✓ Custom styling</li>
              <li>✓ Custom handles</li>
              <li>✓ Rich content</li>
              <li>✓ Selection states</li>
            </ul>
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
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
    }
  `],
})
export class CustomNodesComponent {
  width = window.innerWidth - 250;
  height = window.innerHeight;

  nodes = signal<AngularNode[]>([
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: {
        label: 'Input Node',
        description: 'This is where data enters the flow',
      },
      component: CustomNodeComponent,
    },
    {
      id: '2',
      position: { x: 400, y: 100 },
      data: {
        label: 'Processing Node',
        description: 'Data is transformed here',
      },
      component: CustomNodeComponent,
    },
    {
      id: '3',
      position: { x: 700, y: 100 },
      data: {
        label: 'Output Node',
        description: 'Final results are exported',
      },
      component: CustomNodeComponent,
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
      animated: true,
    };
    this.edges.update(edges => [...edges, newEdge]);
  }
}
