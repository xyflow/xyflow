import 'package:flutter/foundation.dart';

import 'edge.dart';
import 'node.dart';
import 'position.dart';

/// Base class for all node changes.
///
/// Node changes are used to update nodes in a controlled, traceable way.
/// This enables features like undo/redo and change validation.
@immutable
sealed class NodeChange {
  /// Creates a node change.
  const NodeChange({required this.id});

  /// The ID of the node being changed.
  final String id;
}

/// Change representing a node position update.
@immutable
class NodePositionChange extends NodeChange {
  /// Creates a position change.
  const NodePositionChange({
    required super.id,
    this.position,
    this.positionAbsolute,
    this.dragging,
  });

  /// The new relative position.
  final XYPosition? position;

  /// The new absolute position (computed).
  final XYPosition? positionAbsolute;

  /// Whether the node is currently being dragged.
  final bool? dragging;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodePositionChange &&
        other.id == id &&
        other.position == position &&
        other.positionAbsolute == positionAbsolute &&
        other.dragging == dragging;
  }

  @override
  int get hashCode => Object.hash(id, position, positionAbsolute, dragging);

  @override
  String toString() =>
      'NodePositionChange(id: $id, position: $position, dragging: $dragging)';
}

/// Change representing a node dimension update.
@immutable
class NodeDimensionChange extends NodeChange {
  /// Creates a dimension change.
  const NodeDimensionChange({
    required super.id,
    this.dimensions,
    this.setAttributes = false,
  });

  /// The new dimensions.
  final MeasuredDimensions? dimensions;

  /// Whether to set width/height as node attributes.
  final bool setAttributes;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodeDimensionChange &&
        other.id == id &&
        other.dimensions == dimensions &&
        other.setAttributes == setAttributes;
  }

  @override
  int get hashCode => Object.hash(id, dimensions, setAttributes);

  @override
  String toString() =>
      'NodeDimensionChange(id: $id, dimensions: $dimensions)';
}

/// Change representing a node selection state update.
@immutable
class NodeSelectionChange extends NodeChange {
  /// Creates a selection change.
  const NodeSelectionChange({
    required super.id,
    required this.selected,
  });

  /// The new selection state.
  final bool selected;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodeSelectionChange &&
        other.id == id &&
        other.selected == selected;
  }

  @override
  int get hashCode => Object.hash(id, selected);

  @override
  String toString() => 'NodeSelectionChange(id: $id, selected: $selected)';
}

/// Change representing a node removal.
@immutable
class NodeRemoveChange extends NodeChange {
  /// Creates a remove change.
  const NodeRemoveChange({required super.id});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodeRemoveChange && other.id == id;
  }

  @override
  int get hashCode => Object.hash('remove', id);

  @override
  String toString() => 'NodeRemoveChange(id: $id)';
}

/// Change representing a new node being added.
@immutable
class NodeAddChange<T> extends NodeChange {
  /// Creates an add change.
  NodeAddChange({
    required this.node,
  }) : super(id: node.id);

  /// The node to add.
  final Node<T> node;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodeAddChange<T> && other.node == node;
  }

  @override
  int get hashCode => Object.hash('add', node);

  @override
  String toString() => 'NodeAddChange(node: $node)';
}

/// Change representing a node replacement.
@immutable
class NodeReplaceChange<T> extends NodeChange {
  /// Creates a replace change.
  const NodeReplaceChange({
    required super.id,
    required this.node,
  });

  /// The new node to replace with.
  final Node<T> node;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is NodeReplaceChange<T> &&
        other.id == id &&
        other.node == node;
  }

  @override
  int get hashCode => Object.hash('replace', id, node);

  @override
  String toString() => 'NodeReplaceChange(id: $id, node: $node)';
}

// ════════════════════════════════════════════════════════════════════════════
// Edge Changes
// ════════════════════════════════════════════════════════════════════════════

/// Base class for all edge changes.
@immutable
sealed class EdgeChange {
  /// Creates an edge change.
  const EdgeChange({required this.id});

  /// The ID of the edge being changed.
  final String id;
}

/// Change representing an edge selection state update.
@immutable
class EdgeSelectionChange extends EdgeChange {
  /// Creates a selection change.
  const EdgeSelectionChange({
    required super.id,
    required this.selected,
  });

  /// The new selection state.
  final bool selected;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgeSelectionChange &&
        other.id == id &&
        other.selected == selected;
  }

  @override
  int get hashCode => Object.hash(id, selected);

  @override
  String toString() => 'EdgeSelectionChange(id: $id, selected: $selected)';
}

/// Change representing an edge removal.
@immutable
class EdgeRemoveChange extends EdgeChange {
  /// Creates a remove change.
  const EdgeRemoveChange({required super.id});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgeRemoveChange && other.id == id;
  }

  @override
  int get hashCode => Object.hash('remove', id);

  @override
  String toString() => 'EdgeRemoveChange(id: $id)';
}

/// Change representing a new edge being added.
@immutable
class EdgeAddChange<T> extends EdgeChange {
  /// Creates an add change.
  EdgeAddChange({
    required this.edge,
  }) : super(id: edge.id);

  /// The edge to add.
  final Edge<T> edge;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgeAddChange<T> && other.edge == edge;
  }

  @override
  int get hashCode => Object.hash('add', edge);

  @override
  String toString() => 'EdgeAddChange(edge: $edge)';
}

/// Change representing an edge replacement.
@immutable
class EdgeReplaceChange<T> extends EdgeChange {
  /// Creates a replace change.
  const EdgeReplaceChange({
    required super.id,
    required this.edge,
  });

  /// The new edge to replace with.
  final Edge<T> edge;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgeReplaceChange<T> && other.id == id && other.edge == edge;
  }

  @override
  int get hashCode => Object.hash('replace', id, edge);

  @override
  String toString() => 'EdgeReplaceChange(id: $id, edge: $edge)';
}

// ════════════════════════════════════════════════════════════════════════════
// Change Application Functions
// ════════════════════════════════════════════════════════════════════════════

/// Applies a list of node changes to the nodes list.
///
/// This is a pure function that returns a new list without modifying the input.
List<Node<T>> applyNodeChanges<T>(
  List<NodeChange> changes,
  List<Node<T>> nodes,
) {
  // Create a mutable copy
  final result = List<Node<T>>.from(nodes);
  final nodeMap = {for (final node in result) node.id: node};

  for (final change in changes) {
    switch (change) {
      case NodePositionChange():
        final node = nodeMap[change.id];
        if (node != null) {
          final index = result.indexWhere((n) => n.id == change.id);
          if (index != -1) {
            result[index] = node.copyWith(
              position: change.position ?? node.position,
              dragging: change.dragging ?? node.dragging,
            );
            nodeMap[change.id] = result[index];
          }
        }

      case NodeDimensionChange():
        final node = nodeMap[change.id];
        if (node != null && change.dimensions != null) {
          final index = result.indexWhere((n) => n.id == change.id);
          if (index != -1) {
            result[index] = node.copyWith(
              width: change.setAttributes ? change.dimensions!.width : node.width,
              height: change.setAttributes ? change.dimensions!.height : node.height,
            );
            nodeMap[change.id] = result[index];
          }
        }

      case NodeSelectionChange():
        final node = nodeMap[change.id];
        if (node != null) {
          final index = result.indexWhere((n) => n.id == change.id);
          if (index != -1) {
            result[index] = node.copyWith(selected: change.selected);
            nodeMap[change.id] = result[index];
          }
        }

      case NodeRemoveChange():
        result.removeWhere((n) => n.id == change.id);
        nodeMap.remove(change.id);

      case NodeAddChange<T>():
        if (!nodeMap.containsKey(change.node.id)) {
          result.add(change.node);
          nodeMap[change.node.id] = change.node;
        }

      case NodeReplaceChange<T>():
        final index = result.indexWhere((n) => n.id == change.id);
        if (index != -1) {
          result[index] = change.node;
          nodeMap[change.id] = change.node;
        }

      case NodeAddChange():
        // Handle non-matching generic type - skip
        break;

      case NodeReplaceChange():
        // Handle non-matching generic type - skip
        break;
    }
  }

  return result;
}

/// Applies a list of edge changes to the edges list.
///
/// This is a pure function that returns a new list without modifying the input.
List<Edge<T>> applyEdgeChanges<T>(
  List<EdgeChange> changes,
  List<Edge<T>> edges,
) {
  // Create a mutable copy
  final result = List<Edge<T>>.from(edges);
  final edgeMap = {for (final edge in result) edge.id: edge};

  for (final change in changes) {
    switch (change) {
      case EdgeSelectionChange():
        final edge = edgeMap[change.id];
        if (edge != null) {
          final index = result.indexWhere((e) => e.id == change.id);
          if (index != -1) {
            result[index] = edge.copyWith(selected: change.selected);
            edgeMap[change.id] = result[index];
          }
        }

      case EdgeRemoveChange():
        result.removeWhere((e) => e.id == change.id);
        edgeMap.remove(change.id);

      case EdgeAddChange<T>():
        if (!edgeMap.containsKey(change.edge.id)) {
          result.add(change.edge);
          edgeMap[change.edge.id] = change.edge;
        }

      case EdgeReplaceChange<T>():
        final index = result.indexWhere((e) => e.id == change.id);
        if (index != -1) {
          result[index] = change.edge;
          edgeMap[change.id] = change.edge;
        }

      case EdgeAddChange():
        // Handle non-matching generic type - skip
        break;

      case EdgeReplaceChange():
        // Handle non-matching generic type - skip
        break;
    }
  }

  return result;
}
