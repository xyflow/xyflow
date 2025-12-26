import 'dart:math' as math;
import 'dart:ui';

import 'edge_path.dart';

/// Calculates straight line paths for edges.
///
/// Straight edges are simple direct lines from source to target,
/// ignoring handle positions for the path shape.
abstract class StraightEdgePath {
  StraightEdgePath._();

  /// Calculates a straight edge path.
  ///
  /// Creates a direct line from source to target coordinates.
  static EdgePath getStraightPath({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
  }) {
    final path = Path()
      ..moveTo(sourceX, sourceY)
      ..lineTo(targetX, targetY);

    // Label at midpoint
    final labelX = (sourceX + targetX) / 2;
    final labelY = (sourceY + targetY) / 2;

    // Calculate offsets
    final (_, _, offsetX, offsetY) = EdgePathUtils.getCenter(
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
    );

    return EdgePath(
      path: path,
      labelX: labelX,
      labelY: labelY,
      offsetX: offsetX,
      offsetY: offsetY,
    );
  }

  /// Gets the angle of the straight line.
  ///
  /// Useful for orienting markers at the edge endpoints.
  static double getAngle({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
  }) {
    final dx = targetX - sourceX;
    final dy = targetY - sourceY;
    return dy.isFinite && dx.isFinite
        ? (dy / dx).isNaN
            ? 0
            : math.atan2(dy, dx)
        : 0;
  }
}
