import 'package:flutter/material.dart';

import '../core/types/connection.dart';
import '../core/types/position.dart';
import '../core/utils/edges/bezier.dart';
import '../core/utils/edges/edge_path.dart';
import '../core/utils/edges/simple_bezier.dart';
import '../core/utils/edges/smooth_step.dart';
import '../core/utils/edges/step.dart';
import '../core/utils/edges/straight.dart';

/// Widget that renders the temporary connection line during connection creation.
///
/// This is displayed when the user drags from a handle to create a new edge.
class ConnectionLine extends StatelessWidget {
  /// Creates a connection line widget.
  const ConnectionLine({
    super.key,
    required this.fromX,
    required this.fromY,
    required this.toX,
    required this.toY,
    this.fromPosition = Position.right,
    this.toPosition = Position.left,
    this.connectionLineType = ConnectionLineType.bezier,
    this.color,
    this.strokeWidth = 1.5,
    this.isValid = true,
  });

  /// The starting X coordinate (from the source handle).
  final double fromX;

  /// The starting Y coordinate (from the source handle).
  final double fromY;

  /// The current X coordinate (mouse/touch position).
  final double toX;

  /// The current Y coordinate (mouse/touch position).
  final double toY;

  /// The position of the source handle on the node.
  final Position fromPosition;

  /// The inferred target position (opposite of fromPosition by default).
  final Position toPosition;

  /// The type of line to draw.
  final ConnectionLineType connectionLineType;

  /// The line color. Defaults to theme primary color.
  final Color? color;

  /// The line stroke width.
  final double strokeWidth;

  /// Whether the current connection target is valid.
  final bool isValid;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lineColor = color ??
        (isValid
            ? theme.colorScheme.primary
            : theme.colorScheme.error.withValues(alpha: 0.5));

    return CustomPaint(
      painter: _ConnectionLinePainter(
        fromX: fromX,
        fromY: fromY,
        toX: toX,
        toY: toY,
        fromPosition: _toEdgePosition(fromPosition),
        toPosition: _toEdgePosition(toPosition),
        connectionLineType: connectionLineType,
        color: lineColor,
        strokeWidth: strokeWidth,
      ),
      size: Size.infinite,
    );
  }

  EdgePosition _toEdgePosition(Position position) {
    switch (position) {
      case Position.left:
        return EdgePosition.left;
      case Position.right:
        return EdgePosition.right;
      case Position.top:
        return EdgePosition.top;
      case Position.bottom:
        return EdgePosition.bottom;
    }
  }
}

class _ConnectionLinePainter extends CustomPainter {
  _ConnectionLinePainter({
    required this.fromX,
    required this.fromY,
    required this.toX,
    required this.toY,
    required this.fromPosition,
    required this.toPosition,
    required this.connectionLineType,
    required this.color,
    required this.strokeWidth,
  });

  final double fromX;
  final double fromY;
  final double toX;
  final double toY;
  final EdgePosition fromPosition;
  final EdgePosition toPosition;
  final ConnectionLineType connectionLineType;
  final Color color;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = _getPath();
    canvas.drawPath(path, paint);

    // Draw a small circle at the end point
    final endPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(toX, toY), strokeWidth * 2, endPaint);
  }

  Path _getPath() {
    switch (connectionLineType) {
      case ConnectionLineType.bezier:
        final result = BezierEdgePath.getBezierPath(
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
          sourcePosition: fromPosition,
          targetPosition: toPosition,
        );
        return result.path;

      case ConnectionLineType.smoothStep:
        final result = SmoothStepEdgePath.getSmoothStepPath(
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
          sourcePosition: fromPosition,
          targetPosition: toPosition,
        );
        return result.path;

      case ConnectionLineType.step:
        final result = StepEdgePath.getStepPath(
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
          sourcePosition: fromPosition,
          targetPosition: toPosition,
        );
        return result.path;

      case ConnectionLineType.straight:
        final result = StraightEdgePath.getStraightPath(
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
        );
        return result.path;

      case ConnectionLineType.simpleBezier:
        final result = SimpleBezierEdgePath.getSimpleBezierPath(
          sourceX: fromX,
          sourceY: fromY,
          targetX: toX,
          targetY: toY,
          sourcePosition: fromPosition,
          targetPosition: toPosition,
        );
        return result.path;
    }
  }

  @override
  bool shouldRepaint(_ConnectionLinePainter oldDelegate) {
    return oldDelegate.fromX != fromX ||
        oldDelegate.fromY != fromY ||
        oldDelegate.toX != toX ||
        oldDelegate.toY != toY ||
        oldDelegate.fromPosition != fromPosition ||
        oldDelegate.toPosition != toPosition ||
        oldDelegate.connectionLineType != connectionLineType ||
        oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
