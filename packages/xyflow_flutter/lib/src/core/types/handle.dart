import 'package:flutter/foundation.dart';

import 'position.dart';

/// The type of a handle - either source (outgoing) or target (incoming).
enum HandleType {
  /// A source handle where connections originate from.
  source,

  /// A target handle where connections terminate at.
  target;

  /// Returns the opposite handle type.
  HandleType get opposite {
    switch (this) {
      case HandleType.source:
        return HandleType.target;
      case HandleType.target:
        return HandleType.source;
    }
  }
}

/// Represents a connection point (handle) on a node.
///
/// Handles are the points where edges connect to nodes. Each node can have
/// multiple handles of different types (source/target) at different positions.
@immutable
class Handle {
  /// Creates a handle with the given properties.
  const Handle({
    this.id,
    required this.type,
    required this.position,
    this.x = 0,
    this.y = 0,
    this.width = 10,
    this.height = 10,
  });

  /// The optional identifier for this handle.
  ///
  /// If a node has multiple handles of the same type, each should have a unique ID.
  final String? id;

  /// The type of this handle (source or target).
  final HandleType type;

  /// The position of this handle on the node (left, top, right, bottom).
  final Position position;

  /// The x-coordinate offset of this handle from the node's position.
  final double x;

  /// The y-coordinate offset of this handle from the node's position.
  final double y;

  /// The width of the handle's clickable area.
  final double width;

  /// The height of the handle's clickable area.
  final double height;

  /// The center point of this handle.
  XYPosition get center => XYPosition(
        x: x + width / 2,
        y: y + height / 2,
      );

  /// Creates a copy of this handle with the given fields replaced.
  Handle copyWith({
    String? id,
    HandleType? type,
    Position? position,
    double? x,
    double? y,
    double? width,
    double? height,
  }) {
    return Handle(
      id: id ?? this.id,
      type: type ?? this.type,
      position: position ?? this.position,
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
    );
  }

  /// Converts this handle to a JSON map.
  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'type': type.name,
        'position': position.name,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
      };

  /// Creates a handle from a JSON map.
  factory Handle.fromJson(Map<String, dynamic> json) {
    return Handle(
      id: json['id'] as String?,
      type: HandleType.values.byName(json['type'] as String),
      position: Position.values.byName(json['position'] as String),
      x: (json['x'] as num?)?.toDouble() ?? 0,
      y: (json['y'] as num?)?.toDouble() ?? 0,
      width: (json['width'] as num?)?.toDouble() ?? 10,
      height: (json['height'] as num?)?.toDouble() ?? 10,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Handle &&
        other.id == id &&
        other.type == type &&
        other.position == position &&
        other.x == x &&
        other.y == y &&
        other.width == width &&
        other.height == height;
  }

  @override
  int get hashCode => Object.hash(id, type, position, x, y, width, height);

  @override
  String toString() =>
      'Handle(id: $id, type: $type, position: $position, x: $x, y: $y)';
}

/// Contains the bounds of handles organized by type.
@immutable
class HandleBounds {
  /// Creates handle bounds with the given source and target handles.
  const HandleBounds({
    this.source = const [],
    this.target = const [],
  });

  /// The list of source handles.
  final List<Handle> source;

  /// The list of target handles.
  final List<Handle> target;

  /// Returns all handles (both source and target).
  List<Handle> get all => [...source, ...target];

  /// Returns true if there are no handles.
  bool get isEmpty => source.isEmpty && target.isEmpty;

  /// Returns true if there are any handles.
  bool get isNotEmpty => !isEmpty;

  /// Creates a copy with the given fields replaced.
  HandleBounds copyWith({
    List<Handle>? source,
    List<Handle>? target,
  }) {
    return HandleBounds(
      source: source ?? this.source,
      target: target ?? this.target,
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() => {
        'source': source.map((h) => h.toJson()).toList(),
        'target': target.map((h) => h.toJson()).toList(),
      };

  /// Creates from JSON.
  factory HandleBounds.fromJson(Map<String, dynamic> json) {
    return HandleBounds(
      source: (json['source'] as List<dynamic>?)
              ?.map((e) => Handle.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      target: (json['target'] as List<dynamic>?)
              ?.map((e) => Handle.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is HandleBounds &&
        listEquals(other.source, source) &&
        listEquals(other.target, target);
  }

  @override
  int get hashCode => Object.hash(
        Object.hashAll(source),
        Object.hashAll(target),
      );
}
