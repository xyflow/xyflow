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
  ChangeDetectorRef,
  Injector,
  Type,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  ConnectionLineType,
  PanOnScrollMode,
  SelectionMode,
  infiniteExtent,
  XYPanZoom,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Viewport,
  type FitViewOptionsBase,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
  type OnError,
  type IsValidConnection,
  type OnReconnect,
  type NodeOrigin,
  type CoordinateExtent,
  type ColorMode,
  type ProOptions,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import { NodeWrapperComponent } from '../node-wrapper/node-wrapper.component';
import { EdgeWrapperComponent } from '../edge-wrapper/edge-wrapper.component';
import { ConnectionLineComponent } from '../connection-line/connection-line.component';
import { SelectionBoxComponent } from '../selection-box/selection-box.component';
import type {
  Node,
  Edge,
  AngularNodeTypes,
  AngularEdgeTypes,
} from '../../types/general';

export type NodeType = Node;
export type EdgeType = Edge;

@Component({
  selector: 'angular-flow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    NodeWrapperComponent,
    EdgeWrapperComponent,
    ConnectionLineComponent,
    SelectionBoxComponent,
  ],
  providers: [FlowStateService],
  template: `
    <div
      #flowContainer
      class="angular-flow"
      [attr.data-testid]="testId || 'angular-flow'"
      [style.background-color]="backgroundColor"
      [style.width]="width || '100%'"
      [style.height]="height || '100%'"
      [style.cursor]="connection?.inProgress ? 'grabbing' : 'default'"
      (click)="onPaneClick($event)"
      (mousedown)="onPaneMouseDown($event)"
      (mousemove)="onPaneMouseMove($event)"
      (mouseup)="onPaneMouseUp($event)"
      (wheel)="onWheel($event)"
    >
      <!-- Background Layer -->
      <ng-content select="angular-flow-background" />

      <!-- Node Layer -->
      <div class="angular-flow__nodes" #nodesContainer>
        <ng-container *ngFor="let node of internalNodes; trackBy: trackByNodeId">
          <xy-node-wrapper
            [node]="$any(node)"
            [nodeTypes]="$any(nodeTypes)"
            [selected]="node.selected"
            (nodeChange)="onNodeChange($any($event))"
            (nodeClick)="onNodeClick($any($event), node)"
            (nodeMouseDown)="onNodeMouseDown($any($event), node)"
          />
        </ng-container>
      </div>

      <!-- Edge Layer -->
      <svg class="angular-flow__edges">
        <ng-container *ngFor="let edge of internalEdges; trackBy: trackByEdgeId">
          <xy-edge-wrapper
            [edge]="$any(edge)"
            [edgeTypes]="edgeTypes"
            [selected]="edge.selected"
            (edgeChange)="onEdgeChange($any($event))"
            (edgeClick)="onEdgeClick($any($event), edge)"
          />
        </ng-container>

        <!-- Connection Line -->
        <xy-connection-line />
      </svg>

      <!-- Selection Box -->
      <xy-selection-box />

      <!-- Overlays -->
      <div class="angular-flow__overlays">
        <ng-content />
      </div>
    </div>
  `,
  styleUrls: ['./angular-flow.component.scss'],
})
export class AngularFlowComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  @ViewChild('flowContainer', { static: true }) flowContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('nodesContainer', { static: true }) nodesContainer!: ElementRef<HTMLDivElement>;

  // Flow Configuration Inputs
  @Input() nodes: NodeType[] = [];
  @Input() edges: EdgeType[] = [];
  @Input() nodeTypes: AngularNodeTypes = {};
  @Input() edgeTypes: AngularEdgeTypes = {};

  // Viewport and Interaction
  @Input() defaultViewport: Viewport = { x: 0, y: 0, zoom: 1 };
  @Input() minZoom: number = 0.5;
  @Input() maxZoom: number = 2;
  @Input() snapToGrid: boolean = false;
  @Input() snapGrid: [number, number] = [15, 15];
  @Input() onlyRenderVisibleElements: boolean = false;
  @Input() nodesDraggable: boolean = true;
  @Input() nodesConnectable: boolean = true;
  @Input() nodesFocusable: boolean = true;
  @Input() edgesFocusable: boolean = true;
  @Input() elementsSelectable: boolean = true;
  @Input() selectNodesOnDrag: boolean = true;

  // Panning and Zooming
  @Input() panOnDrag: boolean = true;
  @Input() panOnScroll: boolean = false;
  @Input() panOnScrollSpeed: number = 0.5;
  @Input() panOnScrollMode: PanOnScrollMode = PanOnScrollMode.Free;
  @Input() zoomOnScroll: boolean = true;
  @Input() zoomOnPinch: boolean = true;
  @Input() zoomOnDoubleClick: boolean = true;
  @Input() preventScrolling: boolean = true;

  // Multi-selection
  @Input() multiSelectionKeyCode: string | string[] | null = 'Meta';
  @Input() selectionKeyCode: string | string[] | null = 'Shift';
  @Input() deleteKeyCode: string | string[] | null = 'Backspace';
  @Input() selectionMode: SelectionMode = SelectionMode.Full;

  // Connection
  @Input() connectionMode: ConnectionLineType = ConnectionLineType.Bezier;
  @Input() connectionLineType: ConnectionLineType = ConnectionLineType.Bezier;
  @Input() connectionLineStyle: any = {};
  @Input() connectionLineComponent: any = null;
  @Input() connectionRadius: number = 20;

  // Node specific
  @Input() nodeOrigin: NodeOrigin = [0, 0];
  @Input() nodeExtent: CoordinateExtent = infiniteExtent;
  @Input() translateExtent: CoordinateExtent = infiniteExtent;

  // Validation
  @Input() isValidConnection: IsValidConnection = () => true;

  // Styling
  @Input() fitViewOnInit: boolean = false;
  @Input() fitViewOptions: FitViewOptionsBase = {};
  @Input() backgroundColor: string = '';
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() colorMode: ColorMode = 'light';
  @Input() proOptions?: ProOptions;

  // Accessibility
  @Input() ariaLabel?: string;
  @Input() testId?: string;

  // Event Handlers
  @Input() onBeforeConnect?: OnReconnect;
  @Input() onConnect?: OnConnect;
  @Input() onConnectStart?: OnConnectStart;
  @Input() onConnectEnd?: OnConnectEnd;
  @Input() onError?: OnError;

  // Output Events
  @Output() nodesChange = new EventEmitter<NodeChange[]>();
  @Output() edgesChange = new EventEmitter<EdgeChange[]>();
  @Output() nodeClick = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeMouseEnter = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeMouseMove = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeMouseLeave = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeContextMenu = new EventEmitter<{ event: MouseEvent; node: NodeType }>();
  @Output() nodeSelectionChange = new EventEmitter<{ nodes: NodeType[] }>();
  @Output() edgeClick = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeDoubleClick = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeMouseEnter = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeMouseMove = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeMouseLeave = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeContextMenu = new EventEmitter<{ event: MouseEvent; edge: EdgeType }>();
  @Output() edgeSelectionChange = new EventEmitter<{ edges: EdgeType[] }>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() connectStart = new EventEmitter<{ event: MouseEvent; nodeId?: string; handleId?: string; handleType?: string }>();
  @Output() connectEnd = new EventEmitter<MouseEvent>();
  @Output() paneClick = new EventEmitter<MouseEvent>();
  @Output() paneContextMenu = new EventEmitter<MouseEvent>();
  @Output() paneScroll = new EventEmitter<WheelEvent>();
  @Output() selectionChange = new EventEmitter<{ nodes: NodeType[]; edges: EdgeType[] }>();
  @Output() move = new EventEmitter<{ event: MouseEvent | TouchEvent | KeyboardEvent; viewport: Viewport }>();
  @Output() moveStart = new EventEmitter<{ event: MouseEvent | TouchEvent; viewport: Viewport }>();
  @Output() moveEnd = new EventEmitter<{ event: MouseEvent | TouchEvent; viewport: Viewport }>();
  @Output() error = new EventEmitter<{ error: Error; errorInfo: any }>();

  // Internal State
  internalNodes: NodeType[] = [];
  internalEdges: EdgeType[] = [];
  viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  connection: any = { inProgress: false };
  selectionRect: any = null;

  // Dragging state
  private isDragging = false;
  private lastPanEvent: MouseEvent | null = null;
  private dragStartPosition: { x: number; y: number } | null = null;

  // Internal references
  private initialized = false;
  private panZoom?: any;

  constructor(
    private flowStateService: FlowStateService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.setupFlowState();
  }

  ngAfterViewInit(): void {
    this.initializeFlow();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupFlow();
  }

  private setupFlowState(): void {
    // Initialize flow state with initial data
    this.flowStateService.setNodes(this.nodes as any);
    this.flowStateService.setEdges(this.edges as any);
    this.flowStateService.setViewport(this.defaultViewport);

    // Subscribe to state changes
    this.flowStateService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: any) => {
        this.internalNodes = nodes;
        this.cdr.markForCheck();
      });

    this.flowStateService.edges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((edges: any) => {
        this.internalEdges = edges;
        this.cdr.markForCheck();
      });

    this.flowStateService.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewport: any) => {
        this.viewport = viewport;
        this.cdr.markForCheck();
      });

    this.flowStateService.connectionInProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((connection: any) => {
        this.connection = connection;
        this.cdr.markForCheck();
      });
  }

  private initializeFlow(): void {
    if (this.initialized) return;

    try {
      // Initialize panning and zooming
      this.setupPanZoom();

      // Setup node positioning
      this.updateNodePositions();

      // Apply fit view if enabled
      if (this.fitViewOnInit) {
        this.fitViewToNodes();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Angular Flow:', error);
      this.error.emit({ error: error as Error, errorInfo: { phase: 'initialization' } });
    }
  }

  private setupPanZoom(): void {
    if (!this.flowContainer?.nativeElement) return;

    try {
      this.panZoom = new (XYPanZoom as any)({
        domNode: this.flowContainer.nativeElement,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        paneClickDistance: 1,
        translateExtent: this.translateExtent,
      });

      // Update flow state when viewport changes
      this.panZoom.on('transform', (viewport: Viewport) => {
        this.flowStateService.setViewport(viewport);
      });
    } catch (error) {
      console.error('Failed to setup pan/zoom:', error);
    }
  }

  private cleanupFlow(): void {
    if (this.panZoom) {
      try {
        this.panZoom.destroy();
      } catch (error) {
        console.error('Error during flow cleanup:', error);
      }
    }
  }

  // Track by functions for *ngFor optimization
  trackByNodeId(index: number, node: NodeType): string {
    return node.id;
  }

  trackByEdgeId(index: number, edge: EdgeType): string {
    return edge.id;
  }

  // Node positioning and layout
  private updateNodePositions(): void {
    if (!this.nodesContainer?.nativeElement) return;

    this.internalNodes.forEach(node => {
      const x = (node as any).position?.x || 0;
      const y = (node as any).position?.y || 0;
    });
  }

  getNodeComponent(nodeType: string): Type<any> | null {
    return (this.nodeTypes[nodeType] as any) || null;
  }

  // Event Handlers
  onPaneClick(event: MouseEvent): void {
    // Only emit pane click if not clicking on nodes/edges
    if ((event.target as Element)?.closest('.angular-flow__node, .angular-flow__edge')) {
      return;
    }

    // Clear selection if not using multi-selection
    if (!this.isMultiSelectionKeyPressed(event)) {
      this.clearSelection();
    }

    this.paneClick.emit(event);
  }

  onPaneMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Only handle left mouse button

    this.isDragging = true;
    this.dragStartPosition = { x: event.clientX, y: event.clientY };
    this.lastPanEvent = event;

    // Start selection if shift is pressed
    if (this.isSelectionKeyPressed(event)) {
      this.startSelection(event);
    }

    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  onPaneMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.lastPanEvent) {
      const deltaX = event.clientX - this.lastPanEvent.clientX;
      const deltaY = event.clientY - this.lastPanEvent.clientY;

      // Update viewport
      if (this.panOnDrag) {
        this.updateViewport(deltaX, deltaY);
      }

      this.lastPanEvent = event;
    }

    // Update connection line if in progress
    if (this.connection?.inProgress) {
      this.updateConnectionPosition(event);
    }
  }

  onPaneMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.lastPanEvent = null;
    this.dragStartPosition = null;

    this.endSelection();

    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove = (event: MouseEvent): void => {
    this.onPaneMouseMove(event);
  };

  private handleDocumentMouseUp = (event: MouseEvent): void => {
    this.onPaneMouseUp(event);
  };

  onWheel(event: WheelEvent): void {
    if (this.preventScrolling) {
      event.preventDefault();
    }

    if (this.zoomOnScroll) {
      this.handleZoom(event);
    } else if (this.panOnScroll) {
      this.handlePanOnScroll(event);
    }

    this.paneScroll.emit(event);
  }

  private handleZoom(event: WheelEvent): void {
    if (!this.panZoom) return;

    const delta = event.deltaY;
    const zoomFactor = delta > 0 ? 0.9 : 1.1;

    this.panZoom.scaleBy(zoomFactor, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  private handlePanOnScroll(event: WheelEvent): void {
    const deltaX = event.deltaX * this.panOnScrollSpeed;
    const deltaY = event.deltaY * this.panOnScrollSpeed;

    this.updateViewport(deltaX, deltaY);
  }

  private updateViewport(deltaX: number, deltaY: number): void {
    if (!this.panZoom) return;

    this.panZoom.translateBy(deltaX, deltaY);
  }

  // Node Event Handlers
  onNodeClick(event: MouseEvent, node: NodeType): void {
    event.stopPropagation();

    // Handle selection
    if (this.elementsSelectable) {
      if (this.isMultiSelectionKeyPressed(event)) {
        this.toggleNodeSelection(node);
      } else {
        this.selectSingleNode(node);
      }
    }

    this.nodeClick.emit({ event, node });
  }

  onNodeChange(change: NodeChange): void {
    this.nodesChange.emit([change]);
  }

  onNodeMouseDown(event: MouseEvent, node: NodeType): void {
    // Handle node-specific mouse down if needed
  }

  // Edge Event Handlers
  onEdgeClick(event: MouseEvent, edge: EdgeType): void {
    event.stopPropagation();

    // Handle selection
    if (this.elementsSelectable) {
      if (this.isMultiSelectionKeyPressed(event)) {
        this.toggleEdgeSelection(edge);
      } else {
        this.selectSingleEdge(edge);
      }
    }

    this.edgeClick.emit({ event, edge });
  }

  onEdgeChange(change: EdgeChange): void {
    this.edgesChange.emit([change]);
  }

  // Selection Logic
  private clearSelection(): void {
    const nodeChanges: NodeChange[] = this.internalNodes
      .filter(node => node.selected)
      .map(node => ({ id: node.id, type: 'select', selected: false }));

    const edgeChanges: EdgeChange[] = this.internalEdges
      .filter(edge => edge.selected)
      .map(edge => ({ id: edge.id, type: 'select', selected: false }));

    if (nodeChanges.length > 0) {
      this.nodesChange.emit(nodeChanges);
    }
    if (edgeChanges.length > 0) {
      this.edgesChange.emit(edgeChanges);
    }
  }

  private selectSingleNode(node: NodeType): void {
    const changes: NodeChange[] = [];

    // Deselect all other nodes
    this.internalNodes.forEach(n => {
      if (n.id !== node.id && n.selected) {
        changes.push({ id: n.id, type: 'select', selected: false });
      }
    });

    // Select the clicked node
    if (!node.selected) {
      changes.push({ id: node.id, type: 'select', selected: true });
    }

    if (changes.length > 0) {
      this.nodesChange.emit(changes);
    }

    // Clear edge selection
    const edgeChanges: EdgeChange[] = this.internalEdges
      .filter(edge => edge.selected)
      .map(edge => ({ id: edge.id, type: 'select', selected: false }));

    if (edgeChanges.length > 0) {
      this.edgesChange.emit(edgeChanges);
    }
  }

  private toggleNodeSelection(node: NodeType): void {
    const change: NodeChange = {
      id: node.id,
      type: 'select',
      selected: !node.selected,
    };

    this.nodesChange.emit([change]);
  }

  private selectSingleEdge(edge: EdgeType): void {
    const changes: EdgeChange[] = [];

    // Deselect all other edges
    this.internalEdges.forEach(e => {
      if (e.id !== edge.id && e.selected) {
        changes.push({ id: e.id, type: 'select', selected: false });
      }
    });

    // Select the clicked edge
    if (!edge.selected) {
      changes.push({ id: edge.id, type: 'select', selected: true });
    }

    if (changes.length > 0) {
      this.edgesChange.emit(changes);
    }

    // Clear node selection
    const nodeChanges: NodeChange[] = this.internalNodes
      .filter(node => node.selected)
      .map(node => ({ id: node.id, type: 'select', selected: false }));

    if (nodeChanges.length > 0) {
      this.nodesChange.emit(nodeChanges);
    }
  }

  private toggleEdgeSelection(edge: EdgeType): void {
    const change: EdgeChange = {
      id: edge.id,
      type: 'select',
      selected: !edge.selected,
    };

    this.edgesChange.emit([change]);
  }

  // Selection Box Logic
  private startSelection(event: MouseEvent): void {
    if (!this.flowContainer?.nativeElement) return;

    const rect = this.flowContainer.nativeElement.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    this.flowStateService.startSelectionArea({ x: startX, y: startY });
  }

  private endSelection(): void {
    this.flowStateService.endSelectionArea();
  }

  // Connection Logic
  private updateConnectionPosition(event: MouseEvent): void {
    if (!this.flowContainer?.nativeElement) return;

    const rect = this.flowContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.flowStateService.updateConnectionPosition({ x, y });
  }

  // Layout and Fitting
  private fitViewToNodes(): void {
    if (!this.panZoom || this.internalNodes.length === 0) return;

    try {
      // Calculate bounding box of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      this.internalNodes.forEach(node => {
        const nodeX = (node as any).position?.x || 0;
        const nodeY = (node as any).position?.y || 0;
        const nodeWidth = (node as any).width || 150;
        const nodeHeight = (node as any).height || 40;

        minX = Math.min(minX, nodeX);
        minY = Math.min(minY, nodeY);
        maxX = Math.max(maxX, nodeX + nodeWidth);
        maxY = Math.max(maxY, nodeY + nodeHeight);
      });

      if (minX !== Infinity) {
        const padding = 50;
        const bounds = {
          x: minX - padding,
          y: minY - padding,
          width: maxX - minX + 2 * padding,
          height: maxY - minY + 2 * padding,
        };

        this.panZoom.fitBounds(bounds, this.fitViewOptions);
      }
    } catch (error) {
      console.error('Error fitting view:', error);
    }
  }

  // Key detection helpers
  private isMultiSelectionKeyPressed(event: MouseEvent): boolean {
    if (!this.multiSelectionKeyCode) return false;
    if (Array.isArray(this.multiSelectionKeyCode)) {
      return this.multiSelectionKeyCode.some(key => this.isKeyPressed(event, key));
    }
    return this.isKeyPressed(event, this.multiSelectionKeyCode);
  }

  private isSelectionKeyPressed(event: MouseEvent): boolean {
    if (!this.selectionKeyCode) return false;
    if (Array.isArray(this.selectionKeyCode)) {
      return this.selectionKeyCode.some(key => this.isKeyPressed(event, key));
    }
    return this.isKeyPressed(event, this.selectionKeyCode);
  }

  private isKeyPressed(event: MouseEvent, key: string): boolean {
    switch (key.toLowerCase()) {
      case 'meta':
        return event.metaKey;
      case 'ctrl':
        return event.ctrlKey;
      case 'shift':
        return event.shiftKey;
      case 'alt':
        return event.altKey;
      default:
        return false;
    }
  }

  // Public API Methods
  fitView(options?: FitViewOptionsBase): void {
    this.fitViewOptions = { ...this.fitViewOptions, ...options };
    this.fitViewToNodes();
  }

  zoomIn(factor: number = 1.2): void {
    if (this.panZoom) {
      this.panZoom.scaleBy(factor);
    }
  }

  zoomOut(factor: number = 0.8): void {
    if (this.panZoom) {
      this.panZoom.scaleBy(factor);
    }
  }

  zoomTo(zoomLevel: number): void {
    if (this.panZoom) {
      this.panZoom.scaleTo(zoomLevel);
    }
  }

  setCenter(x: number, y: number, zoom?: number): void {
    if (this.panZoom) {
      this.panZoom.setViewport({ x, y, zoom: zoom || this.viewport.zoom });
    }
  }

  getViewport(): Viewport {
    return { ...this.viewport };
  }

  setViewport(viewport: Viewport): void {
    if (this.panZoom) {
      this.panZoom.setViewport(viewport);
    }
  }

  screenToFlowPosition(position: { x: number; y: number }): { x: number; y: number } {
    if (!this.panZoom) return position;
    return this.panZoom.screenToFlowPosition(position);
  }

  flowToScreenPosition(position: { x: number; y: number }): { x: number; y: number } {
    if (!this.panZoom) return position;
    return this.panZoom.flowToScreenPosition(position);
  }
}
