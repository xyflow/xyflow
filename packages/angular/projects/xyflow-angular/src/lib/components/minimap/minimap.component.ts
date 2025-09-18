import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  XYMinimap,
  type XYMinimapInstance,
  type Viewport,
  type Transform,
  PanelPosition,
  getNodesBounds,
} from '@xyflow/system';

import { FlowStateService } from '../../services/flow-state.service';
import { PanelComponent } from '../panel/panel.component';
import { MiniMapNodeComponent } from './minimap-node.component';
import { MiniMapProps, GetMiniMapNodeAttribute } from './types';
import type { Node } from '../../types/general';

const defaultWidth = 200;
const defaultHeight = 150;

/**
 * MiniMap component that provides overview navigation for large flows.
 * Shows scaled-down version of entire flow with viewport indicator.
 */
@Component({
  selector: 'angular-flow-minimap',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PanelComponent, MiniMapNodeComponent],
  template: `
    <angular-flow-panel
      [position]="position"
      [class]="getContainerClasses()"
      [attr.data-testid]="'angular-flow__minimap'"
      [style]="getContainerStyle()"
    >
      <svg
        #miniMapSvg
        [attr.width]="elementWidth"
        [attr.height]="elementHeight"
        [attr.viewBox]="getViewBox()"
        class="angular-flow__minimap-svg"
        role="img"
        [attr.aria-labelledby]="labelledBy"
        [style]="getSvgStyle()"
        (click)="onSvgClick($event)"
      >
        <title [id]="labelledBy">{{ getAriaLabel() }}</title>

        <!-- Nodes -->
        <ng-container *ngFor="let node of visibleNodes; trackBy: trackByNodeId">
          <g
            minimap-node
            [x]="getNodeX(node)"
            [y]="getNodeY(node)"
            [width]="getNodeWidth(node)"
            [height]="getNodeHeight(node)"
            [borderRadius]="nodeBorderRadius"
            [className]="getNodeClassName(node)"
            [color]="getNodeColor(node)"
            [strokeColor]="getNodeStrokeColor(node)"
            [strokeWidth]="nodeStrokeWidth"
            [shapeRendering]="shapeRendering"
            [selected]="node.selected"
            (click)="onNodeClick($event, node)"
          />
        </ng-container>

        <!-- Viewport Mask -->
        <path
          class="angular-flow__minimap-mask"
          [attr.d]="getMaskPath()"
          fill-rule="evenodd"
          pointer-events="none"
        />
      </svg>
    </angular-flow-panel>
  `,
  styleUrls: ['./minimap.component.css'],
})
export class MiniMapComponent implements OnInit, OnDestroy, AfterViewInit, MiniMapProps {
  private destroy$ = new Subject<void>();
  private minimapInstance?: XYMinimapInstance;
  private viewScaleRef: number = 0;

  @ViewChild('miniMapSvg', { static: true }) svgRef!: ElementRef<SVGSVGElement>;

  @Input() bgColor?: string;
  @Input() nodeColor?: string | GetMiniMapNodeAttribute;
  @Input() nodeStrokeColor?: string | GetMiniMapNodeAttribute;
  @Input() nodeClass?: string | GetMiniMapNodeAttribute;
  @Input() nodeBorderRadius: number = 5;
  @Input() nodeStrokeWidth?: number;
  @Input() maskColor?: string;
  @Input() maskStrokeColor?: string;
  @Input() maskStrokeWidth?: number;
  @Input() position: PanelPosition = 'bottom-right' as PanelPosition;
  @Input() className?: string;
  @Input() style?: { [key: string]: string | number };
  @Input() ariaLabel?: string | null;
  @Input() width?: number;
  @Input() height?: number;
  @Input() pannable: boolean = false;
  @Input() zoomable: boolean = false;
  @Input() inversePan?: boolean;
  @Input() zoomStep: number = 1;
  @Input() offsetScale: number = 5;

  // Computed properties
  viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  transform: Transform = [0, 0, 1];
  nodes: Node[] = [];
  visibleNodes: Node[] = [];

  boundingRect = { x: 0, y: 0, width: 0, height: 0 };
  viewBB = { x: 0, y: 0, width: 0, height: 0 };

  elementWidth: number = defaultWidth;
  elementHeight: number = defaultHeight;
  viewScale: number = 1;
  viewWidth: number = 0;
  viewHeight: number = 0;
  offset: number = 0;
  x: number = 0;
  y: number = 0;
  svgWidth: number = 0;
  svgHeight: number = 0;

  labelledBy: string = '';
  shapeRendering: string = 'geometricPrecision';

  constructor(
    private flowStateService: FlowStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.initializeProperties();
  }

  ngAfterViewInit(): void {
    this.setupMinimap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupMinimap();
  }

  private setupSubscriptions(): void {
    // Subscribe to viewport changes
    this.flowStateService.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewport: Viewport) => {
        this.viewport = viewport;
        this.updateComputedProperties();
        this.cdr.markForCheck();
      });

    // Subscribe to node changes
    this.flowStateService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((nodes: Node[]) => {
        this.nodes = nodes;
        this.updateVisibleNodes();
        this.updateComputedProperties();
        this.cdr.markForCheck();
      });

    // Subscribe to transform changes
    this.flowStateService.transform$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transform: Transform) => {
        this.transform = transform;
        this.updateComputedProperties();
        this.cdr.markForCheck();
      });

    // Subscribe to dimensions changes
    this.flowStateService.dimensions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dimensions: { width: number; height: number }) => {
        this.updateBoundingRect(dimensions);
        this.updateComputedProperties();
        this.cdr.markForCheck();
      });
  }

  private initializeProperties(): void {
    this.elementWidth = this.width || defaultWidth;
    this.elementHeight = this.height || defaultHeight;
    this.labelledBy = `angular-flow__minimap-desc-${this.flowStateService.flowId}`;

    // Detect browser for shape rendering optimization
    this.shapeRendering = this.isChromeOrEdge() ? 'crispEdges' : 'geometricPrecision';
  }

  private isChromeOrEdge(): boolean {
    if (typeof window === 'undefined') return false;
    // @ts-ignore - TS doesn't know about chrome
    return !!(window.chrome || window.navigator.userAgent.includes('Edge'));
  }

  private setupMinimap(): void {
    if (!this.svgRef?.nativeElement) return;

    const panZoom = this.flowStateService.getPanZoom();
    if (!panZoom) return;

    this.minimapInstance = XYMinimap({
      domNode: this.svgRef.nativeElement,
      panZoom,
      getTransform: () => this.transform,
      getViewScale: () => this.viewScaleRef,
    });

    this.updateMinimapInstance();
  }

  private updateMinimapInstance(): void {
    if (!this.minimapInstance) return;

    const { width, height } = this.flowStateService.getDimensions();
    const translateExtent = this.flowStateService.getTranslateExtent();

    this.minimapInstance.update({
      translateExtent,
      width,
      height,
      inversePan: this.inversePan,
      pannable: this.pannable,
      zoomStep: this.zoomStep,
      zoomable: this.zoomable,
    });
  }

  private cleanupMinimap(): void {
    if (this.minimapInstance) {
      this.minimapInstance.destroy();
    }
  }

  private updateVisibleNodes(): void {
    // Filter nodes that have dimensions
    this.visibleNodes = this.nodes.filter(node =>
      node.measured?.width && node.measured?.height
    );
  }

  private updateBoundingRect(dimensions: { width: number; height: number }): void {
    if (this.visibleNodes.length > 0) {
      this.boundingRect = getNodesBounds(this.visibleNodes);
    } else {
      this.boundingRect = { x: 0, y: 0, width: dimensions.width, height: dimensions.height };
    }
  }

  private updateComputedProperties(): void {
    const scaledWidth = this.boundingRect.width / this.elementWidth;
    const scaledHeight = this.boundingRect.height / this.elementHeight;
    this.viewScale = Math.max(scaledWidth, scaledHeight);
    this.viewScaleRef = this.viewScale;

    this.viewWidth = this.viewScale * this.elementWidth;
    this.viewHeight = this.viewScale * this.elementHeight;
    this.offset = this.offsetScale * this.viewScale;

    this.x = this.boundingRect.x - (this.viewWidth - this.boundingRect.width) / 2 - this.offset;
    this.y = this.boundingRect.y - (this.viewHeight - this.boundingRect.height) / 2 - this.offset;
    this.svgWidth = this.viewWidth + this.offset * 2;
    this.svgHeight = this.viewHeight + this.offset * 2;

    // Update viewport bounding box
    this.viewBB = {
      x: -this.viewport.x / this.viewport.zoom,
      y: -this.viewport.y / this.viewport.zoom,
      width: this.elementWidth / this.viewport.zoom,
      height: this.elementHeight / this.viewport.zoom,
    };

    this.updateMinimapInstance();
  }

  // Template methods
  trackByNodeId(index: number, node: Node): string {
    return node.id;
  }

  getContainerClasses(): string {
    const baseClasses = ['angular-flow__minimap'];
    if (this.className) {
      baseClasses.push(this.className);
    }
    return baseClasses.join(' ');
  }

  getContainerStyle(): { [key: string]: string } {
    const containerStyle: { [key: string]: string } = {};

    if (this.bgColor) {
      containerStyle['--xy-minimap-background-color-props'] = this.bgColor;
    }

    if (this.style) {
      Object.keys(this.style).forEach(key => {
        const value = this.style![key];
        containerStyle[key] = typeof value === 'number' ? value.toString() : (value || '');
      });
    }

    return containerStyle;
  }

  getSvgStyle(): { [key: string]: string | number } {
    const svgStyle: { [key: string]: string | number } = {};

    if (this.maskColor) {
      svgStyle['--xy-minimap-mask-background-color-props'] = this.maskColor;
    }
    if (this.maskStrokeColor) {
      svgStyle['--xy-minimap-mask-stroke-color-props'] = this.maskStrokeColor;
    }
    if (this.maskStrokeWidth) {
      svgStyle['--xy-minimap-mask-stroke-width-props'] = this.maskStrokeWidth * this.viewScale;
    }

    return svgStyle;
  }

  getViewBox(): string {
    return `${this.x} ${this.y} ${this.svgWidth} ${this.svgHeight}`;
  }

  getAriaLabel(): string {
    return this.ariaLabel || 'Mini Map';
  }

  getMaskPath(): string {
    const { x, y, width, height } = this.viewBB;
    return `M${this.x - this.offset},${this.y - this.offset}h${this.svgWidth}v${this.svgHeight}h${-this.svgWidth}z M${x},${y}h${width}v${height}h${-width}z`;
  }

  // Node positioning and styling
  getNodeX(node: Node): number {
    return node.position?.x || 0;
  }

  getNodeY(node: Node): number {
    return node.position?.y || 0;
  }

  getNodeWidth(node: Node): number {
    return node.measured?.width || 0;
  }

  getNodeHeight(node: Node): number {
    return node.measured?.height || 0;
  }

  getNodeClassName(node: Node): string {
    if (!this.nodeClass) return '';
    return typeof this.nodeClass === 'function' ? this.nodeClass(node) : this.nodeClass;
  }

  getNodeColor(node: Node): string {
    if (!this.nodeColor) return '';
    return typeof this.nodeColor === 'function' ? this.nodeColor(node) : this.nodeColor;
  }

  getNodeStrokeColor(node: Node): string {
    if (!this.nodeStrokeColor) return '';
    return typeof this.nodeStrokeColor === 'function' ? this.nodeStrokeColor(node) : this.nodeStrokeColor;
  }

  // Event handlers
  onSvgClick(event: MouseEvent): void {
    if (!this.minimapInstance) return;

    const [x, y] = this.minimapInstance.pointer(event) || [0, 0];
    // Could emit click event here for parent components
    console.log('Minimap clicked at:', { x, y });
  }

  onNodeClick(event: MouseEvent, node: Node): void {
    event.stopPropagation();
    // Could emit node click event here for parent components
    console.log('Minimap node clicked:', node.id);
  }
}
