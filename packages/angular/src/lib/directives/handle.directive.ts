import { Directive, Input, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FlowStoreService } from '../services/flow-store.service';
import type { Position } from '@xyflow/system';

@Directive({
  selector: '[angularFlowHandle]',
  standalone: true,
})
export class HandleDirective implements OnInit, OnDestroy {
  @Input() angularFlowHandle: 'source' | 'target' = 'source';
  @Input() nodeId!: string;
  @Input() handleId?: string;
  @Input() position: Position = 'right';
  @Input() connectable: boolean = true;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private store: FlowStoreService
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    element.classList.add('angular-flow-handle');
    element.classList.add(`angular-flow-handle-${this.position}`);
    element.classList.add(`angular-flow-handle-${this.angularFlowHandle}`);

    if (!this.connectable) {
      element.classList.add('angular-flow-handle-not-connectable');
    }
  }

  ngOnDestroy(): void {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.connectable) return;

    event.stopPropagation();

    if (this.angularFlowHandle === 'source') {
      this.store.startConnection(this.nodeId, this.handleId || null, 'source');
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.connectable) return;

    const connectionStart = this.store.connectionStartHandle();

    if (connectionStart && this.angularFlowHandle === 'target') {
      // Create connection
      const connection = {
        source: connectionStart.nodeId,
        sourceHandle: connectionStart.handleId,
        target: this.nodeId,
        targetHandle: this.handleId || null,
      };

      this.store.addEdge(connection);
      this.store.endConnection();
    }
  }
}
