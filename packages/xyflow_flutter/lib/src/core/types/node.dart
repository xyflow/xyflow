import 'package:flutter/foundation.dart';

import 'handle.dart';
import 'position.dart';
import 'rect.dart';
import 'viewport.dart';

/// The origin point for node positioning.
///
/// Determines which point of the node corresponds to its position coordinates.
typedef NodeOrigin = (double x, double y);

/// Common node origins.
class NodeOrigins {
  NodeOrigins._();

  /// Node position is at the top-left corner (default).
  static const NodeOrigin topLeft = (0.0, 0.0);

  /// Node position is at the center.
  static const NodeOrigin center = (0.5, 0.5);

  /// Node position is at the top-center.
  static const NodeOrigin topCenter = (0.5, 0.0);

  /// Node position is at the bottom-center.
  static const NodeOrigin bottomCenter = (0.5, 1.0);
}

/// Represents a node in the flow diagram.
///
/// Generic type [T] represents the data payload type for this node.
@immutable
class Node<T> {
  /// Creates a node with the given properties.
  const Node({
    required this.id,
    required this.position,
    required this.data,
    this.type,
    this.width,
    this.height,
    this.selected = false,
    this.dragging = false,
    this.hidden = false,
    this.draggable = true,
    this.selectable = true,
    this.connectable = true,
    this.deletable = true,
    this.focusable = true,
    this.parentId,
    this.extent,
    this.expandParent = false,
    this.origin,
    this.sourcePosition,
    this.targetPosition,
    this.zIndex,
    this.ariaLabel,
    this.handles,
    this.className,
    this.style,
  });

  /// Unique identifier for this node.
  final String id;

  /// The position of this node on the canvas.
  final XYPosition position;

  /// The data payload for this node.
  final T data;

  /// The type of node, used to look up the widget builder.
  final String? type;

  /// The width of the node. If not specified, measured from rendered widget.
  final double? width;

  /// The height of the node. If not specified, measured from rendered widget.
  final double? height;

  /// Whether this node is currently selected.
  final bool selected;

  /// Whether this node is currently being dragged.
  final bool dragging;

  /// Whether this node is hidden.
  final bool hidden;

  /// Whether this node can be dragged.
  final bool draggable;

  /// Whether this node can be selected.
  final bool selectable;

  /// Whether this node can have connections.
  final bool connectable;

  /// Whether this node can be deleted.
  final bool deletable;

  /// Whether this node can receive focus.
  final bool focusable;

  /// The ID of the parent node (for nested/grouped nodes).
  final String? parentId;

  /// The extent (bounds) that constrains this node's movement.
  final CoordinateExtent? extent;

  /// Whether to expand the parent node when this node is dragged to its edge.
  final bool expandParent;

  /// The origin point for positioning (0,0 = top-left, 0.5,0.5 = center).
  final NodeOrigin? origin;

  /// Default position for source handles.
  final Position? sourcePosition;

  /// Default position for target handles.
  final Position? targetPosition;

  /// The z-index for stacking order.
  final int? zIndex;

  /// Accessibility label for the node.
  final String? ariaLabel;

  /// Pre-defined handles for this node.
  final List<Handle>? handles;

  /// CSS class name (used for interop with web).
  final String? className;

  /// Inline style (used for interop with web).
  final Map<String, dynamic>? style;

  /// Creates a copy of this node with the given fields replaced.
  Node<T> copyWith({
    String? id,
    XYPosition? position,
    T? data,
    String? type,
    double? width,
    double? height,
    bool? selected,
    bool? dragging,
    bool? hidden,
    bool? draggable,
    bool? selectable,
    bool? connectable,
    bool? deletable,
    bool? focusable,
    String? parentId,
    CoordinateExtent? extent,
    bool? expandParent,
    NodeOrigin? origin,
    Position? sourcePosition,
    Position? targetPosition,
    int? zIndex,
    String? ariaLabel,
    List<Handle>? handles,
    String? className,
    Map<String, dynamic>? style,
  }) {
    return Node<T>(
      id: id ?? this.id,
      position: position ?? this.position,
      data: data ?? this.data,
      type: type ?? this.type,
      width: width ?? this.width,
      height: height ?? this.height,
      selected: selected ?? this.selected,
      dragging: dragging ?? this.dragging,
      hidden: hidden ?? this.hidden,
      draggable: draggable ?? this.draggable,
      selectable: selectable ?? this.selectable,
      connectable: connectable ?? this.connectable,
      deletable: deletable ?? this.deletable,
      focusable: focusable ?? this.focusable,
      parentId: parentId ?? this.parentId,
      extent: extent ?? this.extent,
      expandParent: expandParent ?? this.expandParent,
      origin: origin ?? this.origin,
      sourcePosition: sourcePosition ?? this.sourcePosition,
      targetPosition: targetPosition ?? this.targetPosition,
      zIndex: zIndex ?? this.zIndex,
      ariaLabel: ariaLabel ?? this.ariaLabel,
      handles: handles ?? this.handles,
      className: className ?? this.className,
      style: style ?? this.style,
    );
  }

  /// Converts this node to a JSON map.
  ///
  /// Note: The [data] field must be JSON-serializable.
  Map<String, dynamic> toJson() => {
        'id': id,
        'position': position.toJson(),
        'data': data,
        if (type != null) 'type': type,
        if (width != null) 'width': width,
        if (height != null) 'height': height,
        if (selected) 'selected': selected,
        if (dragging) 'dragging': dragging,
        if (hidden) 'hidden': hidden,
        if (!draggable) 'draggable': draggable,
        if (!selectable) 'selectable': selectable,
        if (!connectable) 'connectable': connectable,
        if (!deletable) 'deletable': deletable,
        if (!focusable) 'focusable': focusable,
        if (parentId != null) 'parentId': parentId,
        if (extent != null) 'extent': extent!.toJson(),
        if (expandParent) 'expandParent': expandParent,
        if (origin != null) 'origin': [origin!.$1, origin!.$2],
        if (sourcePosition != null) 'sourcePosition': sourcePosition!.name,
        if (targetPosition != null) 'targetPosition': targetPosition!.name,
        if (zIndex != null) 'zIndex': zIndex,
        if (ariaLabel != null) 'ariaLabel': ariaLabel,
        if (handles != null) 'handles': handles!.map((h) => h.toJson()).toList(),
        if (className != null) 'className': className,
        if (style != null) 'style': style,
      };

  /// Creates a node from a JSON map.
  static Node<T> fromJson<T>(
    Map<String, dynamic> json, {
    T Function(dynamic)? dataParser,
  }) {
    final originList = json['origin'] as List<dynamic>?;
    return Node<T>(
      id: json['id'] as String,
      position: XYPosition.fromJson(json['position'] as Map<String, dynamic>),
      data: dataParser != null ? dataParser(json['data']) : json['data'] as T,
      type: json['type'] as String?,
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      selected: json['selected'] as bool? ?? false,
      dragging: json['dragging'] as bool? ?? false,
      hidden: json['hidden'] as bool? ?? false,
      draggable: json['draggable'] as bool? ?? true,
      selectable: json['selectable'] as bool? ?? true,
      connectable: json['connectable'] as bool? ?? true,
      deletable: json['deletable'] as bool? ?? true,
      focusable: json['focusable'] as bool? ?? true,
      parentId: json['parentId'] as String?,
      extent: json['extent'] != null
          ? CoordinateExtent.fromJson(json['extent'] as Map<String, dynamic>)
          : null,
      expandParent: json['expandParent'] as bool? ?? false,
      origin: originList != null
          ? ((originList[0] as num).toDouble(), (originList[1] as num).toDouble())
          : null,
      sourcePosition: json['sourcePosition'] != null
          ? Position.values.byName(json['sourcePosition'] as String)
          : null,
      targetPosition: json['targetPosition'] != null
          ? Position.values.byName(json['targetPosition'] as String)
          : null,
      zIndex: json['zIndex'] as int?,
      ariaLabel: json['ariaLabel'] as String?,
      handles: (json['handles'] as List<dynamic>?)
          ?.map((h) => Handle.fromJson(h as Map<String, dynamic>))
          .toList(),
      className: json['className'] as String?,
      style: json['style'] as Map<String, dynamic>?,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Node<T> && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'Node(id: $id, position: $position, type: $type)';
}

/// Internal representation of a node with computed properties.
///
/// This extends the user-provided [Node] with runtime state like absolute
/// position, z-index, and handle bounds.
@immutable
class InternalNode<T> {
  /// Creates an internal node.
  const InternalNode({
    required this.node,
    required this.internals,
  });

  /// The underlying user node.
  final Node<T> node;

  /// Computed internal properties.
  final NodeInternals internals;

  // Delegate getters to the underlying node
  String get id => node.id;
  XYPosition get position => node.position;
  T get data => node.data;
  String? get type => node.type;
  double? get width => node.width;
  double? get height => node.height;
  bool get selected => node.selected;
  bool get dragging => node.dragging;
  bool get hidden => node.hidden;
  bool get draggable => node.draggable;
  bool get selectable => node.selectable;
  bool get connectable => node.connectable;
  bool get deletable => node.deletable;
  String? get parentId => node.parentId;

  /// The absolute position of this node (accounting for parent hierarchy).
  XYPosition get positionAbsolute => internals.positionAbsolute;

  /// The z-index for rendering order.
  int get z => internals.z;

  /// The measured bounds of this node.
  XYRect? get bounds => internals.bounds;

  /// The handle bounds for this node.
  HandleBounds? get handleBounds => internals.handleBounds;

  /// The measured dimensions of this node.
  MeasuredDimensions? get measured => internals.measured;

  /// Creates a copy with updated fields.
  InternalNode<T> copyWith({
    Node<T>? node,
    NodeInternals? internals,
  }) {
    return InternalNode<T>(
      node: node ?? this.node,
      internals: internals ?? this.internals,
    );
  }

  /// Converts the internal node back to a user node.
  Node<T> toNode() => node;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is InternalNode<T> && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() =>
      'InternalNode(id: $id, positionAbsolute: $positionAbsolute, z: $z)';
}

/// Internal computed properties for a node.
@immutable
class NodeInternals {
  /// Creates node internals.
  const NodeInternals({
    required this.positionAbsolute,
    this.z = 0,
    this.bounds,
    this.handleBounds,
    this.measured,
  });

  /// The absolute position on the canvas (accounting for parent hierarchy).
  final XYPosition positionAbsolute;

  /// The z-index for rendering order.
  final int z;

  /// The bounding rectangle of this node.
  final XYRect? bounds;

  /// The bounds of handles attached to this node.
  final HandleBounds? handleBounds;

  /// The measured dimensions from the rendered widget.
  final MeasuredDimensions? measured;

  /// Creates a copy with updated fields.
  NodeInternals copyWith({
    XYPosition? positionAbsolute,
    int? z,
    XYRect? bounds,
    HandleBounds? handleBounds,
    MeasuredDimensions? measured,
  }) {
    return NodeInternals(
      positionAbsolute: positionAbsolute ?? this.positionAbsolute,
      z: z ?? this.z,
      bounds: bounds ?? this.bounds,
      handleBounds: handleBounds ?? this.handleBounds,
      measured: measured ?? this.measured,
    );
  }
}

/// Measured dimensions of a rendered node.
@immutable
class MeasuredDimensions {
  /// Creates measured dimensions.
  const MeasuredDimensions({
    required this.width,
    required this.height,
  });

  /// The measured width.
  final double width;

  /// The measured height.
  final double height;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MeasuredDimensions &&
        other.width == width &&
        other.height == height;
  }

  @override
  int get hashCode => Object.hash(width, height);
}
