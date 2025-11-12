import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  effect,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  XYPanZoom,
  Viewport,
  NodeChange,
  EdgeChange,
  Connection,
  PanZoomInstance,
  FitViewOptions,
  getViewportForBounds,
  getNodesBounds,
  isNode,
} from '@xyflow/system';
import { FlowStoreService } from '../../services/flow-store.service';
import type {
  AngularNode,
  AngularEdge,
  AngularFlowProps,
  AngularFlowInstance,
  NodeTypes,
  EdgeTypes,
} from '../../types';

@Component({
  selector: 'angular-flow',
  standalone: true,
  imports: [CommonModule],
  providers: [FlowStoreService],
  template: `
    <div
      #flowContainer
      class="angular-flow"
      [class.angular-flow__container]="true"
      [style.width.px]="width || null"
      [style.height.px]="height || null"
      (wheel)="onWheel($event)"
      (mousedown)="onMouseDown($event)"
      (contextmenu)="onContextMenu($event)"
    >
      <svg
        #svgElement
        class="angular-flow__renderer"
        [attr.width]="width"
        [attr.height]="height"
        [style.width.px]="width"
        [style.height.px]="height"
      >
        <defs>
          <marker
            id="angular-flow__arrowclosed"
            markerWidth="12"
            markerHeight="12"
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            markerUnits="strokeWidth"
            orient="auto"
          >
            <polyline
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              fill="currentColor"
              points="-5,-4 0,0 -5,4 -5,-4"
            />
          </marker>
          <marker
            id="angular-flow__arrow"
            markerWidth="12"
            markerHeight="12"
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            markerUnits="strokeWidth"
            orient="auto"
          >
            <polyline
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              fill="none"
              points="-5,-4 0,0 -5,4"
            />
          </marker>
        </defs>

        <g
          #viewportElement
          class="angular-flow__viewport"
          [attr.transform]="getTransform()"
        >
          <!-- Edges will be rendered here -->
          <g class="angular-flow__edges">
            <ng-content select="[edges]"></ng-content>
          </g>

          <!-- Nodes will be rendered here -->
          <g class="angular-flow__nodes">
            <ng-content select="[nodes]"></ng-content>
          </g>
        </g>
      </svg>

      <!-- Overlay content (controls, minimap, etc.) -->
      <div class="angular-flow__controls">
        <ng-content select="[controls]"></ng-content>
      </div>

      <div class="angular-flow__attribution" [class]="'angular-flow__attribution-' + (attributionPosition || 'bottom-right')">
        <a
          *ngIf="!proOptions?.hideAttribution"
          href="https://github.com/xyflow/xyflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Angular Flow
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .angular-flow {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: #fafafa;
    }

    .angular-flow__container {
      width: 100%;
      height: 100%;
    }

    .angular-flow__renderer {
      width: 100%;
      height: 100%;
    }

    .angular-flow__viewport {
      transform-origin: 0 0;
    }

    .angular-flow__edges,
    .angular-flow__nodes {
      pointer-events: all;
    }

    .angular-flow__controls {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }

    .angular-flow__controls > * {
      pointer-events: all;
    }

    .angular-flow__attribution {
      position: absolute;
      z-index: 1000;
      font-size: 10px;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
    }

    .angular-flow__attribution-bottom-right {
      bottom: 8px;
      right: 8px;
    }

    .angular-flow__attribution-bottom-left {
      bottom: 8px;
      left: 8px;
    }

    .angular-flow__attribution-top-right {
      top: 8px;
      right: 8px;
    }

    .angular-flow__attribution-top-left {
      top: 8px;
      left: 8px;
    }

    .angular-flow__attribution a {
      color: #666;
      text-decoration: none;
    }

    .angular-flow__attribution a:hover {
      color: #000;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularFlowComponent<
  NodeType extends AngularNode = AngularNode,
  EdgeType extends AngularEdge = AngularEdge
> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flowContainer', { static: true }) flowContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('viewportElement', { static: true }) viewportElement!: ElementRef<SVGGElement>;

  // Inputs
  @Input() nodes: NodeType[] = [];
  @Input() edges: EdgeType[] = [];
  @Input() nodeTypes?: NodeTypes;
  @Input() edgeTypes?: EdgeTypes;
  @Input() width: number = 800;
  @Input() height: number = 600;
  @Input() defaultViewport?: Viewport;
  @Input() minZoom: number = 0.5;
  @Input() maxZoom: number = 2;
  @Input() fitView: boolean = false;
  @Input() fitViewOptions?: FitViewOptions;
  @Input() attributionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  @Input() proOptions?: { hideAttribution?: boolean };
  @Input() snapToGrid: boolean = false;
  @Input() snapGrid: [number, number] = [15, 15];
  @Input() zoomOnScroll: boolean = true;
  @Input() zoomOnPinch: boolean = true;
  @Input() panOnScroll: boolean = false;
  @Input() panOnDrag: boolean | number[] = true;
  @Input() zoomOnDoubleClick: boolean = true;
  @Input() preventScrolling: boolean = true;
  @Input() selectionOnDrag: boolean = false;

  // Outputs
  @Output() nodesChange = new EventEmitter<NodeType[]>();
  @Output() edgesChange = new EventEmitter<EdgeType[]>();
  @Output() onNodesChange = new EventEmitter<NodeChange[]>();
  @Output() onEdgesChange = new EventEmitter<EdgeChange[]>();
  @Output() onConnect = new EventEmitter<Connection>();
  @Output() onNodeClick = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() onEdgeClick = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() onPaneClick = new EventEmitter<MouseEvent>();
  @Output() onPaneContextMenu = new EventEmitter<MouseEvent>();
  @Output() onInit = new EventEmitter<AngularFlowInstance<NodeType, EdgeType>>();
  @Output() onMove = new EventEmitter<{ event: any; viewport: Viewport }>();
  @Output() onMoveStart = new EventEmitter<{ event: any; viewport: Viewport }>();
  @Output() onMoveEnd = new EventEmitter<{ event: any; viewport: Viewport }>();

  private panZoom: PanZoomInstance | null = null;
  private resizeObserver?: ResizeObserver;
  private isInitialized = false;

  constructor(
    public store: FlowStoreService<NodeType, EdgeType>,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    // React to nodes changes
    effect(() => {
      const storeNodes = this.store.nodes();
      this.nodesChange.emit(storeNodes);
      this.cdr.markForCheck();
    });

    // React to edges changes
    effect(() => {
      const storeEdges = this.store.edges();
      this.edgesChange.emit(storeEdges);
      this.cdr.markForCheck();
    });

    // React to viewport changes
    effect(() => {
      const viewport = this.store.viewport();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.store.initialize({
      nodes: this.nodes,
      edges: this.edges,
      defaultViewport: this.defaultViewport,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
    });
  }

  ngAfterViewInit(): void {
    this.initializeFlow();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.panZoom) {
      this.panZoom.destroy();
    }
  }

  private initializeFlow(): void {
    const container = this.flowContainer.nativeElement;
    const viewport = this.viewportElement.nativeElement;

    // Set up dimensions
    const rect = container.getBoundingClientRect();
    this.store.setDimensions(rect.width, rect.height);
    this.store.setDomNode(container);

    // Initialize pan/zoom
    this.panZoom = XYPanZoom({
      domNode: viewport,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      paneClickDistance: 0,
      translateExtent: [
        [0, 0],
        [rect.width, rect.height],
      ],
      onPanZoomStart: (event: any, vp: Viewport) => {
        this.onMoveStart.emit({ event, viewport: vp });
      },
      onPanZoom: (event: any, vp: Viewport) => {
        this.store.setViewport(vp);
        this.onMove.emit({ event, viewport: vp });
        this.cdr.markForCheck();
      },
      onPanZoomEnd: (event: any, vp: Viewport) => {
        this.onMoveEnd.emit({ event, viewport: vp });
      },
    });

    this.store.setPanZoom(this.panZoom);

    // Set up resize observer
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.store.setDimensions(width, height);
        this.cdr.markForCheck();
      }
    });
    this.resizeObserver.observe(container);

    // Fit view if requested
    if (this.fitView) {
      setTimeout(() => {
        this.fitViewToNodes();
      }, 0);
    }

    this.isInitialized = true;

    // Emit instance
    const instance = this.getInstance();
    this.onInit.emit(instance);
  }

  getTransform(): string {
    const viewport = this.store.viewport();
    return `translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`;
  }

  onWheel(event: WheelEvent): void {
    if (this.preventScrolling) {
      event.preventDefault();
    }
  }

  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target === this.flowContainer.nativeElement || target === this.svgElement.nativeElement) {
      // Clicked on pane
      this.store.clearSelection();
    }
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.onPaneContextMenu.emit(event);
  }

  fitViewToNodes(): void {
    const nodes = this.store.nodes();
    if (nodes.length === 0) return;

    const bounds = getNodesBounds(nodes as any);
    const width = this.store.width();
    const height = this.store.height();

    const viewport = getViewportForBounds(
      bounds,
      width,
      height,
      this.minZoom,
      this.maxZoom,
      this.fitViewOptions?.padding || 0.1
    );

    this.store.setViewport(viewport);
    this.cdr.markForCheck();
  }

  /**
   * Get the AngularFlow instance with all methods
   */
  getInstance(): AngularFlowInstance<NodeType, EdgeType> {
    return {
      // Viewport methods
      zoomIn: async (options) => {
        const currentZoom = this.store.viewport().zoom;
        const newZoom = Math.min(currentZoom * 1.2, this.maxZoom);
        return this.zoomTo(newZoom, options);
      },
      zoomOut: async (options) => {
        const currentZoom = this.store.viewport().zoom;
        const newZoom = Math.max(currentZoom / 1.2, this.minZoom);
        return this.zoomTo(newZoom, options);
      },
      zoomTo: async (zoom, options) => {
        const viewport = this.store.viewport();
        this.store.setViewport({ ...viewport, zoom });
        return true;
      },
      setViewport: async (viewport, options) => {
        this.store.setViewport(viewport);
        return true;
      },
      getViewport: () => this.store.getViewport(),
      fitView: async (options) => {
        this.fitViewToNodes();
        return true;
      },
      fitBounds: async (bounds, options) => {
        const width = this.store.width();
        const height = this.store.height();
        const viewport = getViewportForBounds(
          bounds,
          width,
          height,
          this.minZoom,
          this.maxZoom,
          options?.padding || 0.1
        );
        this.store.setViewport(viewport);
        return true;
      },
      setCenter: async (x, y, options) => {
        const width = this.store.width();
        const height = this.store.height();
        const zoom = options?.zoom || this.store.viewport().zoom;
        const viewport = {
          x: width / 2 - x * zoom,
          y: height / 2 - y * zoom,
          zoom,
        };
        this.store.setViewport(viewport);
        return true;
      },

      // Node methods
      getNode: (id) => this.store.getNode(id),
      getNodes: () => this.store.nodes(),
      setNodes: (nodes) => this.store.setNodes(nodes),
      addNodes: (nodes) => this.store.addNodes(nodes),
      updateNode: (id, updates) => this.store.updateNode(id, updates),
      deleteNode: (id) => this.store.deleteNode(id),

      // Edge methods
      getEdge: (id) => this.store.getEdge(id),
      getEdges: () => this.store.edges(),
      setEdges: (edges) => this.store.setEdges(edges),
      addEdges: (edges) => this.store.addEdges(edges),
      updateEdge: (id, updates) => this.store.updateEdge(id, updates),
      deleteEdge: (id) => this.store.deleteEdge(id),

      // Utility methods
      screenToFlowPosition: (position) => {
        const viewport = this.store.viewport();
        return {
          x: (position.x - viewport.x) / viewport.zoom,
          y: (position.y - viewport.y) / viewport.zoom,
        };
      },
      flowToScreenPosition: (position) => {
        const viewport = this.store.viewport();
        return {
          x: position.x * viewport.zoom + viewport.x,
          y: position.y * viewport.zoom + viewport.y,
        };
      },
      getIntersectingNodes: (node, partially = true) => {
        // TODO: Implement
        return [];
      },
      isNodeIntersecting: (node, area, partially = true) => {
        // TODO: Implement
        return false;
      },
    };
  }
}
