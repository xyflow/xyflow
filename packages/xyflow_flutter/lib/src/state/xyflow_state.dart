import 'dart:ui' show Size;

import 'package:flutter/foundation.dart';

import '../core/types/changes.dart' as changes;
import '../core/types/connection.dart';
import '../core/types/edge.dart';
import '../core/types/handle.dart' show HandleType;
import '../core/types/node.dart';
import '../core/types/position.dart';
import '../core/types/rect.dart';
import '../core/types/viewport.dart';

/// The main state container for XYFlow.
///
/// This manages all nodes, edges, viewport, and interaction state.
/// It uses a change-based update system similar to the original xyflow.
class XYFlowState<NodeData, EdgeData> extends ChangeNotifier {
  /// Creates an XYFlow state with optional initial values.
  XYFlowState({
    List<Node<NodeData>>? nodes,
    List<Edge<EdgeData>>? edges,
    Viewport? viewport,
    double minZoom = 0.5,
    double maxZoom = 2.0,
    CoordinateExtent? translateExtent,
    CoordinateExtent? nodeExtent,
    NodeOrigin nodeOrigin = NodeOrigins.topLeft,
    (double, double)? snapGrid,
    ConnectionMode connectionMode = ConnectionMode.strict,
  })  : _nodes = List<Node<NodeData>>.from(nodes ?? []),
        _edges = List<Edge<EdgeData>>.from(edges ?? []),
        _viewport = viewport ?? const Viewport.initial(),
        _minZoom = minZoom,
        _maxZoom = maxZoom,
        _translateExtent = translateExtent,
        _nodeExtent = nodeExtent,
        _nodeOrigin = nodeOrigin,
        _snapGrid = snapGrid,
        _connectionMode = connectionMode {
    _updateLookups();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Node State
  // ═══════════════════════════════════════════════════════════════════════════

  List<Node<NodeData>> _nodes;
  final Map<String, InternalNode<NodeData>> _nodeLookup = {};
  final Map<String, Map<String, InternalNode<NodeData>>> _parentLookup = {};

  /// The list of user-provided nodes.
  List<Node<NodeData>> get nodes => List.unmodifiable(_nodes);

  /// O(1) lookup of internal nodes by ID.
  Map<String, InternalNode<NodeData>> get nodeLookup =>
      Map.unmodifiable(_nodeLookup);

  /// Parent-child hierarchy lookup.
  Map<String, Map<String, InternalNode<NodeData>>> get parentLookup =>
      Map.unmodifiable(_parentLookup);

  // ═══════════════════════════════════════════════════════════════════════════
  // Edge State
  // ═══════════════════════════════════════════════════════════════════════════

  List<Edge<EdgeData>> _edges;
  final Map<String, Edge<EdgeData>> _edgeLookup = {};
  final Map<String, Map<String, List<Connection>>> _connectionLookup = {};

  /// The list of user-provided edges.
  List<Edge<EdgeData>> get edges => List.unmodifiable(_edges);

  /// O(1) lookup of edges by ID.
  Map<String, Edge<EdgeData>> get edgeLookup => Map.unmodifiable(_edgeLookup);

  /// Connection lookup: sourceId -> targetId -> connections.
  Map<String, Map<String, List<Connection>>> get connectionLookup =>
      Map.unmodifiable(_connectionLookup);

  // ═══════════════════════════════════════════════════════════════════════════
  // Viewport State
  // ═══════════════════════════════════════════════════════════════════════════

  Viewport _viewport;
  double _minZoom;
  double _maxZoom;
  CoordinateExtent? _translateExtent;
  Size? _containerSize;

  /// The current viewport (pan/zoom).
  Viewport get viewport => _viewport;

  /// Minimum allowed zoom level.
  double get minZoom => _minZoom;

  /// Maximum allowed zoom level.
  double get maxZoom => _maxZoom;

  /// Optional bounds for panning.
  CoordinateExtent? get translateExtent => _translateExtent;

  /// The container size (for fitView calculations).
  Size? get containerSize => _containerSize;

  // ═══════════════════════════════════════════════════════════════════════════
  // Interaction State
  // ═══════════════════════════════════════════════════════════════════════════

  ConnectionState _connectionState = const ConnectionState.empty();
  final Set<String> _selectedNodeIds = {};
  final Set<String> _selectedEdgeIds = {};
  bool _isDragging = false;

  // Handle registry for connection drop detection
  final Map<String, HandleInfo> _handleRegistry = {};

  /// Current connection state (during connection creation).
  ConnectionState get connectionState => _connectionState;

  /// Registered handles for connection detection.
  Map<String, HandleInfo> get handleRegistry => Map.unmodifiable(_handleRegistry);

  /// Set of selected node IDs.
  Set<String> get selectedNodeIds => Set.unmodifiable(_selectedNodeIds);

  /// Set of selected edge IDs.
  Set<String> get selectedEdgeIds => Set.unmodifiable(_selectedEdgeIds);

  /// Whether any node is currently being dragged.
  bool get isDragging => _isDragging;

  /// Selected nodes.
  List<Node<NodeData>> get selectedNodes =>
      _nodes.where((n) => _selectedNodeIds.contains(n.id)).toList();

  /// Selected edges.
  List<Edge<EdgeData>> get selectedEdges =>
      _edges.where((e) => _selectedEdgeIds.contains(e.id)).toList();

  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  NodeOrigin _nodeOrigin;
  CoordinateExtent? _nodeExtent;
  (double, double)? _snapGrid;
  ConnectionMode _connectionMode;

  // Connection callbacks (set by XYFlow widget)
  void Function(Connection connection)? onConnect;
  void Function(OnConnectStartParams params)? onConnectStart;
  void Function(OnConnectEndParams params)? onConnectEnd;

  /// The origin point for node positioning.
  NodeOrigin get nodeOrigin => _nodeOrigin;

  /// Optional bounds for node positions.
  CoordinateExtent? get nodeExtent => _nodeExtent;

  /// Optional snap grid (x, y spacing).
  (double, double)? get snapGrid => _snapGrid;

  /// Connection validation mode.
  ConnectionMode get connectionMode => _connectionMode;

  // ═══════════════════════════════════════════════════════════════════════════
  // Node Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Sets all nodes, replacing existing ones.
  void setNodes(List<Node<NodeData>> nodes) {
    _nodes = List.from(nodes);
    _updateLookups();
    notifyListeners();
  }

  /// Adds nodes to the existing list.
  void addNodes(List<Node<NodeData>> nodes) {
    _nodes.addAll(nodes);
    _updateLookups();
    notifyListeners();
  }

  /// Gets a node by ID.
  Node<NodeData>? getNode(String id) => _nodeLookup[id]?.node;

  /// Gets an internal node by ID.
  InternalNode<NodeData>? getInternalNode(String id) => _nodeLookup[id];

  /// Updates a specific node.
  void updateNode(String id, Node<NodeData> node) {
    final index = _nodes.indexWhere((n) => n.id == id);
    if (index != -1) {
      _nodes[index] = node;
      _updateLookups();
      notifyListeners();
    }
  }

  /// Updates node data using a transformer function.
  void updateNodeData(String id, NodeData Function(NodeData) transformer) {
    final node = getNode(id);
    if (node != null) {
      final newNode = node.copyWith(data: transformer(node.data));
      updateNode(id, newNode);
    }
  }

  /// Applies a list of node changes.
  void applyNodeChanges(List<changes.NodeChange> nodeChanges) {
    _nodes = changes.applyNodeChanges<NodeData>(nodeChanges, _nodes);
    _updateLookups();
    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Edge Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Sets all edges, replacing existing ones.
  void setEdges(List<Edge<EdgeData>> edges) {
    _edges = List.from(edges);
    _updateEdgeLookups();
    notifyListeners();
  }

  /// Adds edges to the existing list.
  void addEdges(List<Edge<EdgeData>> edges) {
    _edges.addAll(edges);
    _updateEdgeLookups();
    notifyListeners();
  }

  /// Gets an edge by ID.
  Edge<EdgeData>? getEdge(String id) => _edgeLookup[id];

  /// Updates a specific edge.
  void updateEdge(String id, Edge<EdgeData> edge) {
    final index = _edges.indexWhere((e) => e.id == id);
    if (index != -1) {
      _edges[index] = edge;
      _updateEdgeLookups();
      notifyListeners();
    }
  }

  /// Applies a list of edge changes.
  void applyEdgeChanges(List<changes.EdgeChange> edgeChanges) {
    _edges = changes.applyEdgeChanges<EdgeData>(edgeChanges, _edges);
    _updateEdgeLookups();
    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Selection Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Selects nodes by ID.
  void selectNodes(List<String> ids, {bool additive = false}) {
    if (!additive) {
      _selectedNodeIds.clear();
    }
    _selectedNodeIds.addAll(ids);
    _updateNodeSelectionState();
    notifyListeners();
  }

  /// Deselects nodes by ID.
  void deselectNodes(List<String> ids) {
    _selectedNodeIds.removeAll(ids);
    _updateNodeSelectionState();
    notifyListeners();
  }

  /// Selects edges by ID.
  void selectEdges(List<String> ids, {bool additive = false}) {
    if (!additive) {
      _selectedEdgeIds.clear();
    }
    _selectedEdgeIds.addAll(ids);
    _updateEdgeSelectionState();
    notifyListeners();
  }

  /// Deselects edges by ID.
  void deselectEdges(List<String> ids) {
    _selectedEdgeIds.removeAll(ids);
    _updateEdgeSelectionState();
    notifyListeners();
  }

  /// Clears all selection.
  void clearSelection() {
    _selectedNodeIds.clear();
    _selectedEdgeIds.clear();
    _updateNodeSelectionState();
    _updateEdgeSelectionState();
    notifyListeners();
  }

  /// Toggles node selection.
  void toggleNodeSelection(String id) {
    if (_selectedNodeIds.contains(id)) {
      _selectedNodeIds.remove(id);
    } else {
      _selectedNodeIds.add(id);
    }
    _updateNodeSelectionState();
    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Viewport Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Sets the viewport.
  void setViewport(Viewport viewport) {
    _viewport = viewport;
    notifyListeners();
  }

  /// Updates the viewport using a transformer function.
  void updateViewport(Viewport Function(Viewport) transformer) {
    _viewport = transformer(_viewport);
    notifyListeners();
  }

  /// Sets zoom constraints.
  void setZoomConstraints({double? minZoom, double? maxZoom}) {
    if (minZoom != null) _minZoom = minZoom;
    if (maxZoom != null) _maxZoom = maxZoom;
    notifyListeners();
  }

  /// Sets the translate extent.
  void setTranslateExtent(CoordinateExtent? extent) {
    _translateExtent = extent;
    notifyListeners();
  }

  /// Sets the container size.
  void setContainerSize(Size size) {
    if (_containerSize != size) {
      _containerSize = size;
      notifyListeners();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Connection Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Starts a connection from a handle.
  void startConnection({
    required String nodeId,
    String? handleId,
    required HandleType handleType,
    required XYPosition position,
  }) {
    _connectionState = ConnectionState(
      startNodeId: nodeId,
      startHandleId: handleId,
      startHandleType: handleType,
      startPosition: position,
      endPosition: position,
    );
    notifyListeners();
  }

  /// Updates the connection end position.
  void updateConnection(XYPosition position, {bool? isValid}) {
    _connectionState = _connectionState.copyWith(
      endPosition: position,
      isValid: isValid,
    );
    notifyListeners();
  }

  /// Ends the current connection.
  void endConnection() {
    _connectionState = const ConnectionState.empty();
    notifyListeners();
  }

  /// Ends the current connection with a target.
  /// Returns the connection if successful, null otherwise.
  Connection? endConnectionWithTarget(XYPosition endPosition) {
    if (!_connectionState.isConnecting) return null;

    // Find a target handle at the end position
    final targetHandle = findHandleAtPosition(endPosition);

    Connection? connection;
    if (targetHandle != null) {
      // Check if it's a valid target (must be opposite type)
      final isValidTarget = _connectionState.startHandleType == HandleType.source
          ? targetHandle.handleType == HandleType.target
          : targetHandle.handleType == HandleType.source;

      // Can't connect to same node
      final isDifferentNode = targetHandle.nodeId != _connectionState.startNodeId;

      if (isValidTarget && isDifferentNode) {
        if (_connectionState.startHandleType == HandleType.source) {
          connection = Connection(
            source: _connectionState.startNodeId!,
            target: targetHandle.nodeId,
            sourceHandle: _connectionState.startHandleId,
            targetHandle: targetHandle.handleId,
          );
        } else {
          connection = Connection(
            source: targetHandle.nodeId,
            target: _connectionState.startNodeId!,
            sourceHandle: targetHandle.handleId,
            targetHandle: _connectionState.startHandleId,
          );
        }
      }
    }

    _connectionState = const ConnectionState.empty();
    notifyListeners();
    return connection;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Handle Registry
  // ═══════════════════════════════════════════════════════════════════════════

  /// Registers a handle for connection drop detection.
  void registerHandle(HandleInfo info) {
    final key = '${info.nodeId}:${info.handleId ?? 'default'}:${info.handleType.name}';
    _handleRegistry[key] = info;
  }

  /// Unregisters a handle.
  void unregisterHandle(String nodeId, String? handleId, HandleType handleType) {
    final key = '$nodeId:${handleId ?? 'default'}:${handleType.name}';
    _handleRegistry.remove(key);
  }

  /// Updates a handle's position.
  void updateHandlePosition(String nodeId, String? handleId, HandleType handleType, XYPosition position) {
    final key = '$nodeId:${handleId ?? 'default'}:${handleType.name}';
    final existing = _handleRegistry[key];
    if (existing != null) {
      _handleRegistry[key] = existing.copyWith(position: position);
    }
  }

  /// Finds a handle at the given position.
  HandleInfo? findHandleAtPosition(XYPosition position, {double tolerance = 20}) {
    for (final info in _handleRegistry.values) {
      final dx = (info.position.x - position.x).abs();
      final dy = (info.position.y - position.y).abs();
      if (dx <= tolerance && dy <= tolerance) {
        return info;
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Drag Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Sets the dragging state.
  void setDragging(bool isDragging) {
    _isDragging = isDragging;
    notifyListeners();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Delete Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /// Deletes nodes and edges by ID.
  ///
  /// Also removes edges connected to deleted nodes.
  (List<Node<NodeData>>, List<Edge<EdgeData>>) deleteElements({
    List<String>? nodeIds,
    List<String>? edgeIds,
  }) {
    final deletedNodes = <Node<NodeData>>[];
    final deletedEdges = <Edge<EdgeData>>[];

    // Collect nodes to delete
    final nodeIdsToDelete = nodeIds?.toSet() ?? {};
    for (final id in nodeIdsToDelete) {
      final node = getNode(id);
      if (node != null) {
        deletedNodes.add(node);
      }
    }

    // Collect edges to delete (including those connected to deleted nodes)
    final edgeIdsToDelete = edgeIds?.toSet() ?? {};
    for (final edge in _edges) {
      if (edgeIdsToDelete.contains(edge.id) ||
          nodeIdsToDelete.contains(edge.source) ||
          nodeIdsToDelete.contains(edge.target)) {
        deletedEdges.add(edge);
        edgeIdsToDelete.add(edge.id);
      }
    }

    // Remove nodes
    _nodes.removeWhere((n) => nodeIdsToDelete.contains(n.id));
    _selectedNodeIds.removeAll(nodeIdsToDelete);

    // Remove edges
    _edges.removeWhere((e) => edgeIdsToDelete.contains(e.id));
    _selectedEdgeIds.removeAll(edgeIdsToDelete);

    _updateLookups();
    notifyListeners();

    return (deletedNodes, deletedEdges);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Utility Methods
  // ═══════════════════════════════════════════════════════════════════════════

  /// Calculates the bounding rectangle for given nodes.
  XYRect? getNodesBounds(List<Node<NodeData>> nodes, {bool includeHidden = false}) {
    final visibleNodes = includeHidden ? nodes : nodes.where((n) => !n.hidden);
    if (visibleNodes.isEmpty) return null;

    double minX = double.infinity;
    double minY = double.infinity;
    double maxX = double.negativeInfinity;
    double maxY = double.negativeInfinity;

    for (final node in visibleNodes) {
      final internal = _nodeLookup[node.id];
      if (internal == null) continue;

      final pos = internal.positionAbsolute;
      // Use reasonable defaults (150x40) if node hasn't been measured
      final width = internal.measured?.width ?? node.width ?? 150;
      final height = internal.measured?.height ?? node.height ?? 40;

      minX = minX < pos.x ? minX : pos.x;
      minY = minY < pos.y ? minY : pos.y;
      maxX = maxX > pos.x + width ? maxX : pos.x + width;
      maxY = maxY > pos.y + height ? maxY : pos.y + height;
    }

    if (minX == double.infinity) return null;

    return XYRect(
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    );
  }

  /// Gets nodes that intersect with a rectangle.
  List<Node<NodeData>> getIntersectingNodes(XYRect rect, {bool partially = true}) {
    return _nodes.where((node) {
      final internal = _nodeLookup[node.id];
      if (internal == null) return false;

      final bounds = internal.bounds;
      if (bounds == null) return false;

      if (partially) {
        return rect.intersects(bounds);
      } else {
        return rect.containsRect(bounds);
      }
    }).toList();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Private Methods
  // ═══════════════════════════════════════════════════════════════════════════

  /// Updates all lookup maps.
  void _updateLookups() {
    _updateNodeLookups();
    _updateEdgeLookups();
  }

  /// Updates node lookup maps.
  void _updateNodeLookups() {
    // Preserve measured dimensions before clearing lookup
    final preservedMeasurements = <String, (MeasuredDimensions?, XYRect?)>{};
    for (final entry in _nodeLookup.entries) {
      preservedMeasurements[entry.key] = (
        entry.value.measured,
        entry.value.bounds,
      );
    }

    _nodeLookup.clear();
    _parentLookup.clear();

    for (final node in _nodes) {
      final positionAbsolute = _calculateAbsolutePosition(node);
      final zIndex = _calculateZIndex(node);

      // Restore preserved measurements if available
      final preserved = preservedMeasurements[node.id];
      final measured = preserved?.$1;
      // Recalculate bounds with new position but preserved dimensions
      XYRect? bounds;
      if (measured != null) {
        bounds = XYRect(
          x: positionAbsolute.x,
          y: positionAbsolute.y,
          width: measured.width,
          height: measured.height,
        );
      }

      final internal = InternalNode<NodeData>(
        node: node,
        internals: NodeInternals(
          positionAbsolute: positionAbsolute,
          z: zIndex,
          measured: measured,
          bounds: bounds,
        ),
      );

      _nodeLookup[node.id] = internal;

      // Update parent lookup
      if (node.parentId != null) {
        _parentLookup.putIfAbsent(node.parentId!, () => {});
        _parentLookup[node.parentId]![node.id] = internal;
      }
    }
  }

  /// Calculates the absolute position for a node (accounting for parent).
  XYPosition _calculateAbsolutePosition(Node<NodeData> node) {
    if (node.parentId == null) {
      return node.position;
    }

    final parent = _nodes.where((n) => n.id == node.parentId).firstOrNull;
    if (parent == null) {
      return node.position;
    }

    final parentAbsolute = _calculateAbsolutePosition(parent);
    return XYPosition(
      x: parentAbsolute.x + node.position.x,
      y: parentAbsolute.y + node.position.y,
    );
  }

  /// Calculates the z-index for a node.
  int _calculateZIndex(Node<NodeData> node) {
    if (node.zIndex != null) {
      return node.zIndex!;
    }

    // Elevate selected nodes
    if (node.selected) {
      return 1000;
    }

    return 0;
  }

  /// Updates edge lookup maps.
  void _updateEdgeLookups() {
    _edgeLookup.clear();
    _connectionLookup.clear();

    for (final edge in _edges) {
      _edgeLookup[edge.id] = edge;

      // Update connection lookup
      _connectionLookup.putIfAbsent(edge.source, () => {});
      _connectionLookup[edge.source]!.putIfAbsent(edge.target, () => []);
      _connectionLookup[edge.source]![edge.target]!.add(Connection(
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      ));
    }
  }

  /// Updates node selection state in the nodes list.
  void _updateNodeSelectionState() {
    for (var i = 0; i < _nodes.length; i++) {
      final node = _nodes[i];
      final shouldBeSelected = _selectedNodeIds.contains(node.id);
      if (node.selected != shouldBeSelected) {
        _nodes[i] = node.copyWith(selected: shouldBeSelected);
      }
    }
    _updateNodeLookups();
  }

  /// Updates edge selection state in the edges list.
  void _updateEdgeSelectionState() {
    for (var i = 0; i < _edges.length; i++) {
      final edge = _edges[i];
      final shouldBeSelected = _selectedEdgeIds.contains(edge.id);
      if (edge.selected != shouldBeSelected) {
        _edges[i] = edge.copyWith(selected: shouldBeSelected);
      }
    }
    _updateEdgeLookups();
  }

  /// Reports measured dimensions for a node.
  void reportNodeDimensions(String id, double width, double height) {
    final internal = _nodeLookup[id];
    if (internal == null) return;

    final measured = MeasuredDimensions(width: width, height: height);
    final bounds = XYRect(
      x: internal.positionAbsolute.x,
      y: internal.positionAbsolute.y,
      width: width,
      height: height,
    );

    _nodeLookup[id] = internal.copyWith(
      internals: internal.internals.copyWith(
        measured: measured,
        bounds: bounds,
      ),
    );

    notifyListeners();
  }
}
