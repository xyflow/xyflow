import 'package:flutter/material.dart';

import '../state/xyflow_provider.dart';
import 'panel.dart';

/// MiniMap widget showing an overview of the flow.
class MiniMap extends StatelessWidget {
  /// Creates a minimap widget.
  const MiniMap({
    super.key,
    this.position = PanelPosition.bottomRight,
    this.width = 200,
    this.height = 150,
    this.nodeColor,
    this.nodeColorGetter,
    this.maskColor,
    this.backgroundColor,
    this.zoomable = true,
    this.pannable = true,
    this.nodeStrokeWidth = 2,
    this.nodeBorderRadius = 5,
  });

  /// Position of the minimap panel.
  final PanelPosition position;

  /// Width of the minimap.
  final double width;

  /// Height of the minimap.
  final double height;

  /// Default color for nodes.
  final Color? nodeColor;

  /// Function to get color for individual nodes.
  final Color Function(dynamic node)? nodeColorGetter;

  /// Color of the viewport mask overlay.
  final Color? maskColor;

  /// Background color of the minimap.
  final Color? backgroundColor;

  /// Whether the minimap can be used to zoom.
  final bool zoomable;

  /// Whether the minimap can be used to pan.
  final bool pannable;

  /// Stroke width for node borders.
  final double nodeStrokeWidth;

  /// Border radius for nodes.
  final double nodeBorderRadius;

  @override
  Widget build(BuildContext context) {
    return Panel(
      position: position,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor ?? Colors.grey.shade100,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey.shade300),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: GestureDetector(
            onPanUpdate: pannable ? _handlePan : null,
            child: CustomPaint(
              painter: MiniMapPainter(
                context: context,
                nodeColor: nodeColor ?? Colors.grey.shade500,
                nodeColorGetter: nodeColorGetter,
                maskColor: maskColor ?? Colors.blue.withValues(alpha: 0.1),
                nodeStrokeWidth: nodeStrokeWidth,
                nodeBorderRadius: nodeBorderRadius,
              ),
              size: Size(width, height),
            ),
          ),
        ),
      ),
    );
  }

  void _handlePan(DragUpdateDetails details) {
    // TODO: Implement panning via minimap
  }
}

/// Custom painter for the minimap.
class MiniMapPainter extends CustomPainter {
  /// Creates a minimap painter.
  MiniMapPainter({
    required this.context,
    required this.nodeColor,
    this.nodeColorGetter,
    required this.maskColor,
    required this.nodeStrokeWidth,
    required this.nodeBorderRadius,
  });

  /// Build context for accessing state.
  final BuildContext context;

  /// Default node color.
  final Color nodeColor;

  /// Function to get color for individual nodes.
  final Color Function(dynamic node)? nodeColorGetter;

  /// Viewport mask color.
  final Color maskColor;

  /// Node stroke width.
  final double nodeStrokeWidth;

  /// Node border radius.
  final double nodeBorderRadius;

  @override
  void paint(Canvas canvas, Size size) {
    try {
      final state = XYFlowProvider.maybeOfAny(context);
      if (state == null) return;

      final nodes = state.nodes;
      if (nodes.isEmpty) return;

      // Calculate bounds of all nodes
      double minX = double.infinity;
      double minY = double.infinity;
      double maxX = double.negativeInfinity;
      double maxY = double.negativeInfinity;

      for (final node in nodes) {
        if (node.hidden) continue;
        final internal = state.nodeLookup[node.id];
        if (internal == null) continue;

        final pos = internal.positionAbsolute;
        final nodeWidth = internal.measured?.width ?? node.width ?? 150;
        final nodeHeight = internal.measured?.height ?? node.height ?? 40;

        minX = minX.isFinite ? (minX < pos.x ? minX : pos.x) : pos.x;
        minY = minY.isFinite ? (minY < pos.y ? minY : pos.y) : pos.y;
        maxX = maxX.isFinite ? (maxX > pos.x + nodeWidth ? maxX : pos.x + nodeWidth) : pos.x + nodeWidth;
        maxY = maxY.isFinite ? (maxY > pos.y + nodeHeight ? maxY : pos.y + nodeHeight) : pos.y + nodeHeight;
      }

      if (!minX.isFinite) return;

      // Add padding
      const padding = 20.0;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;

      final boundsWidth = maxX - minX;
      final boundsHeight = maxY - minY;

      // Calculate scale to fit in minimap
      final scaleX = size.width / boundsWidth;
      final scaleY = size.height / boundsHeight;
      final scale = scaleX < scaleY ? scaleX : scaleY;

      // Center offset
      final offsetX = (size.width - boundsWidth * scale) / 2;
      final offsetY = (size.height - boundsHeight * scale) / 2;

      // Draw nodes
      final nodePaint = Paint()
        ..style = PaintingStyle.fill;

      for (final node in nodes) {
        if (node.hidden) continue;
        final internal = state.nodeLookup[node.id];
        if (internal == null) continue;

        final pos = internal.positionAbsolute;
        final nodeWidth = internal.measured?.width ?? node.width ?? 150;
        final nodeHeight = internal.measured?.height ?? node.height ?? 40;

        final x = (pos.x - minX) * scale + offsetX;
        final y = (pos.y - minY) * scale + offsetY;
        final w = nodeWidth * scale;
        final h = nodeHeight * scale;

        final color = nodeColorGetter?.call(node) ?? nodeColor;
        nodePaint.color = color;

        final rect = RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, w, h),
          Radius.circular(nodeBorderRadius * scale),
        );
        canvas.drawRRect(rect, nodePaint);
      }

      // Draw viewport rectangle
      final viewport = state.viewport;
      // This is a simplified viewport representation
      // Full implementation would need actual canvas size
      final viewportPaint = Paint()
        ..color = maskColor
        ..style = PaintingStyle.fill;

      final vpX = (-viewport.x / viewport.zoom - minX) * scale + offsetX;
      final vpY = (-viewport.y / viewport.zoom - minY) * scale + offsetY;
      final vpW = size.width / viewport.zoom * scale;
      final vpH = size.height / viewport.zoom * scale;

      canvas.drawRect(
        Rect.fromLTWH(vpX, vpY, vpW, vpH),
        viewportPaint,
      );

      // Draw viewport border
      final borderPaint = Paint()
        ..color = Colors.blue
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawRect(
        Rect.fromLTWH(vpX, vpY, vpW, vpH),
        borderPaint,
      );
    } catch (_) {
      // State not available
    }
  }

  @override
  bool shouldRepaint(covariant MiniMapPainter oldDelegate) => true;
}
