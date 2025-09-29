import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewContainerRef,
  TemplateRef,
  ViewChild,
  Injector,
  Type,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  XYDrag,
  type NodeDragItem,
  type XYPosition,
  type InternalNodeBase,
  getHostForElement,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import type { Node, NodeChange, AngularFlowNode } from '../../types/general';

@Component({
  selector: 'xy-node-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="xy-node"
      [class]="getNodeClassName()"
      [class.xy-selected]="node.selected"
      [class.xy-dragging]="isDragging"
      [class.xy-draggable]="isDraggable"
      [class.xy-selectable]="isSelectable"
      [style.transform]="transform"
      [style.width.px]="node.width"
      [style.height.px]="node.height"
      [style.z-index]="node.zIndex"
      [attr.data-id]="node.id"
      [attr.data-nodetype]="node.type"
      (mousedown)="onMouseDown($event)"
      (touchstart)="onTouchStart($event)"
      (click)="onClick($event)"
      (contextmenu)="onContextMenu($event)"
      (mouseenter)="onMouseEnter($event)"
      (mouseleave)="onMouseLeave($event)"
    >
      <!-- Render user-defined node component -->
      <ng-container #nodeOutlet></ng-container>

      <!-- Selection indicator -->
      <div
        *ngIf="node.selected && showSelectionIndicator"
        class="xy-node-selection-indicator"
      ></div>
    </div>
  `,
  styleUrls: ['./node-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: 'XYFLOW_NODE_ID', useFactory: (component: NodeWrapperComponent) => component.node?.id, deps: [NodeWrapperComponent] },
    { provide: 'XYFLOW_NODE_CONNECTABLE', useFactory: (component: NodeWrapperComponent) => component.node?.connectable, deps: [NodeWrapperComponent] },
  ],
})
export class NodeWrapperComponent implements OnInit, OnDestroy, OnChanges {
  @Input() node!: AngularFlowNode;
  @Input() nodeTypes?: Map<string, Type<any>>;
  @Input() nodeTemplates?: Map<string, TemplateRef<any>>;
  @Input() isDraggable: boolean = true;
  @Input() isSelectable: boolean = true;
  @Input() snapToGrid: boolean = false;
  @Input() snapGrid: [number, number] = [15, 15];
  @Input() showSelectionIndicator: boolean = true;

  @Output() nodeClick = new EventEmitter<{ event: MouseEvent; node: AngularFlowNode }>();
  @Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent; node: AngularFlowNode }>();
  @Output() nodeContextMenu = new EventEmitter<{ event: MouseEvent; node: AngularFlowNode }>();
  @Output() nodeMouseEnter = new EventEmitter<{ event: MouseEvent; node: AngularFlowNode }>();
  @Output() nodeMouseLeave = new EventEmitter<{ event: MouseEvent; node: AngularFlowNode }>();
  @Output() nodeDragStart = new EventEmitter<{ event: MouseEvent | TouchEvent; node: AngularFlowNode }>();
  @Output() nodeDrag = new EventEmitter<{ event: MouseEvent | TouchEvent; node: AngularFlowNode }>();
  @Output() nodeDragStop = new EventEmitter<{ event: MouseEvent | TouchEvent; node: AngularFlowNode }>();

  @ViewChild('nodeOutlet', { read: ViewContainerRef, static: true })
  nodeOutlet!: ViewContainerRef;

  isDragging = false;

  private destroy$ = new Subject<void>();
  private componentRef?: ComponentRef<any>;
  private dragHandler?: any;
  private lastClickTime = 0;
  private clickTimeout?: number;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.initializeDragHandler();
    this.renderNodeComponent();
    this.subscribeToNodeChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupComponent();
    this.cleanupDragHandler();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['node'] && !changes['node'].firstChange) {
      this.renderNodeComponent();
      this.cdr.markForCheck();
    }
  }

  get transform(): string {
    const { x, y } = this.node.position;
    return `translate(${x}px, ${y}px)`;
  }

  private initializeDragHandler() {
    if (!this.isDraggable) return;

    const domNode = this.elementRef.nativeElement;
    const flowContainer = this.getFlowContainer();

    if (!flowContainer) return;

    const dragHandler = new (XYDrag as any)({
      getStoreItems: () => this.getDragItems(),
      onDragStart: (event: any, dragItems: any) => this.onDragStart(event, Array.from(dragItems.values())),
      onDrag: (event: any, dragItems: any) => this.onDrag(event, Array.from(dragItems.values())),
      onDragStop: (event: any, dragItems: any) => this.onDragEnd(event, Array.from(dragItems.values())),
    });
  }

  private subscribeToNodeChanges() {
    this.flowState.nodes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Update node state when nodes change
      this.cdr.markForCheck();
    });
  }

  private renderNodeComponent() {
    this.cleanupComponent();

    if (!this.node || !this.nodeOutlet) return;

    const nodeType = this.node.type || 'default';

    // Try to render with component type first
    const ComponentType = this.nodeTypes?.get(nodeType);
    if (ComponentType) {
      this.renderComponent(ComponentType);
      return;
    }

    // Try to render with template
    const template = this.nodeTemplates?.get(nodeType);
    if (template) {
      this.renderTemplate(template);
      return;
    }

    // Fallback to default rendering
    this.renderDefaultNode();
  }

  private renderComponent(ComponentType: Type<any>) {
    const componentInjector = Injector.create({
      providers: [
        { provide: 'NODE_DATA', useValue: this.node },
        { provide: 'XYFLOW_NODE_ID', useValue: this.node.id },
        { provide: 'XYFLOW_NODE_CONNECTABLE', useValue: this.node.connectable },
      ],
      parent: this.injector,
    });

    this.componentRef = this.nodeOutlet.createComponent(ComponentType, {
      injector: componentInjector,
    });

    // Pass node data to component if it has a data property
    if ('data' in this.componentRef.instance) {
      this.componentRef.instance.data = this.node.data;
    }

    // Pass node instance if component expects it
    if ('node' in this.componentRef.instance) {
      this.componentRef.instance.node = this.node;
    }
  }

  private renderTemplate(template: TemplateRef<any>) {
    this.nodeOutlet.createEmbeddedView(template, {
      $implicit: this.node,
      node: this.node,
      data: this.node.data,
    });
  }

  private renderDefaultNode() {
    // Create a simple default node representation
    const div = document.createElement('div');
    div.className = 'xy-default-node';
    div.innerHTML = `
      <div class="xy-node-header">${this.node.type || 'Node'}</div>
      <div class="xy-node-content">${this.node.data?.['label'] || this.node.id}</div>
    `;

    this.nodeOutlet.element.nativeElement.appendChild(div);
  }

  private cleanupComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
    this.nodeOutlet?.clear();
  }

  private cleanupDragHandler() {
    if (this.dragHandler) {
      // Cleanup drag handler if needed
      this.dragHandler = undefined;
    }
  }

  private getDragItems(): NodeDragItem[] {
    return [{
      id: this.node.id,
      position: this.node.position,
      distance: { x: 0, y: 0 },
      extent: this.node.extent,
      parentId: this.node.parentId,
      expandParent: this.node.expandParent,
      measured: { width: this.node.measured?.width || 0, height: this.node.measured?.height || 0 },
      internals: { positionAbsolute: { x: 0, y: 0 } }
    }];
  }

  private onDragStart(event: MouseEvent | TouchEvent, nodes: NodeDragItem[]) {
    this.isDragging = true;
    this.nodeDragStart.emit({ event, node: this.node });
    this.flowState.onNodeDragStart?.(event, this.node, nodes);
    this.cdr.markForCheck();
  }

  private onDrag(event: MouseEvent | TouchEvent, nodes: NodeDragItem[]) {
    // Update node position
    const draggedNode = nodes.find(n => n.id === this.node.id);
    if (draggedNode) {
      const changes: NodeChange[] = [{
        type: 'position',
        id: this.node.id,
        position: draggedNode.position,
      }];

      this.flowState.applyNodeChanges(changes);
    }

    this.nodeDrag.emit({ event, node: this.node });
    this.flowState.onNodeDrag?.(event, this.node, nodes);
    this.cdr.markForCheck();
  }

  private onDragEnd(event: MouseEvent | TouchEvent, nodes: NodeDragItem[]) {
    this.isDragging = false;
    this.nodeDragStop.emit({ event, node: this.node });
    this.flowState.onNodeDragStop?.(event, this.node, nodes);
    this.cdr.markForCheck();
  }

  private getFlowContainer(): HTMLElement | null {
    return getHostForElement(this.elementRef.nativeElement) as unknown as HTMLElement | null;
  }

  // Event handlers
  onMouseDown(event: MouseEvent) {
    if (!this.isDraggable) return;

    // Let the drag handler take care of drag start
    event.stopPropagation();
  }

  onTouchStart(event: TouchEvent) {
    if (!this.isDraggable) return;

    // Let the drag handler take care of drag start
    event.stopPropagation();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();

    const now = Date.now();
    const timeDiff = now - this.lastClickTime;

    if (timeDiff < 300) {
      // Double click
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = undefined;
      }
      this.nodeDoubleClick.emit({ event, node: this.node });
      this.flowState.onNodeDoubleClick?.(event, this.node);
    } else {
      // Single click (with delay to detect double click)
      this.clickTimeout = window.setTimeout(() => {
        this.nodeClick.emit({ event, node: this.node });
        this.flowState.onNodeClick?.(event, this.node);

        // Handle selection
        if (this.isSelectable) {
          const isSelected = !this.node.selected;
          const changes: NodeChange[] = [{
            type: 'select',
            id: this.node.id,
            selected: isSelected,
          }];
          this.flowState.applyNodeChanges(changes);
        }
      }, 300);
    }

    this.lastClickTime = now;
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.nodeContextMenu.emit({ event, node: this.node });
    this.flowState.onNodeContextMenu?.(event, this.node);
  }

  onMouseEnter(event: MouseEvent) {
    this.nodeMouseEnter.emit({ event, node: this.node });
    this.flowState.onNodeMouseEnter?.(event, this.node);
  }

  onMouseLeave(event: MouseEvent) {
    this.nodeMouseLeave.emit({ event, node: this.node });
    this.flowState.onNodeMouseLeave?.(event, this.node);
  }

  getNodeClassName(): string {
    return (this.node as any).className || '';
  }
}
