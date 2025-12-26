import 'dart:math' as math;
import 'dart:ui';

import 'edge_path.dart';

/// Calculates smooth step paths for edges.
///
/// Smooth step edges are orthogonal paths with rounded corners,
/// creating a clean, organized look for diagrams.
abstract class SmoothStepEdgePath {
  SmoothStepEdgePath._();

  /// Default border radius for corners.
  static const double defaultBorderRadius = 5.0;

  /// Default offset from the handle.
  static const double defaultOffset = 20.0;

  /// Calculates a smooth step edge path.
  ///
  /// The path consists of horizontal and vertical segments with
  /// rounded corners at the bends.
  static EdgePath getSmoothStepPath({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
    double borderRadius = defaultBorderRadius,
    double offset = defaultOffset,
    bool centerStep = true,
  }) {
    final (points, labelX, labelY) = _getPoints(
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      offset: offset,
      centerStep: centerStep,
    );

    final path = _createSmoothPath(points, borderRadius);

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

  /// Calculates the waypoints for the step path.
  static (List<Offset> points, double labelX, double labelY) _getPoints({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
    required double offset,
    required bool centerStep,
  }) {
    final sourceDir = _getDirection(sourcePosition);
    final targetDir = _getDirection(targetPosition);

    final sourceXOffset = sourceDir.dx * offset;
    final sourceYOffset = sourceDir.dy * offset;
    final targetXOffset = targetDir.dx * offset;
    final targetYOffset = targetDir.dy * offset;

    // First point after source
    final sourceControlX = sourceX + sourceXOffset;
    final sourceControlY = sourceY + sourceYOffset;

    // Last point before target
    final targetControlX = targetX + targetXOffset;
    final targetControlY = targetY + targetYOffset;

    final points = <Offset>[
      Offset(sourceX, sourceY),
    ];

    // Determine the path based on relative positions
    final sameAxis = sourcePosition.isHorizontal == targetPosition.isHorizontal;

    if (sameAxis) {
      // Handles are on the same axis (both horizontal or both vertical)
      if (centerStep) {
        final centerX = (sourceControlX + targetControlX) / 2;
        final centerY = (sourceControlY + targetControlY) / 2;

        if (sourcePosition.isHorizontal) {
          points.addAll([
            Offset(sourceControlX, sourceY),
            Offset(sourceControlX, centerY),
            Offset(targetControlX, centerY),
            Offset(targetControlX, targetY),
          ]);
        } else {
          points.addAll([
            Offset(sourceX, sourceControlY),
            Offset(centerX, sourceControlY),
            Offset(centerX, targetControlY),
            Offset(targetX, targetControlY),
          ]);
        }
      } else {
        if (sourcePosition.isHorizontal) {
          points.addAll([
            Offset(sourceControlX, sourceY),
            Offset(sourceControlX, targetY),
          ]);
        } else {
          points.addAll([
            Offset(sourceX, sourceControlY),
            Offset(targetX, sourceControlY),
          ]);
        }
      }
    } else {
      // Handles are on perpendicular axes
      if (sourcePosition.isHorizontal) {
        points.addAll([
          Offset(sourceControlX, sourceY),
          Offset(sourceControlX, targetControlY),
        ]);
      } else {
        points.addAll([
          Offset(sourceX, sourceControlY),
          Offset(targetControlX, sourceControlY),
        ]);
      }
    }

    points.add(Offset(targetX, targetY));

    // Calculate label position (middle of the path)
    final midIndex = points.length ~/ 2;
    final labelX = (points[midIndex - 1].dx + points[midIndex].dx) / 2;
    final labelY = (points[midIndex - 1].dy + points[midIndex].dy) / 2;

    return (points, labelX, labelY);
  }

  /// Gets the direction vector for a handle position.
  static Offset _getDirection(EdgePosition position) {
    switch (position) {
      case EdgePosition.left:
        return const Offset(-1, 0);
      case EdgePosition.right:
        return const Offset(1, 0);
      case EdgePosition.top:
        return const Offset(0, -1);
      case EdgePosition.bottom:
        return const Offset(0, 1);
    }
  }

  /// Creates a smooth path with rounded corners from a list of points.
  static Path _createSmoothPath(List<Offset> points, double radius) {
    final path = Path();

    if (points.isEmpty) return path;

    path.moveTo(points.first.dx, points.first.dy);

    if (points.length < 3) {
      // Not enough points for corners, just draw lines
      for (var i = 1; i < points.length; i++) {
        path.lineTo(points[i].dx, points[i].dy);
      }
      return path;
    }

    for (var i = 1; i < points.length - 1; i++) {
      final prev = points[i - 1];
      final curr = points[i];
      final next = points[i + 1];

      // Calculate distances
      final d1 = _distance(prev, curr);
      final d2 = _distance(curr, next);

      // Limit radius to half the shortest segment
      final r = math.min(radius, math.min(d1, d2) / 2);

      if (r <= 0) {
        path.lineTo(curr.dx, curr.dy);
        continue;
      }

      // Calculate unit vectors
      final v1 = Offset(
        (curr.dx - prev.dx) / d1,
        (curr.dy - prev.dy) / d1,
      );
      final v2 = Offset(
        (next.dx - curr.dx) / d2,
        (next.dy - curr.dy) / d2,
      );

      // Points where the arc starts and ends
      final start = Offset(
        curr.dx - v1.dx * r,
        curr.dy - v1.dy * r,
      );
      final end = Offset(
        curr.dx + v2.dx * r,
        curr.dy + v2.dy * r,
      );

      // Draw line to arc start
      path.lineTo(start.dx, start.dy);

      // Draw arc using quadratic bezier (approximation)
      path.quadraticBezierTo(curr.dx, curr.dy, end.dx, end.dy);
    }

    // Draw final line to last point
    path.lineTo(points.last.dx, points.last.dy);

    return path;
  }

  /// Calculates distance between two points.
  static double _distance(Offset a, Offset b) {
    final dx = b.dx - a.dx;
    final dy = b.dy - a.dy;
    return math.sqrt(dx * dx + dy * dy);
  }
}
