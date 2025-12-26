import 'dart:ui';

import 'edge_path.dart';

/// Calculates simple bezier paths for edges.
///
/// Simple bezier edges use a single control point for a gentler curve
/// compared to the full bezier implementation.
abstract class SimpleBezierEdgePath {
  SimpleBezierEdgePath._();

  /// Calculates a simple bezier edge path.
  ///
  /// Uses quadratic bezier curves with a single control point
  /// for simpler, more predictable curves.
  static EdgePath getSimpleBezierPath({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
  }) {
    // Calculate the control point based on handle positions
    final (controlX, controlY) = _getControlPoint(
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
    );

    final path = Path()
      ..moveTo(sourceX, sourceY)
      ..quadraticBezierTo(controlX, controlY, targetX, targetY);

    // Calculate label position at t=0.5 on the quadratic curve
    final (labelX, labelY) = _getQuadraticPoint(
      sourceX,
      sourceY,
      controlX,
      controlY,
      targetX,
      targetY,
      0.5,
    );

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

  /// Calculates the control point for the quadratic bezier.
  static (double x, double y) _getControlPoint({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
  }) {
    // For simple bezier, we use the midpoint but offset based on positions
    final midX = (sourceX + targetX) / 2;
    final midY = (sourceY + targetY) / 2;

    // Determine direction of offset based on handle positions
    if (sourcePosition.isHorizontal && targetPosition.isHorizontal) {
      // Both horizontal - offset vertically
      final offset = (targetX - sourceX).abs() / 4;
      final direction = (sourcePosition == EdgePosition.right) ? 1 : -1;
      return (midX, midY + offset * direction);
    } else if (sourcePosition.isVertical && targetPosition.isVertical) {
      // Both vertical - offset horizontally
      final offset = (targetY - sourceY).abs() / 4;
      final direction = (sourcePosition == EdgePosition.bottom) ? 1 : -1;
      return (midX + offset * direction, midY);
    } else {
      // Mixed - use intersection point
      if (sourcePosition.isHorizontal) {
        return (targetX, sourceY);
      } else {
        return (sourceX, targetY);
      }
    }
  }

  /// Gets a point on a quadratic bezier curve at parameter t (0-1).
  static (double x, double y) _getQuadraticPoint(
    double x0,
    double y0,
    double x1,
    double y1,
    double x2,
    double y2,
    double t,
  ) {
    final mt = 1 - t;
    final mt2 = mt * mt;
    final t2 = t * t;

    final x = mt2 * x0 + 2 * mt * t * x1 + t2 * x2;
    final y = mt2 * y0 + 2 * mt * t * y1 + t2 * y2;

    return (x, y);
  }
}
