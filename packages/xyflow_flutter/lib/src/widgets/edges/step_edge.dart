import 'package:flutter/material.dart';

import '../../core/types/edge.dart';
import '../../core/types/position.dart';
import '../../core/utils/edges/bezier.dart';
import '../../core/utils/edges/step.dart';

/// A step edge widget with right-angle corners.
///
/// This widget renders an edge with sharp 90-degree corners.
class StepEdge extends StatelessWidget {
  /// Creates a step edge.
  const StepEdge({
    super.key,
    required this.id,
    required this.sourceX,
    required this.sourceY,
    required this.targetX,
    required this.targetY,
    required this.sourcePosition,
    required this.targetPosition,
    this.selected = false,
    this.animated = false,
    this.style,
    this.label,
    this.labelStyle,
    this.labelShowBg = true,
    this.labelBgColor,
    this.labelBgPadding,
    this.labelBgBorderRadius,
    this.markerStart,
    this.markerEnd,
    this.interactionWidth,
    this.offset,
  });

  /// The edge ID.
  final String id;

  /// X coordinate of the source handle.
  final double sourceX;

  /// Y coordinate of the source handle.
  final double sourceY;

  /// X coordinate of the target handle.
  final double targetX;

  /// Y coordinate of the target handle.
  final double targetY;

  /// Position of the source handle.
  final Position sourcePosition;

  /// Position of the target handle.
  final Position targetPosition;

  /// Whether this edge is selected.
  final bool selected;

  /// Whether this edge is animated.
  final bool animated;

  /// Style for the edge.
  final EdgeStyle? style;

  /// Label text.
  final String? label;

  /// Label text style.
  final TextStyle? labelStyle;

  /// Whether to show label background.
  final bool labelShowBg;

  /// Label background color.
  final Color? labelBgColor;

  /// Label background padding.
  final EdgeInsets? labelBgPadding;

  /// Label background border radius.
  final double? labelBgBorderRadius;

  /// Marker at the start.
  final dynamic markerStart;

  /// Marker at the end.
  final dynamic markerEnd;

  /// Interaction width for hit testing.
  final double? interactionWidth;

  /// Offset for the center bend.
  final double? offset;

  @override
  Widget build(BuildContext context) {
    final effectiveStyle = style ?? const EdgeStyle();
    final edgePath = StepEdgePath.getStepPath(
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: _toEdgePosition(sourcePosition),
      targetPosition: _toEdgePosition(targetPosition),
      offset: offset,
    );

    return CustomPaint(
      painter: _EdgePainter(
        path: edgePath.path,
        color: effectiveStyle.strokeColor ?? (selected ? Colors.blue : Colors.grey.shade600),
        strokeWidth: effectiveStyle.strokeWidth,
        animated: animated || effectiveStyle.animated,
        dashArray: effectiveStyle.dashArray,
      ),
      child: label != null
          ? _buildLabel(edgePath.labelX, edgePath.labelY)
          : null,
    );
  }

  Widget _buildLabel(double x, double y) {
    return Positioned(
      left: x,
      top: y,
      child: Container(
        padding: labelBgPadding ?? const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: labelShowBg
            ? BoxDecoration(
                color: labelBgColor ?? Colors.white,
                borderRadius: BorderRadius.circular(labelBgBorderRadius ?? 4),
              )
            : null,
        child: Text(
          label!,
          style: labelStyle ?? const TextStyle(fontSize: 10),
        ),
      ),
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

class _EdgePainter extends CustomPainter {
  _EdgePainter({
    required this.path,
    required this.color,
    required this.strokeWidth,
    this.animated = false,
    this.dashArray,
  });

  final Path path;
  final Color color;
  final double strokeWidth;
  final bool animated;
  final List<double>? dashArray;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _EdgePainter oldDelegate) {
    return path != oldDelegate.path ||
        color != oldDelegate.color ||
        strokeWidth != oldDelegate.strokeWidth ||
        animated != oldDelegate.animated;
  }
}
