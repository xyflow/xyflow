import 'package:flutter/foundation.dart';

/// Represents a 2D position with x and y coordinates.
///
/// This is the fundamental position type used throughout xyflow for
/// positioning nodes and calculating offsets.
@immutable
class XYPosition {
  /// Creates a position with the given [x] and [y] coordinates.
  const XYPosition({
    required this.x,
    required this.y,
  });

  /// Creates a position at the origin (0, 0).
  const XYPosition.zero()
      : x = 0,
        y = 0;

  /// The x-coordinate of this position.
  final double x;

  /// The y-coordinate of this position.
  final double y;

  /// Creates a copy of this position with the given fields replaced.
  XYPosition copyWith({
    double? x,
    double? y,
  }) {
    return XYPosition(
      x: x ?? this.x,
      y: y ?? this.y,
    );
  }

  /// Adds another position to this one.
  XYPosition operator +(XYPosition other) {
    return XYPosition(x: x + other.x, y: y + other.y);
  }

  /// Subtracts another position from this one.
  XYPosition operator -(XYPosition other) {
    return XYPosition(x: x - other.x, y: y - other.y);
  }

  /// Multiplies this position by a scalar.
  XYPosition operator *(double scalar) {
    return XYPosition(x: x * scalar, y: y * scalar);
  }

  /// Divides this position by a scalar.
  XYPosition operator /(double scalar) {
    return XYPosition(x: x / scalar, y: y / scalar);
  }

  /// Returns the distance from the origin to this position.
  double get magnitude => (x * x + y * y).abs();

  /// Returns the distance between this position and another.
  double distanceTo(XYPosition other) {
    final dx = x - other.x;
    final dy = y - other.y;
    return (dx * dx + dy * dy).abs();
  }

  /// Converts this position to a JSON map.
  Map<String, dynamic> toJson() => {'x': x, 'y': y};

  /// Creates a position from a JSON map.
  factory XYPosition.fromJson(Map<String, dynamic> json) {
    return XYPosition(
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is XYPosition && other.x == x && other.y == y;
  }

  @override
  int get hashCode => Object.hash(x, y);

  @override
  String toString() => 'XYPosition($x, $y)';
}

/// Enum representing the position of a handle on a node.
///
/// Handles can be positioned on any of the four sides of a node.
enum Position {
  /// Handle positioned on the left side of the node.
  left,

  /// Handle positioned on the top side of the node.
  top,

  /// Handle positioned on the right side of the node.
  right,

  /// Handle positioned on the bottom side of the node.
  bottom;

  /// Returns the opposite position.
  Position get opposite {
    switch (this) {
      case Position.left:
        return Position.right;
      case Position.right:
        return Position.left;
      case Position.top:
        return Position.bottom;
      case Position.bottom:
        return Position.top;
    }
  }

  /// Returns true if this position is horizontal (left or right).
  bool get isHorizontal => this == Position.left || this == Position.right;

  /// Returns true if this position is vertical (top or bottom).
  bool get isVertical => this == Position.top || this == Position.bottom;
}
