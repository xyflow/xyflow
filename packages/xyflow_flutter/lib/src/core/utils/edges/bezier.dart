import 'dart:math' as math;
import 'dart:ui';

import 'edge_path.dart';

/// Calculates Bezier curve paths for edges.
///
/// Bezier edges are smooth curves that connect nodes with aesthetically
/// pleasing curves based on the handle positions.
abstract class BezierEdgePath {
  BezierEdgePath._();

  /// Default curvature for bezier edges.
  static const double defaultCurvature = 0.25;

  /// Calculates a bezier edge path.
  ///
  /// The curvature parameter controls how pronounced the curve is.
  /// A value of 0 produces a straight line, while higher values
  /// create more pronounced curves.
  static EdgePath getBezierPath({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
    double curvature = defaultCurvature,
  }) {
    final (controlX1, controlY1) = _getControlPoint(
      sourceX,
      sourceY,
      sourcePosition,
      curvature,
      _getDistance(sourceX, sourceY, targetX, targetY, sourcePosition),
    );

    final (controlX2, controlY2) = _getControlPoint(
      targetX,
      targetY,
      targetPosition,
      curvature,
      _getDistance(targetX, targetY, sourceX, sourceY, targetPosition),
    );

    final path = Path()
      ..moveTo(sourceX, sourceY)
      ..cubicTo(controlX1, controlY1, controlX2, controlY2, targetX, targetY);

    // Calculate label position at t=0.5 on the bezier curve
    final (labelX, labelY) = _getBezierPoint(
      sourceX,
      sourceY,
      controlX1,
      controlY1,
      controlX2,
      controlY2,
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

  /// Gets a control point for one end of the bezier curve.
  static (double x, double y) _getControlPoint(
    double x,
    double y,
    EdgePosition position,
    double curvature,
    double distance,
  ) {
    final offset = curvature * distance;

    switch (position) {
      case EdgePosition.left:
        return (x - offset, y);
      case EdgePosition.right:
        return (x + offset, y);
      case EdgePosition.top:
        return (x, y - offset);
      case EdgePosition.bottom:
        return (x, y + offset);
    }
  }

  /// Calculates appropriate distance for control point based on positions.
  static double _getDistance(
    double x1,
    double y1,
    double x2,
    double y2,
    EdgePosition position,
  ) {
    if (position.isHorizontal) {
      return (x2 - x1).abs();
    }
    return (y2 - y1).abs();
  }

  /// Gets a point on a cubic bezier curve at parameter t (0-1).
  static (double x, double y) _getBezierPoint(
    double x0,
    double y0,
    double x1,
    double y1,
    double x2,
    double y2,
    double x3,
    double y3,
    double t,
  ) {
    final mt = 1 - t;
    final mt2 = mt * mt;
    final mt3 = mt2 * mt;
    final t2 = t * t;
    final t3 = t2 * t;

    final x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
    final y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

    return (x, y);
  }

  /// Gets the tangent angle at a point on the bezier curve.
  ///
  /// Useful for orienting markers at the edge endpoints.
  static double getTangentAngle({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
    double curvature = defaultCurvature,
    bool atSource = true,
  }) {
    final (controlX1, controlY1) = _getControlPoint(
      sourceX,
      sourceY,
      sourcePosition,
      curvature,
      _getDistance(sourceX, sourceY, targetX, targetY, sourcePosition),
    );

    final (controlX2, controlY2) = _getControlPoint(
      targetX,
      targetY,
      targetPosition,
      curvature,
      _getDistance(targetX, targetY, sourceX, sourceY, targetPosition),
    );

    double dx, dy;
    if (atSource) {
      // Tangent at source (derivative at t=0)
      dx = 3 * (controlX1 - sourceX);
      dy = 3 * (controlY1 - sourceY);
    } else {
      // Tangent at target (derivative at t=1)
      dx = 3 * (targetX - controlX2);
      dy = 3 * (targetY - controlY2);
    }

    return math.atan2(dy, dx);
  }
}
