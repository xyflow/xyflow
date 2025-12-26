import 'package:flutter/foundation.dart';

import 'marker.dart';
import 'position.dart';

/// Represents an edge (connection) between two nodes.
///
/// Generic type [T] represents the data payload type for this edge.
@immutable
class Edge<T> {
  /// Creates an edge with the given properties.
  const Edge({
    required this.id,
    required this.source,
    required this.target,
    this.sourceHandle,
    this.targetHandle,
    this.type,
    this.data,
    this.animated = false,
    this.selected = false,
    this.hidden = false,
    this.deletable = true,
    this.selectable = true,
    this.focusable = true,
    this.reconnectable,
    this.markerStart,
    this.markerEnd,
    this.label,
    this.labelStyle,
    this.labelShowBg = true,
    this.labelBgStyle,
    this.labelBgPadding,
    this.labelBgBorderRadius,
    this.zIndex,
    this.ariaLabel,
    this.interactionWidth,
    this.className,
    this.style,
  });

  /// Unique identifier for this edge.
  final String id;

  /// The ID of the source node.
  final String source;

  /// The ID of the target node.
  final String target;

  /// The ID of the source handle (if the source node has multiple handles).
  final String? sourceHandle;

  /// The ID of the target handle (if the target node has multiple handles).
  final String? targetHandle;

  /// The type of edge, used to look up the widget builder.
  final String? type;

  /// The data payload for this edge.
  final T? data;

  /// Whether this edge should be animated.
  final bool animated;

  /// Whether this edge is currently selected.
  final bool selected;

  /// Whether this edge is hidden.
  final bool hidden;

  /// Whether this edge can be deleted.
  final bool deletable;

  /// Whether this edge can be selected.
  final bool selectable;

  /// Whether this edge can receive focus.
  final bool focusable;

  /// Whether this edge can be reconnected to different nodes.
  ///
  /// Can be `true` (both ends), `'source'`, or `'target'`.
  final dynamic reconnectable;

  /// The marker at the start of the edge (arrow, etc.).
  final EdgeMarker? markerStart;

  /// The marker at the end of the edge (arrow, etc.).
  final EdgeMarker? markerEnd;

  /// Text label to display on the edge.
  final String? label;

  /// Style for the label text.
  final Map<String, dynamic>? labelStyle;

  /// Whether to show a background behind the label.
  final bool labelShowBg;

  /// Style for the label background.
  final Map<String, dynamic>? labelBgStyle;

  /// Padding around the label background.
  final List<double>? labelBgPadding;

  /// Border radius of the label background.
  final double? labelBgBorderRadius;

  /// The z-index for stacking order.
  final int? zIndex;

  /// Accessibility label for the edge.
  final String? ariaLabel;

  /// The width of the interaction area for mouse events.
  final double? interactionWidth;

  /// CSS class name (used for interop with web).
  final String? className;

  /// Inline style (used for interop with web).
  final Map<String, dynamic>? style;

  /// Creates a copy of this edge with the given fields replaced.
  Edge<T> copyWith({
    String? id,
    String? source,
    String? target,
    String? sourceHandle,
    String? targetHandle,
    String? type,
    T? data,
    bool? animated,
    bool? selected,
    bool? hidden,
    bool? deletable,
    bool? selectable,
    bool? focusable,
    dynamic reconnectable,
    EdgeMarker? markerStart,
    EdgeMarker? markerEnd,
    String? label,
    Map<String, dynamic>? labelStyle,
    bool? labelShowBg,
    Map<String, dynamic>? labelBgStyle,
    List<double>? labelBgPadding,
    double? labelBgBorderRadius,
    int? zIndex,
    String? ariaLabel,
    double? interactionWidth,
    String? className,
    Map<String, dynamic>? style,
  }) {
    return Edge<T>(
      id: id ?? this.id,
      source: source ?? this.source,
      target: target ?? this.target,
      sourceHandle: sourceHandle ?? this.sourceHandle,
      targetHandle: targetHandle ?? this.targetHandle,
      type: type ?? this.type,
      data: data ?? this.data,
      animated: animated ?? this.animated,
      selected: selected ?? this.selected,
      hidden: hidden ?? this.hidden,
      deletable: deletable ?? this.deletable,
      selectable: selectable ?? this.selectable,
      focusable: focusable ?? this.focusable,
      reconnectable: reconnectable ?? this.reconnectable,
      markerStart: markerStart ?? this.markerStart,
      markerEnd: markerEnd ?? this.markerEnd,
      label: label ?? this.label,
      labelStyle: labelStyle ?? this.labelStyle,
      labelShowBg: labelShowBg ?? this.labelShowBg,
      labelBgStyle: labelBgStyle ?? this.labelBgStyle,
      labelBgPadding: labelBgPadding ?? this.labelBgPadding,
      labelBgBorderRadius: labelBgBorderRadius ?? this.labelBgBorderRadius,
      zIndex: zIndex ?? this.zIndex,
      ariaLabel: ariaLabel ?? this.ariaLabel,
      interactionWidth: interactionWidth ?? this.interactionWidth,
      className: className ?? this.className,
      style: style ?? this.style,
    );
  }

  /// Converts this edge to a JSON map.
  Map<String, dynamic> toJson() => {
        'id': id,
        'source': source,
        'target': target,
        if (sourceHandle != null) 'sourceHandle': sourceHandle,
        if (targetHandle != null) 'targetHandle': targetHandle,
        if (type != null) 'type': type,
        if (data != null) 'data': data,
        if (animated) 'animated': animated,
        if (selected) 'selected': selected,
        if (hidden) 'hidden': hidden,
        if (!deletable) 'deletable': deletable,
        if (!selectable) 'selectable': selectable,
        if (!focusable) 'focusable': focusable,
        if (reconnectable != null) 'reconnectable': reconnectable,
        if (markerStart != null) 'markerStart': markerStart!.toJson(),
        if (markerEnd != null) 'markerEnd': markerEnd!.toJson(),
        if (label != null) 'label': label,
        if (labelStyle != null) 'labelStyle': labelStyle,
        if (!labelShowBg) 'labelShowBg': labelShowBg,
        if (labelBgStyle != null) 'labelBgStyle': labelBgStyle,
        if (labelBgPadding != null) 'labelBgPadding': labelBgPadding,
        if (labelBgBorderRadius != null)
          'labelBgBorderRadius': labelBgBorderRadius,
        if (zIndex != null) 'zIndex': zIndex,
        if (ariaLabel != null) 'ariaLabel': ariaLabel,
        if (interactionWidth != null) 'interactionWidth': interactionWidth,
        if (className != null) 'className': className,
        if (style != null) 'style': style,
      };

  /// Creates an edge from a JSON map.
  static Edge<T> fromJson<T>(
    Map<String, dynamic> json, {
    T Function(dynamic)? dataParser,
  }) {
    return Edge<T>(
      id: json['id'] as String,
      source: json['source'] as String,
      target: json['target'] as String,
      sourceHandle: json['sourceHandle'] as String?,
      targetHandle: json['targetHandle'] as String?,
      type: json['type'] as String?,
      data: dataParser != null && json['data'] != null
          ? dataParser(json['data'])
          : json['data'] as T?,
      animated: json['animated'] as bool? ?? false,
      selected: json['selected'] as bool? ?? false,
      hidden: json['hidden'] as bool? ?? false,
      deletable: json['deletable'] as bool? ?? true,
      selectable: json['selectable'] as bool? ?? true,
      focusable: json['focusable'] as bool? ?? true,
      reconnectable: json['reconnectable'],
      markerStart: json['markerStart'] != null
          ? EdgeMarker.fromJson(json['markerStart'] as Map<String, dynamic>)
          : null,
      markerEnd: json['markerEnd'] != null
          ? EdgeMarker.fromJson(json['markerEnd'] as Map<String, dynamic>)
          : null,
      label: json['label'] as String?,
      labelStyle: json['labelStyle'] as Map<String, dynamic>?,
      labelShowBg: json['labelShowBg'] as bool? ?? true,
      labelBgStyle: json['labelBgStyle'] as Map<String, dynamic>?,
      labelBgPadding: (json['labelBgPadding'] as List<dynamic>?)
          ?.map((e) => (e as num).toDouble())
          .toList(),
      labelBgBorderRadius: (json['labelBgBorderRadius'] as num?)?.toDouble(),
      zIndex: json['zIndex'] as int?,
      ariaLabel: json['ariaLabel'] as String?,
      interactionWidth: (json['interactionWidth'] as num?)?.toDouble(),
      className: json['className'] as String?,
      style: json['style'] as Map<String, dynamic>?,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Edge<T> && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'Edge(id: $id, source: $source, target: $target)';
}

/// Props passed to custom edge widgets.
@immutable
class EdgeProps<T> {
  /// Creates edge props.
  const EdgeProps({
    required this.id,
    required this.source,
    required this.target,
    required this.sourceX,
    required this.sourceY,
    required this.targetX,
    required this.targetY,
    required this.sourcePosition,
    required this.targetPosition,
    this.data,
    this.sourceHandle,
    this.targetHandle,
    this.selected = false,
    this.animated = false,
    this.markerStart,
    this.markerEnd,
    this.label,
    this.labelStyle,
    this.labelShowBg = true,
    this.labelBgStyle,
    this.labelBgPadding,
    this.labelBgBorderRadius,
    this.interactionWidth,
    this.style,
  });

  /// The edge ID.
  final String id;

  /// The source node ID.
  final String source;

  /// The target node ID.
  final String target;

  /// X coordinate of the source handle.
  final double sourceX;

  /// Y coordinate of the source handle.
  final double sourceY;

  /// X coordinate of the target handle.
  final double targetX;

  /// Y coordinate of the target handle.
  final double targetY;

  /// Position of the source handle (left, right, top, bottom).
  final Position sourcePosition;

  /// Position of the target handle (left, right, top, bottom).
  final Position targetPosition;

  /// The edge data.
  final T? data;

  /// The source handle ID.
  final String? sourceHandle;

  /// The target handle ID.
  final String? targetHandle;

  /// Whether this edge is selected.
  final bool selected;

  /// Whether this edge is animated.
  final bool animated;

  /// Marker at the start of the edge.
  final EdgeMarker? markerStart;

  /// Marker at the end of the edge.
  final EdgeMarker? markerEnd;

  /// Label text.
  final String? label;

  /// Label style.
  final Map<String, dynamic>? labelStyle;

  /// Whether to show label background.
  final bool labelShowBg;

  /// Label background style.
  final Map<String, dynamic>? labelBgStyle;

  /// Label background padding.
  final List<double>? labelBgPadding;

  /// Label background border radius.
  final double? labelBgBorderRadius;

  /// Interaction width.
  final double? interactionWidth;

  /// Custom style.
  final Map<String, dynamic>? style;
}

/// Built-in edge types.
abstract class EdgeTypes {
  EdgeTypes._();

  /// Default bezier edge.
  static const String defaultEdge = 'default';

  /// Straight line edge.
  static const String straight = 'straight';

  /// Step edge with sharp corners.
  static const String step = 'step';

  /// Smooth step edge with rounded corners.
  static const String smoothStep = 'smoothstep';

  /// Simple bezier edge.
  static const String simpleBezier = 'simplebezier';
}
