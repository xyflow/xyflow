import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFlowComponent, FlowStateService } from '@xyflow/angular';
import { BackgroundComponent } from '@xyflow/angular';
import { ControlsComponent } from '@xyflow/angular';
import { MiniMapComponent } from '@xyflow/angular';
import { PanelComponent } from '@xyflow/angular';

export interface FlowConfig {
  flowProps?: any;
  backgroundProps?: any;
  controlsProps?: any;
  minimapProps?: any;
  panelProps?: any;
}

@Component({
  selector: 'app-generic-test',
  standalone: true,
  imports: [
    AngularFlowComponent,
    BackgroundComponent,
    ControlsComponent,
    MiniMapComponent,
    PanelComponent
  ],
  template: `
    <div class="angular-flow">
      @if (flowConfig) {
        <xyflow-angular
          [nodes]="nodes"
          [edges]="edges"
          [nodeTypes]="flowConfig.flowProps?.nodeTypes"
          [edgeTypes]="flowConfig.flowProps?.edgeTypes"
          [fitView]="flowConfig.flowProps?.fitView"
          [minZoom]="flowConfig.flowProps?.minZoom"
          [maxZoom]="flowConfig.flowProps?.maxZoom"
          [deleteKey]="flowConfig.flowProps?.deleteKey"
          [panOnScroll]="flowConfig.flowProps?.panOnScroll"
          [zoomOnScroll]="flowConfig.flowProps?.zoomOnScroll"
          [autoPanOnConnect]="flowConfig.flowProps?.autoPanOnConnect"
          [autoPanOnNodeDrag]="flowConfig.flowProps?.autoPanOnNodeDrag"
          [nodeDragThreshold]="flowConfig.flowProps?.nodeDragThreshold"
          [defaultViewport]="flowConfig.flowProps?.defaultViewport || flowConfig.flowProps?.initialViewport"
          (nodesChange)="onNodesChange($event)"
          (edgesChange)="onEdgesChange($event)"
          (connect)="onConnect($event)">

          @if (flowConfig.backgroundProps) {
            <xyflow-background 
              [variant]="flowConfig.backgroundProps.variant"
              [gap]="flowConfig.backgroundProps.gap"
              [size]="flowConfig.backgroundProps.size"
              [color]="flowConfig.backgroundProps.color" />
          }

          @if (flowConfig.controlsProps) {
            <xyflow-controls 
              [showZoom]="flowConfig.controlsProps.showZoom"
              [showFitView]="flowConfig.controlsProps.showFitView"
              [showInteractive]="flowConfig.controlsProps.showInteractive" />
          }

          @if (flowConfig.minimapProps) {
            <xyflow-minimap 
              [nodeColor]="flowConfig.minimapProps.nodeColor"
              [maskColor]="flowConfig.minimapProps.maskColor"
              [position]="flowConfig.minimapProps.position" />
          }

          @if (flowConfig.panelProps) {
            <xyflow-panel [position]="flowConfig.panelProps.position">
              {{ flowConfig.panelProps.content }}
            </xyflow-panel>
          }
        </xyflow-angular>
      }
    </div>
  `,
  styles: [`
    .angular-flow {
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class GenericTestComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private flowState = inject(FlowStateService);

  flowConfig: FlowConfig | null = null;
  nodes: any[] = [];
  edges: any[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const topic = params['topic'];
      const example = params['example'];
      this.loadTestConfig(topic, example);
    });
  }

  private async loadTestConfig(topic: string, example: string) {
    try {
      // Dynamic import of test configurations similar to React/Svelte
      const configModule = await import(`../generic-tests/${topic}/${example}.ts`);
      this.flowConfig = configModule.default;
      
      if (this.flowConfig?.flowProps?.nodes) {
        this.nodes = [...this.flowConfig.flowProps.nodes];
      }
      
      if (this.flowConfig?.flowProps?.edges) {
        this.edges = [...this.flowConfig.flowProps.edges];
      }
    } catch (error) {
      console.error(`Failed to load test config for ${topic}/${example}:`, error);
      this.flowConfig = null;
    }
  }

  onNodesChange(changes: any[]) {
    // Apply node changes using the flow state service
    this.flowState.applyNodeChanges(changes);
  }

  onEdgesChange(changes: any[]) {
    // Apply edge changes using the flow state service
    this.flowState.applyEdgeChanges(changes);
  }

  onConnect(connection: any) {
    // Add new connection as edge
    const newEdge = {
      id: `edge-${connection.source}-${connection.target}`,
      ...connection
    };
    this.edges = [...this.edges, newEdge];
  }
}