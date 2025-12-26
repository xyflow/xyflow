import 'dart:ui';

import 'package:flutter/animation.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart' show EdgeInsets;

import '../core/types/edge.dart';
import '../core/types/node.dart';
import '../core/types/rect.dart';
import '../core/types/viewport.dart';
import 'xyflow_state.dart';

/// Controller for interacting with XYFlow.
///
/// This provides the public API for manipulating nodes, edges, and viewport,
/// similar to the `useReactFlow()` hook in the React version.
class XYFlowController<NodeData, EdgeData> {
  /// Creates a controller with the given state.
  XYFlowController({
    required XYFlowState<NodeData, EdgeData> state,
    TickerProvider? vsync,
  })  : _state = state,
        _vsync = vsync;

  final XYFlowState<NodeData, EdgeData> _state;
  final TickerProvider? _vsync;
  AnimationController? _animationController;

  /// The underlying state.
  XYFlowState<NodeData, EdgeData> get state => _state;

  // ═══════════════════════════════════════════════════════════════════════════
  // NODE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Gets all nodes.
  List<Node<NodeData>> getNodes() => _state.nodes;

  /// Gets a specific node by ID.
  Node<NodeData>? getNode(String id) => _state.getNode(id);

  /// Gets an internal node by ID.
  InternalNode<NodeData>? getInternalNode(String id) =>
      _state.getInternalNode(id);

  /// Sets all nodes, replacing existing ones.
  void setNodes(List<Node<NodeData>> nodes) => _state.setNodes(nodes);

  /// Adds nodes to the existing list.
  void addNodes(List<Node<NodeData>> nodes) => _state.addNodes(nodes);

  /// Updates a specific node.
  void updateNode(String id, Node<NodeData> Function(Node<NodeData>) updater) {
    final node = getNode(id);
    if (node != null) {
      _state.updateNode(id, updater(node));
    }
  }

  /// Updates only the data of a node.
  void updateNodeData(String id, NodeData Function(NodeData) updater) =>
      _state.updateNodeData(id, updater);

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Gets all edges.
  List<Edge<EdgeData>> getEdges() => _state.edges;

  /// Gets a specific edge by ID.
  Edge<EdgeData>? getEdge(String id) => _state.getEdge(id);

  /// Sets all edges, replacing existing ones.
  void setEdges(List<Edge<EdgeData>> edges) => _state.setEdges(edges);

  /// Adds edges to the existing list.
  void addEdges(List<Edge<EdgeData>> edges) => _state.addEdges(edges);

  /// Updates a specific edge.
  void updateEdge(String id, Edge<EdgeData> Function(Edge<EdgeData>) updater) {
    final edge = getEdge(id);
    if (edge != null) {
      _state.updateEdge(id, updater(edge));
    }
  }

  /// Updates only the data of an edge.
  void updateEdgeData<T>(String id, T Function(T) updater) {
    final edge = getEdge(id);
    if (edge != null && edge.data != null) {
      _state.updateEdge(
        id,
        edge.copyWith(data: updater(edge.data as T) as EdgeData?),
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Deletes nodes and edges by ID.
  ///
  /// Returns the deleted nodes and edges.
  DeleteResult<NodeData, EdgeData> deleteElements({
    List<String>? nodeIds,
    List<String>? edgeIds,
  }) {
    final (deletedNodes, deletedEdges) = _state.deleteElements(
      nodeIds: nodeIds,
      edgeIds: edgeIds,
    );
    return DeleteResult(
      deletedNodes: deletedNodes,
      deletedEdges: deletedEdges,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIEWPORT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Gets the current viewport.
  Viewport getViewport() => _state.viewport;

  /// Gets the current zoom level.
  double getZoom() => _state.viewport.zoom;

  /// Sets the viewport.
  void setViewport(Viewport viewport, {Duration? duration}) {
    if (duration != null && duration > Duration.zero) {
      _animateViewport(viewport, duration);
    } else {
      _state.setViewport(viewport);
    }
  }

  /// Zooms in by a factor.
  void zoomIn({double factor = 1.2, Duration? duration}) {
    final currentZoom = _state.viewport.zoom;
    final newZoom = (currentZoom * factor).clamp(_state.minZoom, _state.maxZoom);
    zoomTo(newZoom, duration: duration);
  }

  /// Zooms out by a factor.
  void zoomOut({double factor = 1.2, Duration? duration}) {
    final currentZoom = _state.viewport.zoom;
    final newZoom = (currentZoom / factor).clamp(_state.minZoom, _state.maxZoom);
    zoomTo(newZoom, duration: duration);
  }

  /// Zooms to a specific level.
  void zoomTo(double zoom, {Offset? center, Duration? duration}) {
    final clampedZoom = zoom.clamp(_state.minZoom, _state.maxZoom);

    if (center != null) {
      // Zoom around a focal point
      final viewport = _state.viewport;
      final scale = clampedZoom / viewport.zoom;
      final newX = center.dx - (center.dx - viewport.x) * scale;
      final newY = center.dy - (center.dy - viewport.y) * scale;

      setViewport(
        Viewport(x: newX, y: newY, zoom: clampedZoom),
        duration: duration,
      );
    } else {
      setViewport(
        _state.viewport.copyWith(zoom: clampedZoom),
        duration: duration,
      );
    }
  }

  /// Fits all nodes in view.
  void fitView({
    EdgeInsets padding = const EdgeInsets.all(10),
    bool includeHiddenNodes = false,
    double? minZoom,
    double? maxZoom,
    Duration? duration,
    List<String>? nodeIds,
  }) {
    final nodes = nodeIds != null
        ? nodeIds.map((id) => getNode(id)).whereType<Node<NodeData>>().toList()
        : getNodes();

    final bounds = _state.getNodesBounds(nodes, includeHidden: includeHiddenNodes);
    if (bounds == null) return;

    fitBounds(
      bounds,
      padding: padding,
      minZoom: minZoom,
      maxZoom: maxZoom,
      duration: duration,
    );
  }

  /// Fits specific bounds in view.
  void fitBounds(
    XYRect bounds, {
    EdgeInsets? padding,
    double? minZoom,
    double? maxZoom,
    Duration? duration,
  }) {
    // This would need the actual viewport size to calculate properly
    // For now, we'll use a simplified version
    final effectivePadding = padding ?? const EdgeInsets.all(10);
    final effectiveMinZoom = minZoom ?? _state.minZoom;
    final effectiveMaxZoom = maxZoom ?? _state.maxZoom;

    // Calculate zoom to fit bounds
    // This is a simplified calculation - full implementation would need viewport dimensions
    final zoom = effectiveMaxZoom.clamp(effectiveMinZoom, effectiveMaxZoom);

    // Center on bounds
    final centerX = bounds.x + bounds.width / 2;
    final centerY = bounds.y + bounds.height / 2;

    setViewport(
      Viewport(
        x: -centerX * zoom + effectivePadding.left,
        y: -centerY * zoom + effectivePadding.top,
        zoom: zoom,
      ),
      duration: duration,
    );
  }

  /// Centers the view on a specific position.
  void setCenter(double x, double y, {double? zoom, Duration? duration}) {
    final effectiveZoom = zoom ?? _state.viewport.zoom;

    // This would need viewport size for proper centering
    // Simplified version centers at origin offset
    setViewport(
      Viewport(
        x: -x * effectiveZoom,
        y: -y * effectiveZoom,
        zoom: effectiveZoom,
      ),
      duration: duration,
    );
  }

  /// Converts screen coordinates to canvas coordinates.
  Offset project(Offset screenPosition) {
    return _state.viewport.screenToCanvas(screenPosition);
  }

  /// Converts screen coordinates to flow coordinates.
  Offset screenToFlow(Offset screenPosition) {
    return _state.viewport.screenToCanvas(screenPosition);
  }

  /// Converts flow coordinates to screen coordinates.
  Offset flowToScreen(Offset flowPosition) {
    return _state.viewport.canvasToScreen(flowPosition);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERSECTION & BOUNDS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Gets the bounds of specified nodes.
  XYRect? getNodesBounds(
    List<Node<NodeData>> nodes, {
    bool includeHidden = false,
  }) {
    return _state.getNodesBounds(nodes, includeHidden: includeHidden);
  }

  /// Gets nodes that intersect with a rectangle.
  List<Node<NodeData>> getIntersectingNodes(
    XYRect rect, {
    bool partially = true,
  }) {
    return _state.getIntersectingNodes(rect, partially: partially);
  }

  /// Checks if a node intersects with a rectangle.
  bool isNodeIntersecting(
    String nodeId,
    XYRect rect, {
    bool partially = true,
  }) {
    final internal = getInternalNode(nodeId);
    if (internal == null) return false;

    final bounds = internal.bounds;
    if (bounds == null) return false;

    if (partially) {
      return rect.intersects(bounds);
    } else {
      return rect.containsRect(bounds);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SELECTION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Selects nodes by ID.
  void selectNodes(List<String> ids, {bool additive = false}) =>
      _state.selectNodes(ids, additive: additive);

  /// Deselects nodes by ID.
  void deselectNodes(List<String> ids) => _state.deselectNodes(ids);

  /// Selects edges by ID.
  void selectEdges(List<String> ids, {bool additive = false}) =>
      _state.selectEdges(ids, additive: additive);

  /// Deselects edges by ID.
  void deselectEdges(List<String> ids) => _state.deselectEdges(ids);

  /// Clears all selection.
  void clearSelection() => _state.clearSelection();

  /// Selects all nodes and edges.
  void selectAll() {
    _state.selectNodes(_state.nodes.map((n) => n.id).toList());
    _state.selectEdges(_state.edges.map((e) => e.id).toList(), additive: true);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SERIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /// Exports the flow state as a serializable object.
  XYFlowObject<NodeData, EdgeData> toObject() {
    return XYFlowObject(
      nodes: getNodes(),
      edges: getEdges(),
      viewport: getViewport(),
    );
  }

  /// Exports the flow as JSON.
  ///
  /// Note: Node and edge data must be JSON-serializable.
  Map<String, dynamic> toJson() {
    return {
      'nodes': getNodes().map((n) => n.toJson()).toList(),
      'edges': getEdges().map((e) => e.toJson()).toList(),
      'viewport': getViewport().toJson(),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Animates the viewport to a target value.
  void _animateViewport(Viewport target, Duration duration) {
    if (_vsync == null) {
      // No ticker, just set immediately
      _state.setViewport(target);
      return;
    }

    _animationController?.dispose();
    _animationController = AnimationController(
      vsync: _vsync!,
      duration: duration,
    );

    final startViewport = _state.viewport;

    _animationController!.addListener(() {
      final t = _animationController!.value;
      _state.setViewport(Viewport(
        x: _lerp(startViewport.x, target.x, t),
        y: _lerp(startViewport.y, target.y, t),
        zoom: _lerp(startViewport.zoom, target.zoom, t),
      ));
    });

    _animationController!.forward();
  }

  /// Linear interpolation.
  double _lerp(double a, double b, double t) => a + (b - a) * t;

  /// Disposes resources.
  void dispose() {
    _animationController?.dispose();
  }
}

/// Result of a delete operation.
@immutable
class DeleteResult<NodeData, EdgeData> {
  /// Creates a delete result.
  const DeleteResult({
    required this.deletedNodes,
    required this.deletedEdges,
  });

  /// The deleted nodes.
  final List<Node<NodeData>> deletedNodes;

  /// The deleted edges.
  final List<Edge<EdgeData>> deletedEdges;
}

/// Serializable representation of flow state.
@immutable
class XYFlowObject<NodeData, EdgeData> {
  /// Creates an XYFlow object.
  const XYFlowObject({
    required this.nodes,
    required this.edges,
    required this.viewport,
  });

  /// The nodes.
  final List<Node<NodeData>> nodes;

  /// The edges.
  final List<Edge<EdgeData>> edges;

  /// The viewport.
  final Viewport viewport;
}
