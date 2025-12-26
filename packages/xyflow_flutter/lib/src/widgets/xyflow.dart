import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart' hide Viewport;
import 'package:flutter/services.dart';

import '../core/types/changes.dart' show NodeChange, EdgeChange, NodePositionChange;
import '../core/types/handle.dart' show HandleType;
import '../core/types/connection.dart';
import '../core/types/edge.dart';
import '../core/types/node.dart';
import '../core/types/position.dart';
import '../core/types/viewport.dart' hide Transform;
import '../state/xyflow_controller.dart';
import '../state/xyflow_provider.dart';
import '../state/xyflow_state.dart';
import 'connection_line.dart';
import 'edges/base_edge.dart';
import 'nodes/default_node.dart';

/// A widget builder for custom nodes.
typedef NodeBuilder<T> = Widget Function(NodeProps<T> props);

/// A widget builder for custom edges.
typedef EdgeBuilder<T> = Widget Function(EdgeProps<T> props);

/// Props passed to custom node widgets.
@immutable
class NodeProps<T> {
  /// Creates node props.
  const NodeProps({
    required this.id,
    required this.data,
    required this.position,
    this.type,
    this.selected = false,
    this.dragging = false,
    this.width,
    this.height,
    this.isConnectable = true,
    this.sourcePosition = Position.right,
    this.targetPosition = Position.left,
    this.zIndex,
  });

  /// The node ID.
  final String id;

  /// The node data.
  final T data;

  /// The node position.
  final XYPosition position;

  /// The node type.
  final String? type;

  /// Whether the node is selected.
  final bool selected;

  /// Whether the node is being dragged.
  final bool dragging;

  /// The node width.
  final double? width;

  /// The node height.
  final double? height;

  /// Whether the node can be connected.
  final bool isConnectable;

  /// Default position for source handles.
  final Position sourcePosition;

  /// Default position for target handles.
  final Position targetPosition;

  /// The z-index.
  final int? zIndex;
}

/// The main XYFlow widget.
///
/// This is the Flutter equivalent of the ReactFlow component.
class XYFlow<NodeData, EdgeData> extends StatefulWidget {
  /// Creates an XYFlow widget.
  const XYFlow({
    super.key,
    this.nodes = const [],
    this.edges = const [],
    this.onNodesChange,
    this.onEdgesChange,
    this.onNodeClick,
    this.onNodeDoubleClick,
    this.onNodeDragStart,
    this.onNodeDrag,
    this.onNodeDragStop,
    this.onEdgeClick,
    this.onConnect,
    this.onConnectStart,
    this.onConnectEnd,
    this.onInit,
    this.nodeTypes,
    this.edgeTypes,
    this.defaultEdgeOptions,
    this.connectionMode = ConnectionMode.strict,
    this.connectionLineType = ConnectionLineType.bezier,
    this.snapToGrid = false,
    this.snapGrid = const (15, 15),
    this.fitView = false,
    this.fitViewOptions,
    this.minZoom = 0.5,
    this.maxZoom = 2.0,
    this.translateExtent,
    this.nodeExtent,
    this.nodeOrigin = NodeOrigins.topLeft,
    this.panOnScroll = false,
    this.panOnDrag = true,
    this.zoomOnScroll = true,
    this.zoomOnPinch = true,
    this.zoomOnDoubleClick = true,
    this.selectNodesOnDrag = true,
    this.elevateNodesOnSelect = true,
    this.elevateEdgesOnSelect = false,
    this.nodesDraggable = true,
    this.nodesConnectable = true,
    this.elementsSelectable = true,
    this.deleteKeyCode = LogicalKeyboardKey.delete,
    this.multiSelectionKeyCode = LogicalKeyboardKey.shift,
    this.children,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Data Props
  // ═══════════════════════════════════════════════════════════════════════════

  /// The list of nodes to render.
  final List<Node<NodeData>> nodes;

  /// The list of edges to render.
  final List<Edge<EdgeData>> edges;

  // ═══════════════════════════════════════════════════════════════════════════
  // Change Callbacks
  // ═══════════════════════════════════════════════════════════════════════════

  /// Called when nodes change.
  final void Function(List<NodeChange> changes)? onNodesChange;

  /// Called when edges change.
  final void Function(List<EdgeChange> changes)? onEdgesChange;

  // ═══════════════════════════════════════════════════════════════════════════
  // Interaction Callbacks
  // ═══════════════════════════════════════════════════════════════════════════

  /// Called when a node is clicked.
  final void Function(Node<NodeData> node)? onNodeClick;

  /// Called when a node is double-clicked.
  final void Function(Node<NodeData> node)? onNodeDoubleClick;

  /// Called when node dragging starts.
  final void Function(Node<NodeData> node)? onNodeDragStart;

  /// Called during node dragging.
  final void Function(Node<NodeData> node, XYPosition position)? onNodeDrag;

  /// Called when node dragging stops.
  final void Function(Node<NodeData> node)? onNodeDragStop;

  /// Called when an edge is clicked.
  final void Function(Edge<EdgeData> edge)? onEdgeClick;

  /// Called when a connection is made.
  final void Function(Connection connection)? onConnect;

  /// Called when connection creation starts.
  final void Function(OnConnectStartParams params)? onConnectStart;

  /// Called when connection creation ends.
  final void Function(OnConnectEndParams params)? onConnectEnd;

  /// Called when the flow is initialized.
  final void Function(XYFlowController<NodeData, EdgeData> controller)? onInit;

  // ═══════════════════════════════════════════════════════════════════════════
  // Customization
  // ═══════════════════════════════════════════════════════════════════════════

  /// Custom node type builders.
  final Map<String, NodeBuilder<NodeData>>? nodeTypes;

  /// Custom edge type builders.
  final Map<String, EdgeBuilder<EdgeData>>? edgeTypes;

  /// Default options for new edges.
  final Edge<EdgeData>? defaultEdgeOptions;

  /// Connection validation mode.
  final ConnectionMode connectionMode;

  /// Type of connection line to show during connection creation.
  final ConnectionLineType connectionLineType;

  // ═══════════════════════════════════════════════════════════════════════════
  // Snap & Grid
  // ═══════════════════════════════════════════════════════════════════════════

  /// Whether to snap node positions to a grid.
  final bool snapToGrid;

  /// The grid spacing for snapping.
  final (double, double) snapGrid;

  // ═══════════════════════════════════════════════════════════════════════════
  // Viewport
  // ═══════════════════════════════════════════════════════════════════════════

  /// Whether to fit all nodes in view on initial render.
  final bool fitView;

  /// Options for fitView.
  final FitViewOptions? fitViewOptions;

  /// Minimum zoom level.
  final double minZoom;

  /// Maximum zoom level.
  final double maxZoom;

  /// Bounds for panning.
  final CoordinateExtent? translateExtent;

  /// Bounds for node positions.
  final CoordinateExtent? nodeExtent;

  /// Node origin for positioning.
  final NodeOrigin nodeOrigin;

  // ═══════════════════════════════════════════════════════════════════════════
  // Interaction Options
  // ═══════════════════════════════════════════════════════════════════════════

  /// Whether to pan on scroll.
  final bool panOnScroll;

  /// Whether to pan on drag.
  final bool panOnDrag;

  /// Whether to zoom on scroll.
  final bool zoomOnScroll;

  /// Whether to zoom on pinch.
  final bool zoomOnPinch;

  /// Whether to zoom on double click.
  final bool zoomOnDoubleClick;

  /// Whether to select nodes when dragging.
  final bool selectNodesOnDrag;

  /// Whether to elevate nodes on selection.
  final bool elevateNodesOnSelect;

  /// Whether to elevate edges on selection.
  final bool elevateEdgesOnSelect;

  /// Whether nodes are draggable.
  final bool nodesDraggable;

  /// Whether nodes are connectable.
  final bool nodesConnectable;

  /// Whether elements are selectable.
  final bool elementsSelectable;

  /// Key code for deleting selected elements.
  final LogicalKeyboardKey? deleteKeyCode;

  /// Key code for multi-selection.
  final LogicalKeyboardKey? multiSelectionKeyCode;

  // ═══════════════════════════════════════════════════════════════════════════
  // Children
  // ═══════════════════════════════════════════════════════════════════════════

  /// Child widgets (Background, Controls, MiniMap, etc.).
  final List<Widget>? children;

  @override
  State<XYFlow<NodeData, EdgeData>> createState() =>
      _XYFlowState<NodeData, EdgeData>();
}

class _XYFlowState<NodeData, EdgeData> extends State<XYFlow<NodeData, EdgeData>>
    with TickerProviderStateMixin {
  late XYFlowState<NodeData, EdgeData> _state;
  late XYFlowController<NodeData, EdgeData> _controller;
  final GlobalKey _viewportKey = GlobalKey();

  // Drag state
  Offset? _lastPanPosition;
  bool _isPanning = false;

  // Scale state
  double? _initialScale;

  @override
  void initState() {
    super.initState();
    _initializeState();
  }

  void _initializeState() {
    _state = XYFlowState<NodeData, EdgeData>(
      nodes: widget.nodes,
      edges: widget.edges,
      minZoom: widget.minZoom,
      maxZoom: widget.maxZoom,
      translateExtent: widget.translateExtent,
      nodeExtent: widget.nodeExtent,
      nodeOrigin: widget.nodeOrigin,
      snapGrid: widget.snapToGrid ? widget.snapGrid : null,
      connectionMode: widget.connectionMode,
    );

    _controller = XYFlowController<NodeData, EdgeData>(
      state: _state,
      vsync: this,
    );

    // Call onInit after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      widget.onInit?.call(_controller);

      if (widget.fitView) {
        _controller.fitView(
          padding: widget.fitViewOptions?.padding ?? const EdgeInsets.all(10),
          includeHiddenNodes: widget.fitViewOptions?.includeHiddenNodes ?? false,
        );
      }
    });
  }

  @override
  void didUpdateWidget(XYFlow<NodeData, EdgeData> oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Update nodes if changed
    if (widget.nodes != oldWidget.nodes) {
      _state.setNodes(widget.nodes);
    }

    // Update edges if changed
    if (widget.edges != oldWidget.edges) {
      _state.setEdges(widget.edges);
    }

    // Update constraints
    if (widget.minZoom != oldWidget.minZoom ||
        widget.maxZoom != oldWidget.maxZoom) {
      _state.setZoomConstraints(
        minZoom: widget.minZoom,
        maxZoom: widget.maxZoom,
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _state.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return XYFlowProvider<NodeData, EdgeData>(
      state: _state,
      child: ListenableBuilder(
        listenable: _state,
        builder: (context, child) {
          return Focus(
            autofocus: true,
            onKeyEvent: _handleKeyEvent,
            child: ClipRect(
              child: GestureDetector(
                onScaleStart: _handleScaleStart,
                onScaleUpdate: _handleScaleUpdate,
                onScaleEnd: _handleScaleEnd,
                onDoubleTap: widget.zoomOnDoubleClick ? _handleDoubleTap : null,
                child: Listener(
                  onPointerSignal: _handlePointerSignal,
                  child: Container(
                    color: Colors.transparent, // Ensure hit testing works
                    child: Stack(
                      key: _viewportKey,
                      children: [
                        // Viewport with edges and nodes
                        Transform(
                          transform: _state.viewport.toMatrix4(),
                          child: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              // Edges layer
                              ..._buildEdges(),
                              // Nodes layer
                              ..._buildNodes(),
                              // Connection line during drag
                              if (_state.connectionState.isConnecting &&
                                  _state.connectionState.startPosition != null &&
                                  _state.connectionState.endPosition != null)
                                ConnectionLine(
                                  fromX: _state.connectionState.startPosition!.x,
                                  fromY: _state.connectionState.startPosition!.y,
                                  toX: _state.connectionState.endPosition!.x,
                                  toY: _state.connectionState.endPosition!.y,
                                  fromPosition: _getPositionFromHandleType(
                                    _state.connectionState.startHandleType,
                                  ),
                                  connectionLineType: widget.connectionLineType,
                                  isValid: _state.connectionState.isValid ?? true,
                                ),
                            ],
                          ),
                        ),
                        // Additional children (Background, Controls, etc.)
                        if (widget.children != null) ...widget.children!,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  List<Widget> _buildNodes() {
    final nodes = _state.nodes.where((n) => !n.hidden).toList();

    // Sort by z-index
    nodes.sort((a, b) {
      final aInternal = _state.nodeLookup[a.id];
      final bInternal = _state.nodeLookup[b.id];
      return (aInternal?.z ?? 0).compareTo(bInternal?.z ?? 0);
    });

    return nodes.map((node) {
      final internal = _state.nodeLookup[node.id];
      if (internal == null) return const SizedBox.shrink();

      final position = internal.positionAbsolute;

      return Positioned(
        left: position.x,
        top: position.y,
        child: _NodeWrapper<NodeData, EdgeData>(
          key: ValueKey('node-${node.id}'),
          node: node,
          nodeTypes: widget.nodeTypes,
          onNodeClick: widget.onNodeClick,
          onNodeDoubleClick: widget.onNodeDoubleClick,
          onNodeDragStart: widget.onNodeDragStart,
          onNodeDrag: widget.onNodeDrag,
          onNodeDragStop: widget.onNodeDragStop,
          draggable: widget.nodesDraggable && node.draggable,
          selectable: widget.elementsSelectable && node.selectable,
          onPositionChange: (newPosition) {
            widget.onNodesChange?.call([
              NodePositionChange(
                id: node.id,
                position: newPosition,
              ),
            ]);
          },
          onDimensionsChange: (width, height) {
            _state.reportNodeDimensions(node.id, width, height);
          },
        ),
      );
    }).toList();
  }

  List<Widget> _buildEdges() {
    final edges = _state.edges.where((e) => !e.hidden).toList();

    return edges.map((edge) {
      final sourceNode = _state.nodeLookup[edge.source];
      final targetNode = _state.nodeLookup[edge.target];

      if (sourceNode == null || targetNode == null) {
        return const SizedBox.shrink();
      }

      // Calculate edge positions based on handle positions
      final sourcePos = _getHandlePosition(sourceNode, edge.sourceHandle, true);
      final targetPos = _getHandlePosition(targetNode, edge.targetHandle, false);

      return BaseEdgeWidget<EdgeData>(
        key: ValueKey('edge-${edge.id}'),
        edge: edge,
        edgeTypes: widget.edgeTypes,
        sourceX: sourcePos.dx,
        sourceY: sourcePos.dy,
        targetX: targetPos.dx,
        targetY: targetPos.dy,
        sourcePosition: _getHandlePositionEnum(sourceNode.node, true),
        targetPosition: _getHandlePositionEnum(targetNode.node, false),
        onEdgeClick: widget.onEdgeClick,
        selectable: widget.elementsSelectable && edge.selectable,
      );
    }).toList();
  }

  Offset _getHandlePosition(
    InternalNode<NodeData> node,
    String? handleId,
    bool isSource,
  ) {
    final pos = node.positionAbsolute;
    final width = node.measured?.width ?? node.node.width ?? 150;
    final height = node.measured?.height ?? node.node.height ?? 40;

    // Get the handle position based on node configuration or defaults
    final handlePos = isSource
        ? (node.node.sourcePosition ?? Position.right)
        : (node.node.targetPosition ?? Position.left);

    switch (handlePos) {
      case Position.left:
        return Offset(pos.x, pos.y + height / 2);
      case Position.right:
        return Offset(pos.x + width, pos.y + height / 2);
      case Position.top:
        return Offset(pos.x + width / 2, pos.y);
      case Position.bottom:
        return Offset(pos.x + width / 2, pos.y + height);
    }
  }

  Position _getHandlePositionEnum(Node<NodeData> node, bool isSource) {
    if (isSource) {
      return node.sourcePosition ?? Position.right;
    }
    return node.targetPosition ?? Position.left;
  }

  Position _getPositionFromHandleType(HandleType? handleType) {
    // For source handles, the position is typically on the right
    // For target handles, the position is typically on the left
    if (handleType == HandleType.source) {
      return Position.right;
    }
    return Position.left;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Gesture Handlers
  // ═══════════════════════════════════════════════════════════════════════════

  void _handleScaleStart(ScaleStartDetails details) {
    _lastPanPosition = details.focalPoint;
    _initialScale = _state.viewport.zoom;
    _isPanning = details.pointerCount == 1 && widget.panOnDrag;
  }

  void _handleScaleUpdate(ScaleUpdateDetails details) {
    if (_isPanning && details.pointerCount == 1) {
      // Pan
      final delta = details.focalPoint - _lastPanPosition!;
      _state.updateViewport((v) => v.copyWith(
            x: v.x + delta.dx,
            y: v.y + delta.dy,
          ));
      _lastPanPosition = details.focalPoint;
    } else if (widget.zoomOnPinch && details.pointerCount >= 2) {
      // Pinch zoom
      final newZoom = (_initialScale! * details.scale)
          .clamp(_state.minZoom, _state.maxZoom);

      // Zoom around focal point
      final focalPoint = details.localFocalPoint;
      final viewport = _state.viewport;
      final scale = newZoom / viewport.zoom;
      final newX = focalPoint.dx - (focalPoint.dx - viewport.x) * scale;
      final newY = focalPoint.dy - (focalPoint.dy - viewport.y) * scale;

      _state.setViewport(Viewport(x: newX, y: newY, zoom: newZoom));
    }
  }

  void _handleScaleEnd(ScaleEndDetails details) {
    _lastPanPosition = null;
    _initialScale = null;
    _isPanning = false;
  }

  void _handleDoubleTap() {
    final currentZoom = _state.viewport.zoom;
    final targetZoom = currentZoom < 1.5 ? 2.0 : 1.0;
    _controller.zoomTo(
      targetZoom.clamp(_state.minZoom, _state.maxZoom),
      duration: const Duration(milliseconds: 300),
    );
  }

  void _handlePointerSignal(PointerSignalEvent event) {
    if (event is PointerScrollEvent && widget.zoomOnScroll) {
      // Zoom with scroll wheel
      final delta = event.scrollDelta.dy;
      final zoomFactor = delta > 0 ? 0.9 : 1.1;
      _controller.zoomTo(
        (_state.viewport.zoom * zoomFactor)
            .clamp(_state.minZoom, _state.maxZoom),
        center: event.localPosition,
      );
    }
  }

  KeyEventResult _handleKeyEvent(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;

    final isCtrlPressed = HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.controlLeft) ||
        HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.controlRight) ||
        HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.metaLeft) ||
        HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.metaRight);

    final isShiftPressed = HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.shiftLeft) ||
        HardwareKeyboard.instance.logicalKeysPressed
            .contains(LogicalKeyboardKey.shiftRight);

    // Delete selected elements (Delete or Backspace)
    if (widget.deleteKeyCode != null &&
        (event.logicalKey == widget.deleteKeyCode ||
            event.logicalKey == LogicalKeyboardKey.backspace)) {
      final selectedNodes = _state.selectedNodeIds.toList();
      final selectedEdges = _state.selectedEdgeIds.toList();

      if (selectedNodes.isNotEmpty || selectedEdges.isNotEmpty) {
        _controller.deleteElements(
          nodeIds: selectedNodes,
          edgeIds: selectedEdges,
        );
        return KeyEventResult.handled;
      }
    }

    // Escape to clear selection
    if (event.logicalKey == LogicalKeyboardKey.escape) {
      _controller.clearSelection();
      return KeyEventResult.handled;
    }

    // Ctrl+A to select all
    if (isCtrlPressed && event.logicalKey == LogicalKeyboardKey.keyA) {
      _controller.selectAll();
      return KeyEventResult.handled;
    }

    // Ctrl+0 to reset zoom
    if (isCtrlPressed && event.logicalKey == LogicalKeyboardKey.digit0) {
      _controller.zoomTo(1.0, duration: const Duration(milliseconds: 200));
      return KeyEventResult.handled;
    }

    // Ctrl+= or Ctrl++ to zoom in
    if (isCtrlPressed &&
        (event.logicalKey == LogicalKeyboardKey.equal ||
            event.logicalKey == LogicalKeyboardKey.numpadAdd)) {
      _controller.zoomIn(duration: const Duration(milliseconds: 200));
      return KeyEventResult.handled;
    }

    // Ctrl+- to zoom out
    if (isCtrlPressed &&
        (event.logicalKey == LogicalKeyboardKey.minus ||
            event.logicalKey == LogicalKeyboardKey.numpadSubtract)) {
      _controller.zoomOut(duration: const Duration(milliseconds: 200));
      return KeyEventResult.handled;
    }

    // Arrow keys to move selected nodes
    if (_state.selectedNodeIds.isNotEmpty) {
      final moveAmount = isShiftPressed ? 10.0 : 1.0;
      XYPosition? delta;

      switch (event.logicalKey) {
        case LogicalKeyboardKey.arrowUp:
          delta = XYPosition(x: 0, y: -moveAmount);
        case LogicalKeyboardKey.arrowDown:
          delta = XYPosition(x: 0, y: moveAmount);
        case LogicalKeyboardKey.arrowLeft:
          delta = XYPosition(x: -moveAmount, y: 0);
        case LogicalKeyboardKey.arrowRight:
          delta = XYPosition(x: moveAmount, y: 0);
      }

      if (delta != null) {
        _moveSelectedNodes(delta);
        return KeyEventResult.handled;
      }
    }

    return KeyEventResult.ignored;
  }

  void _moveSelectedNodes(XYPosition delta) {
    final changes = <NodeChange>[];
    for (final nodeId in _state.selectedNodeIds) {
      final node = _state.nodeLookup[nodeId];
      if (node != null) {
        changes.add(NodePositionChange(
          id: nodeId,
          position: XYPosition(
            x: node.node.position.x + delta.x,
            y: node.node.position.y + delta.y,
          ),
        ));
      }
    }
    if (changes.isNotEmpty) {
      widget.onNodesChange?.call(changes);
    }
  }
}

/// Internal widget that wraps a node with drag and measure functionality.
class _NodeWrapper<NodeData, EdgeData> extends StatefulWidget {
  const _NodeWrapper({
    super.key,
    required this.node,
    this.nodeTypes,
    this.onNodeClick,
    this.onNodeDoubleClick,
    this.onNodeDragStart,
    this.onNodeDrag,
    this.onNodeDragStop,
    this.onPositionChange,
    this.onDimensionsChange,
    this.draggable = true,
    this.selectable = true,
  });

  final Node<NodeData> node;
  final Map<String, NodeBuilder<NodeData>>? nodeTypes;
  final void Function(Node<NodeData>)? onNodeClick;
  final void Function(Node<NodeData>)? onNodeDoubleClick;
  final void Function(Node<NodeData>)? onNodeDragStart;
  final void Function(Node<NodeData>, XYPosition)? onNodeDrag;
  final void Function(Node<NodeData>)? onNodeDragStop;
  final void Function(XYPosition)? onPositionChange;
  final void Function(double width, double height)? onDimensionsChange;
  final bool draggable;
  final bool selectable;

  @override
  State<_NodeWrapper<NodeData, EdgeData>> createState() =>
      _NodeWrapperState<NodeData, EdgeData>();
}

class _NodeWrapperState<NodeData, EdgeData>
    extends State<_NodeWrapper<NodeData, EdgeData>> {
  final GlobalKey _nodeKey = GlobalKey();
  Offset? _dragStart;

  @override
  void initState() {
    super.initState();
    // Measure dimensions after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _reportDimensions();
    });
  }

  void _reportDimensions() {
    final renderBox =
        _nodeKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      widget.onDimensionsChange?.call(renderBox.size.width, renderBox.size.height);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = XYFlowProvider.of<NodeData, EdgeData>(context);

    // Build the node widget
    Widget nodeWidget;
    final builder = widget.nodeTypes?[widget.node.type];
    if (builder != null) {
      nodeWidget = builder(NodeProps<NodeData>(
        id: widget.node.id,
        data: widget.node.data,
        position: widget.node.position,
        type: widget.node.type,
        selected: widget.node.selected,
        dragging: widget.node.dragging,
        width: widget.node.width,
        height: widget.node.height,
        isConnectable: widget.node.connectable,
        sourcePosition: widget.node.sourcePosition ?? Position.right,
        targetPosition: widget.node.targetPosition ?? Position.left,
        zIndex: widget.node.zIndex,
      ));
    } else {
      // Default node
      nodeWidget = DefaultNode<NodeData>(
        props: NodeProps<NodeData>(
          id: widget.node.id,
          data: widget.node.data,
          position: widget.node.position,
          type: widget.node.type,
          selected: widget.node.selected,
          dragging: widget.node.dragging,
          width: widget.node.width,
          height: widget.node.height,
        ),
      );
    }

    return NodeIdProvider(
      nodeId: widget.node.id,
      child: GestureDetector(
        onTap: () {
          if (widget.selectable) {
            state.selectNodes([widget.node.id]);
          }
          widget.onNodeClick?.call(widget.node);
        },
        onDoubleTap: () => widget.onNodeDoubleClick?.call(widget.node),
        onPanStart: widget.draggable ? _handleDragStart : null,
        onPanUpdate: widget.draggable ? _handleDragUpdate : null,
        onPanEnd: widget.draggable ? _handleDragEnd : null,
        child: Container(
          key: _nodeKey,
          child: nodeWidget,
        ),
      ),
    );
  }

  void _handleDragStart(DragStartDetails details) {
    _dragStart = details.localPosition;
    widget.onNodeDragStart?.call(widget.node);
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    if (_dragStart == null) return;

    final state = XYFlowProvider.of<NodeData, EdgeData>(context);
    final delta = details.delta / state.viewport.zoom;

    final newPosition = XYPosition(
      x: widget.node.position.x + delta.dx,
      y: widget.node.position.y + delta.dy,
    );

    widget.onPositionChange?.call(newPosition);
    widget.onNodeDrag?.call(widget.node, newPosition);
  }

  void _handleDragEnd(DragEndDetails details) {
    _dragStart = null;
    widget.onNodeDragStop?.call(widget.node);
  }
}

/// Options for fitView.
@immutable
class FitViewOptions {
  /// Creates fit view options.
  const FitViewOptions({
    this.padding = const EdgeInsets.all(10),
    this.includeHiddenNodes = false,
    this.minZoom,
    this.maxZoom,
    this.duration,
    this.nodes,
  });

  /// Padding around the fitted content.
  final EdgeInsets padding;

  /// Whether to include hidden nodes in the calculation.
  final bool includeHiddenNodes;

  /// Minimum zoom for the fit.
  final double? minZoom;

  /// Maximum zoom for the fit.
  final double? maxZoom;

  /// Animation duration.
  final Duration? duration;

  /// Specific node IDs to fit (if null, fits all nodes).
  final List<String>? nodes;
}
