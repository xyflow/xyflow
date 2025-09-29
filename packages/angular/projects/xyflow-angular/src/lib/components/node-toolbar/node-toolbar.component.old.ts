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
import { NodeIdContext } from './node-id.context';
import { PortalService } from './portal.service';

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
export class NodeToolbarComponent implements OnInit, OnDestroy, NodeToolbarProps {
  private destroy$ = new Subject<void>();

  @Input() nodeId?: string | string[];
  @Input() isVisible?: boolean;
  @Input() position: Position = Position.Top;
  @Input() offset: number = 10;
  @Input() align: 'start' | 'center' | 'end' = 'center';
  @Input() className?: string;
  @Input() style?: Record<string, any>;

  // Signals for reactive computation
  private nodes = signal<Map<string, AngularFlowNode>>(new Map());
  private viewport = signal<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });
  private selectedNodesCount = signal<number>(0);

  // Computed values
  isActive = computed(() => {
    const nodeMap = this.nodes();
    if (typeof this.isVisible === 'boolean') {
      return this.isVisible;
    }
    // Show toolbar only if its node is selected and no other node is selected
    return (
      nodeMap.size === 1 &&
      Array.from(nodeMap.values())[0]?.selected &&
      this.selectedNodesCount() === 1
    );
  });

  wrapperStyle = computed(() => {
    const nodeMap = this.nodes();
    const viewportState = this.viewport();
    
    if (!nodeMap.size) {
      return {};
    }

    const nodesArray = Array.from(nodeMap.values());
    const nodeRect = getInternalNodesBounds(nodeMap as any);
    const zIndex = Math.max(...nodesArray.map((node: any) => (node.internals?.z || 5) + 1));

    const transform = getNodeToolbarTransform(
      nodeRect,
      viewportState,
      this.position,
      this.offset,
      this.align
    );

    return {
      position: 'absolute',
      transform,
      zIndex,
      ...this.style,
    };
  });

  toolbarNodeIds = computed(() => {
    const nodeMap = this.nodes();
    return Array.from(nodeMap.values())
      .map(node => node.id)
      .join(' ')
      .trim();
  });

  constructor(
    private flowStateService: FlowStateService,
    private cdr: ChangeDetectorRef,
    private nodeIdContext: NodeIdContext
  ) {
    // Set up reactive updates
    effect(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.setupNodeSubscription();
    this.setupViewportSubscription();
    this.setupSelectedNodesSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupNodeSubscription(): void {
    this.flowStateService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((allNodes: AngularFlowNode[]) => {
        const contextNodeId = this.nodeIdContext.nodeId;
        const targetNodeIds = Array.isArray(this.nodeId) 
          ? this.nodeId 
          : [this.nodeId || contextNodeId || ''];

        const selectedNodes = new Map<string, AngularFlowNode>();
        
        targetNodeIds.forEach(id => {
          const node = allNodes.find(n => n.id === id);
          if (node) {
            selectedNodes.set(id, node);
          }
        });

        this.nodes.set(selectedNodes);
      });
  }

  private setupViewportSubscription(): void {
    this.flowStateService.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewport) => {
        this.viewport.set({
          x: viewport.x,
          y: viewport.y,
          zoom: viewport.zoom,
        });
      });
  }

  private setupSelectedNodesSubscription(): void {
    this.flowStateService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: AngularFlowNode[]) => {
        const selectedCount = nodes.filter(node => node.selected).length;
        this.selectedNodesCount.set(selectedCount);
      });
  }
}