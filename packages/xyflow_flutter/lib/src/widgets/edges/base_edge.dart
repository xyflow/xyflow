import 'package:flutter/material.dart';

import '../../core/types/edge.dart';
import '../../core/types/position.dart';
import '../../core/utils/edges/bezier.dart';
import '../../core/utils/edges/edge_path.dart';
import '../../core/utils/edges/simple_bezier.dart';
import '../../core/utils/edges/smooth_step.dart';
import '../../core/utils/edges/step.dart';
import '../../core/utils/edges/straight.dart';
import '../xyflow.dart';

/// Base edge widget that renders different edge types.
class BaseEdgeWidget<T> extends StatelessWidget {
  /// Creates a base edge widget.
  const BaseEdgeWidget({
    super.key,
    required this.edge,
    this.edgeTypes,
    required this.sourceX,
    required this.sourceY,
    required this.targetX,
    required this.targetY,
    required this.sourcePosition,
    required this.targetPosition,
    this.onEdgeClick,
    this.selectable = true,
  });

  /// The edge data.
  final Edge<T> edge;

  /// Custom edge type builders.
  final Map<String, EdgeBuilder<T>>? edgeTypes;

  /// Source handle x coordinate.
  final double sourceX;

  /// Source handle y coordinate.
  final double sourceY;

  /// Target handle x coordinate.
  final double targetX;

  /// Target handle y coordinate.
  final double targetY;

  /// Position of the source handle.
  final Position sourcePosition;

  /// Position of the target handle.
  final Position targetPosition;

  /// Called when the edge is clicked.
  final void Function(Edge<T>)? onEdgeClick;

  /// Whether the edge is selectable.
  final bool selectable;

  @override
  Widget build(BuildContext context) {
    // Check for custom edge type
    final customBuilder = edgeTypes?[edge.type];
    if (customBuilder != null) {
      return customBuilder(_createEdgeProps());
    }

    // Use built-in edge types
    final edgePath = _calculatePath();

    return GestureDetector(
      onTap: selectable ? () => onEdgeClick?.call(edge) : null,
      behavior: HitTestBehavior.translucent,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          CustomPaint(
            painter: EdgePainter(
              path: edgePath.path,
              color: _getColor(),
              strokeWidth: _getStrokeWidth(),
              animated: edge.animated,
              selected: edge.selected,
              markerStart: edge.markerStart,
              markerEnd: edge.markerEnd,
            ),
          ),
          if (edge.label != null)
            Transform.translate(
              offset: Offset(edgePath.labelX, edgePath.labelY),
              child: _buildLabel(),
            ),
        ],
      ),
    );
  }

  EdgeProps<T> _createEdgeProps() {
    return EdgeProps<T>(
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      data: edge.data,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      selected: edge.selected,
      animated: edge.animated,
      markerStart: edge.markerStart,
      markerEnd: edge.markerEnd,
      label: edge.label,
      labelStyle: edge.labelStyle,
      labelShowBg: edge.labelShowBg,
      labelBgStyle: edge.labelBgStyle,
      labelBgPadding: edge.labelBgPadding,
      labelBgBorderRadius: edge.labelBgBorderRadius,
      interactionWidth: edge.interactionWidth,
      style: edge.style,
    );
  }

  EdgePath _calculatePath() {
    final srcPos = _toEdgePosition(sourcePosition);
    final tgtPos = _toEdgePosition(targetPosition);

    switch (edge.type) {
      case EdgeTypes.straight:
        return StraightEdgePath.getStraightPath(
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
        );
      case EdgeTypes.step:
        return StepEdgePath.getStepPath(
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          sourcePosition: srcPos,
          targetPosition: tgtPos,
        );
      case EdgeTypes.smoothStep:
        return SmoothStepEdgePath.getSmoothStepPath(
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          sourcePosition: srcPos,
          targetPosition: tgtPos,
        );
      case EdgeTypes.simpleBezier:
        return SimpleBezierEdgePath.getSimpleBezierPath(
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          sourcePosition: srcPos,
          targetPosition: tgtPos,
        );
      case EdgeTypes.defaultEdge:
      default:
        return BezierEdgePath.getBezierPath(
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          sourcePosition: srcPos,
          targetPosition: tgtPos,
        );
    }
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

  Color _getColor() {
    // Check for custom stroke color in style map
    final styleStroke = edge.style?['stroke'];
    if (styleStroke != null) {
      if (styleStroke is Color) {
        return styleStroke;
      } else if (styleStroke is int) {
        return Color(styleStroke);
      }
    }
    if (edge.selected) {
      return Colors.blue;
    }
    return Colors.grey.shade600;
  }

  double _getStrokeWidth() {
    // Check for custom stroke width in style map
    final styleWidth = edge.style?['strokeWidth'];
    if (styleWidth != null && styleWidth is num) {
      return styleWidth.toDouble();
    }
    return edge.selected ? 3 : 2;
  }

  Widget _buildLabel() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: edge.labelShowBg
          ? BoxDecoration(
              color: Colors.white,
              borderRadius:
                  BorderRadius.circular(edge.labelBgBorderRadius ?? 4),
            )
          : null,
      child: Text(
        edge.label!,
        style: const TextStyle(fontSize: 10),
      ),
    );
  }
}

/// Custom painter for edges.
class EdgePainter extends CustomPainter {
  /// Creates an edge painter.
  EdgePainter({
    required this.path,
    required this.color,
    this.strokeWidth = 2,
    this.animated = false,
    this.selected = false,
    this.markerStart,
    this.markerEnd,
  });

  /// The path to draw.
  final Path path;

  /// The edge color.
  final Color color;

  /// The stroke width.
  final double strokeWidth;

  /// Whether the edge is animated.
  final bool animated;

  /// Whether the edge is selected.
  final bool selected;

  /// Marker at the start of the edge.
  final dynamic markerStart;

  /// Marker at the end of the edge.
  final dynamic markerEnd;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    if (animated) {
      // TODO: Implement animated dashed line
      paint.strokeWidth = strokeWidth;
    }

    canvas.drawPath(path, paint);

    // TODO: Draw markers
  }

  @override
  bool shouldRepaint(covariant EdgePainter oldDelegate) {
    return path != oldDelegate.path ||
        color != oldDelegate.color ||
        strokeWidth != oldDelegate.strokeWidth ||
        animated != oldDelegate.animated ||
        selected != oldDelegate.selected;
  }
}
