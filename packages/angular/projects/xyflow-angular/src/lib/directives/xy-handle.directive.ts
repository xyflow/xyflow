import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  Inject,
  Optional,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  XYHandle,
  Position,
  ConnectionMode,
  isMouseEvent,
  getHostForElement,
  addEdge,
  type HandleType,
  type Connection,
  type IsValidConnection,
  type OnConnect,
  type ConnectionState,
  type Optional as OptionalType,
  type XYPosition,
} from '@xyflow/system';

import { FlowStateService } from '../services/flow-state.service';
import type { Node, Edge } from '../types/general';

@Directive({
  selector: '[xyHandle]',
  standalone: true,
  host: {
    'class': 'angular-flow__handle',
    '[class.source]': 'type === "source"',
    '[class.target]': 'type === "target"',
    '[class.connectable]': 'isConnectable',
    '[class.connectablestart]': 'isConnectableStart',
    '[class.connectableend]': 'isConnectableEnd',
    '[class.connectingfrom]': 'connectingFrom',
    '[class.connectingto]': 'connectingTo',
    '[class.valid]': 'valid',
    '[class.connectionindicator]': 'showConnectionIndicator',
    '[attr.data-handleid]': 'id',
    '[attr.data-nodeid]': 'getNodeId()',
    '[attr.data-handlepos]': 'position',
    '[attr.data-id]': 'handleDataId',
    '[attr.role]': '"button"',
    '[attr.tabindex]': '"-1"',
    '(mousedown)': 'onPointerDown($event)',
    '(touchstart)': 'onPointerDown($event)',
    '(click)': 'onClick($event)',
  },
})
export class XYHandleDirective implements OnInit, OnDestroy {
  @Input('xyHandle') type: HandleType = 'source';
  @Input() position: Position = Position.Top;
  @Input() id?: string | null = null;
  @Input() isConnectable: boolean = true;
  @Input() isConnectableStart: boolean = true;
  @Input() isConnectableEnd: boolean = true;
  @Input() isValidConnection?: IsValidConnection;

  @Output() connect = new EventEmitter<Connection>();
  @Output() disconnect = new EventEmitter<{ connection: Connection; isNew: boolean }>();

  // Connection state
  connectingFrom = false;
  connectingTo = false;
  valid = false;
  showConnectionIndicator = false;
  private connectionInProgress = false;
  private clickConnectionInProcess = false;

  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private flowState: FlowStateService,
    private cdr: ChangeDetectorRef,
    @Inject('XYFLOW_NODE_ID') @Optional() private nodeId?: string | null,
    @Inject('XYFLOW_NODE_CONNECTABLE') @Optional() private nodeConnectable?: boolean
  ) {
    if (!this.nodeId) {
      console.warn('XYHandleDirective: No node ID provided. Make sure the directive is used within a node context.');
    }
  }

  ngOnInit(): void {
    this.subscribeToConnectionState();
    this.updateConnectionIndicator();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get handleDataId(): string {
    return `${this.flowState.flowId || 'angular-flow'}-${this.nodeId}-${this.id || 'null'}-${this.type}`;
  }

  get isTarget(): boolean {
    return this.type === 'target';
  }

  get effectiveConnectable(): boolean {
    return this.nodeConnectable !== undefined ? this.nodeConnectable : this.isConnectable;
  }

  private subscribeToConnectionState(): void {
    this.flowState.connection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(connection => {
        this.updateConnectionState(connection);
        this.cdr.markForCheck();
      });
  }

  private updateConnectionState(connection: ConnectionState): void {
    if (!connection.inProgress) {
      this.connectionInProgress = false;
      this.connectingFrom = false;
      this.connectingTo = false;
      this.valid = false;
      this.updateConnectionIndicator();
      return;
    }

    const { fromHandle, toHandle, isValid } = connection;

    this.connectionInProgress = true;
    this.connectingFrom = !!(
      fromHandle &&
      fromHandle.nodeId === this.nodeId &&
      fromHandle.type === this.type &&
      fromHandle.id === this.id
    );

    this.connectingTo = !!(
      toHandle &&
      toHandle.nodeId === this.nodeId &&
      toHandle.type === this.type &&
      toHandle.id === this.id
    );

    this.valid = this.connectingTo && !!isValid;
    this.updateConnectionIndicator();
  }

  private updateConnectionIndicator(): void {
    const isPossibleEndHandle = this.isPossibleEndHandle();
    this.showConnectionIndicator =
      this.effectiveConnectable &&
      (!this.connectionInProgress || isPossibleEndHandle) &&
      (this.connectionInProgress || this.clickConnectionInProcess
        ? this.isConnectableEnd
        : this.isConnectableStart);
  }

  private isPossibleEndHandle(): boolean {
    const connection = this.flowState.connection;
    if (!connection.inProgress || !connection.fromHandle) {
      return false;
    }

    const { fromHandle } = connection;
    const connectionMode = this.flowState.connectionMode || ConnectionMode.Strict;

    return connectionMode === ConnectionMode.Strict
      ? fromHandle.type !== this.type
      : this.nodeId !== fromHandle.nodeId || this.id !== fromHandle.id;
  }

  onPointerDown(event: MouseEvent | TouchEvent): void {
    if (!this.nodeId || !this.isConnectableStart) {
      return;
    }

    const isMouseTriggered = isMouseEvent(event);

    if (
      isMouseTriggered &&
      (event as MouseEvent).button !== 0 &&
      !isMouseTriggered
    ) {
      return;
    }

    const currentState = this.getCurrentFlowState();

    XYHandle.onPointerDown(event, {
      handleDomNode: this.elementRef.nativeElement,
      autoPanOnConnect: currentState.autoPanOnConnect,
      connectionMode: currentState.connectionMode,
      connectionRadius: currentState.connectionRadius,
      domNode: currentState.domNode,
      nodeLookup: currentState.nodeLookup,
      lib: 'angular',
      isTarget: this.isTarget,
      handleId: this.id || null,
      nodeId: this.nodeId,
      flowId: currentState.flowId,
      panBy: currentState.panBy,
      cancelConnection: currentState.cancelConnection,
      onConnectStart: currentState.onConnectStart,
      onConnectEnd: currentState.onConnectEnd,
      updateConnection: currentState.updateConnection,
      onConnect: this.onConnectExtended.bind(this),
      isValidConnection: this.isValidConnection || currentState.isValidConnection,
      getTransform: () => this.flowState.transform,
      getFromHandle: () => this.flowState.connection.fromHandle,
      autoPanSpeed: currentState.autoPanSpeed,
      dragThreshold: currentState.connectionDragThreshold,
    });
  }

  onClick(event: MouseEvent): void {
    const currentState = this.getCurrentFlowState();
    const {
      onClickConnectStart,
      onClickConnectEnd,
      connectionClickStartHandle,
      connectionMode,
      isValidConnection: isValidConnectionStore,
      lib,
      flowId,
      nodeLookup,
      connection: connectionState,
    } = currentState;

    if (!this.nodeId || (!connectionClickStartHandle && !this.isConnectableStart)) {
      return;
    }

    if (!connectionClickStartHandle) {
      onClickConnectStart?.(event, { nodeId: this.nodeId, handleId: this.id, handleType: this.type });
      // Set click connect start handle in state
      return;
    }

    const doc = getHostForElement(event.target);
    const isValidConnectionHandler = this.isValidConnection || isValidConnectionStore;

    const { connection, isValid } = XYHandle.isValid(event, {
      handle: {
        nodeId: this.nodeId,
        id: this.id,
        type: this.type,
      },
      connectionMode,
      fromNodeId: connectionClickStartHandle.nodeId,
      fromHandleId: connectionClickStartHandle.id || null,
      fromType: connectionClickStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId,
      doc,
      lib: 'angular',
      nodeLookup,
    });

    if (isValid && connection) {
      this.onConnectExtended(connection);
    }

    const connectionClone = structuredClone(connectionState) as OptionalType<
      ConnectionState,
      'inProgress'
    >;
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
    onClickConnectEnd?.(event, connectionClone);

    // Clear click connect start handle in state
  }

  private onConnectExtended(connection: Connection): void {
    const onBeforeConnect = this.flowState.onBeforeConnect;

    // Create a default edge from connection
    const defaultEdge = {
      id: `edge-${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    };

    const edge = onBeforeConnect ? defaultEdge : defaultEdge;

    if (!edge) {
      return;
    }

    // Add edge to flow state if default edges are managed
    this.flowState.addEdge?.(edge as any);

    // Emit connect event
    this.connect.emit(connection);

    // Call global onConnect handler
    this.flowState.onConnect?.(connection);
  }

  private getCurrentFlowState(): any {
    return {
      autoPanOnConnect: this.flowState.autoPanOnConnect || false,
      connectionMode: this.flowState.connectionMode || ConnectionMode.Strict,
      connectionRadius: this.flowState.connectionRadius || 20,
      domNode: this.flowState.domNode,
      nodeLookup: this.flowState.nodeLookup,
      flowId: this.flowState.flowId || 'angular-flow',
      panBy: this.flowState.panBy.bind(this.flowState),
      cancelConnection: this.flowState.cancelConnection.bind(this.flowState),
      onConnectStart: this.flowState.onConnectStart,
      onConnectEnd: this.flowState.onConnectEnd,
      updateConnection: this.flowState.updateConnection.bind(this.flowState),
      isValidConnection: this.flowState.isValidConnection,
      autoPanSpeed: this.flowState.autoPanSpeed || 15,
      connectionDragThreshold: this.flowState.connectionDragThreshold || 1,
      onClickConnectStart: this.flowState.onClickConnectStart,
      onClickConnectEnd: this.flowState.onClickConnectEnd,
      connectionClickStartHandle: this.flowState.connectionClickStartHandle,
      lib: 'angular',
      connection: this.flowState.connection,
    };
  }

  getNodeId(): string {
    return this.nodeId || '';
  }
}
