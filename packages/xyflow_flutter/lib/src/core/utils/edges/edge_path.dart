import 'dart:math' as math;
import 'dart:ui';

import 'package:flutter/foundation.dart';

/// The result of an edge path calculation.
///
/// Contains the path itself along with the optimal position for a label.
@immutable
class EdgePath {
  /// Creates an edge path result.
  const EdgePath({
    required this.path,
    required this.labelX,
    required this.labelY,
    this.offsetX = 0,
    this.offsetY = 0,
  });

  /// The path to draw for this edge.
  final Path path;

  /// The x-coordinate for the label center.
  final double labelX;

  /// The y-coordinate for the label center.
  final double labelY;

  /// The x-offset to apply when the edge goes right-to-left.
  final double offsetX;

  /// The y-offset to apply when the edge goes bottom-to-top.
  final double offsetY;

  /// The position for placing the label.
  Offset get labelPosition => Offset(labelX, labelY);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgePath &&
        other.labelX == labelX &&
        other.labelY == labelY &&
        other.offsetX == offsetX &&
        other.offsetY == offsetY;
  }

  @override
  int get hashCode => Object.hash(labelX, labelY, offsetX, offsetY);

  @override
  String toString() =>
      'EdgePath(labelX: $labelX, labelY: $labelY, offsetX: $offsetX, offsetY: $offsetY)';
}

/// Parameters for calculating edge paths.
@immutable
class EdgePathParams {
  /// Creates edge path parameters.
  const EdgePathParams({
    required this.sourceX,
    required this.sourceY,
    required this.targetX,
    required this.targetY,
    required this.sourcePosition,
    required this.targetPosition,
  });

  /// The x-coordinate of the source handle.
  final double sourceX;

  /// The y-coordinate of the source handle.
  final double sourceY;

  /// The x-coordinate of the target handle.
  final double targetX;

  /// The y-coordinate of the target handle.
  final double targetY;

  /// The position of the source handle (left, right, top, bottom).
  final EdgePosition sourcePosition;

  /// The position of the target handle (left, right, top, bottom).
  final EdgePosition targetPosition;
}

/// Position enum for edge calculations (mirrors Position but specific to edges).
enum EdgePosition {
  left,
  top,
  right,
  bottom;

  /// Returns true if this is a horizontal position (left or right).
  bool get isHorizontal => this == EdgePosition.left || this == EdgePosition.right;

  /// Returns true if this is a vertical position (top or bottom).
  bool get isVertical => this == EdgePosition.top || this == EdgePosition.bottom;

  /// Returns the opposite position.
  EdgePosition get opposite {
    switch (this) {
      case EdgePosition.left:
        return EdgePosition.right;
      case EdgePosition.right:
        return EdgePosition.left;
      case EdgePosition.top:
        return EdgePosition.bottom;
      case EdgePosition.bottom:
        return EdgePosition.top;
    }
  }
}

/// Utility class for edge path calculations.
abstract class EdgePathUtils {
  EdgePathUtils._();

  /// Calculates the distance between source and target positions.
  static double getEdgeCenter({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
  }) {
    final dx = targetX - sourceX;
    final dy = targetY - sourceY;
    return math.sqrt(dx * dx + dy * dy);
  }

  /// Returns the center coordinates between source and target.
  static (double centerX, double centerY, double offsetX, double offsetY) getCenter({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
  }) {
    final xOffset = ((targetX - sourceX) / 2).abs();
    final centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    final yOffset = ((targetY - sourceY) / 2).abs();
    final centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    return (centerX, centerY, xOffset, yOffset);
  }

  /// Gets control point offset based on handle position and curvature.
  static double getControlOffset(EdgePosition position, double curvature, double distance) {
    switch (position) {
      case EdgePosition.left:
        return -curvature * distance;
      case EdgePosition.right:
        return curvature * distance;
      case EdgePosition.top:
        return -curvature * distance;
      case EdgePosition.bottom:
        return curvature * distance;
    }
  }
}
