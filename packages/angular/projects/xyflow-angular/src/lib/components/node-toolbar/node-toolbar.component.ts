import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  EmbeddedViewRef,
  signal,
  computed,
  effect,
  inject,
  AfterViewInit,
} from '@angular/core';
import { Position, getNodeToolbarTransform, getInternalNodesBounds, Align } from '@xyflow/system';
import { FlowStateService } from '../../services/flow-state.service';
import { NodeIdContext } from '../../contexts/node-id.context';
import { PortalService } from './portal.service';

/**
 * The NodeToolbar component renders a toolbar or tooltip positioned relative to a node.
 * It uses portal rendering to ensure proper positioning outside the node boundaries.
 */
@Component({
  selector: 'xy-node-toolbar',
  standalone: true,
  template: `
    <ng-template #toolbarTemplate>
      <div 
        class="xyflow__node-toolbar"
        [attr.data-id]="nodeIds()"
        [style.position]="'absolute'"
        [style.transform]="transform()"
        [style.z-index]="zIndex()"
        [style.pointer-events]="'all'"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styles: [`
    .xyflow__node-toolbar {
      position: absolute;
      user-select: none;
      pointer-events: all;
      transform-origin: left top;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .xyflow__node-toolbar button {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      background: #f8fafc;
      color: #374151;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .xyflow__node-toolbar button:hover {
      background: #e2e8f0;
      color: #1f2937;
    }
  `]
})
export class NodeToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() nodeId?: string | string[];
  @Input() isVisible?: boolean;
  @Input() position: Position = Position.Top;
  @Input() offset: number = 10;
  @Input() align: Align = 'center';

  @ViewChild('toolbarTemplate', { static: true }) toolbarTemplate!: TemplateRef<any>;

  private flowState = inject(FlowStateService);
  private nodeIdContext = inject(NodeIdContext, { optional: true });
  private portalService = inject(PortalService);
  private viewContainerRef = inject(ViewContainerRef);

  private embeddedViewRef: EmbeddedViewRef<any> | null = null;

  // Reactive state
  private nodes = signal(new Map());
  private viewport = signal({ x: 0, y: 0, zoom: 1 });
  private selectedNodesCount = signal(0);

  // Computed properties
  private isActive = computed(() => {
    const nodesMap = this.nodes();
    if (typeof this.isVisible === 'boolean') {
      return this.isVisible;
    }
    return nodesMap.size === 1 && 
           Array.from(nodesMap.values()).some((node: any) => node.selected) && 
           this.selectedNodesCount() === 1;
  });

  protected transform = computed(() => {
    const nodesMap = this.nodes();
    if (!this.isActive() || nodesMap.size === 0) return '';
    
    const nodesArray = Array.from(nodesMap.values()) as any[];
    const nodeRect = getInternalNodesBounds(nodesMap);
    const viewportState = this.viewport();
    
    return getNodeToolbarTransform(
      nodeRect,
      { x: viewportState.x, y: viewportState.y, zoom: viewportState.zoom },
      this.position,
      this.offset,
      this.align
    );
  });

  protected zIndex = computed(() => {
    const nodesMap = this.nodes();
    if (nodesMap.size === 0) return 1000;
    
    const nodesArray = Array.from(nodesMap.values()) as any[];
    return Math.max(...nodesArray.map((node: any) => (node.internals?.z || 0) + 1));
  });

  protected nodeIds = computed(() => {
    const nodesMap = this.nodes();
    return Array.from(nodesMap.values()).map((node: any) => node.id).join(' ');
  });

  constructor() {
    // Setup reactive effects
    effect(() => {
      this.updateNodes();
    });

    effect(() => {
      this.updateViewport();
    });

    effect(() => {
      this.updateSelectedNodesCount();
    });

    // Effect to handle portal creation/destruction
    effect(() => {
      const active = this.isActive();
      if (active && !this.embeddedViewRef) {
        this.createPortal();
      } else if (!active && this.embeddedViewRef) {
        this.destroyPortal();
      }
    });
  }

  ngOnInit(): void {
    // Initial setup is handled by effects
  }

  ngAfterViewInit(): void {
    // Check if we should create portal immediately
    if (this.isActive()) {
      this.createPortal();
    }
  }

  ngOnDestroy(): void {
    this.destroyPortal();
  }

  private updateNodes(): void {
    const contextNodeId = this.nodeIdContext?.nodeId || '';
    const nodeIds = Array.isArray(this.nodeId) 
      ? this.nodeId 
      : [this.nodeId || contextNodeId || ''];
    
    const nodeLookup = this.flowState.nodeLookup;
    const internalNodes = new Map();
    
    nodeIds.forEach(id => {
      const node = nodeLookup.get(id);
      if (node) {
        internalNodes.set(node.id, node);
      }
    });
    
    this.nodes.set(internalNodes);
  }

  private updateViewport(): void {
    const transform = this.flowState.transform;
    this.viewport.set({
      x: transform[0],
      y: transform[1],
      zoom: transform[2]
    });
  }

  private updateSelectedNodesCount(): void {
    const nodes = this.flowState.nodes;
    const selectedCount = nodes.filter((node: any) => node.selected).length;
    this.selectedNodesCount.set(selectedCount);
  }

  private createPortal(): void {
    if (!this.toolbarTemplate || this.embeddedViewRef) return;

    this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.toolbarTemplate);
    this.portalService.createPortal(this.embeddedViewRef);
  }

  private destroyPortal(): void {
    if (this.embeddedViewRef) {
      this.portalService.destroyPortal(this.embeddedViewRef);
      this.embeddedViewRef = null;
    }
  }
}