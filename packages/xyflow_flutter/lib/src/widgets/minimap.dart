import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../core/types/viewport.dart' as xyflow;
import '../state/xyflow_provider.dart';
import 'panel.dart';

/// Default width for nodes when not specified.
const double _kDefaultNodeWidth = 150.0;

/// Default height for nodes when not specified.
const double _kDefaultNodeHeight = 40.0;

/// MiniMap widget showing an overview of the flow.
///
/// Supports interactive panning - drag on the minimap to pan the main view.
class MiniMap extends StatefulWidget {
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
  /// The node parameter is the Node object from the flow.
  final Color Function(Object node)? nodeColorGetter;

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
  State<MiniMap> createState() => _MiniMapState();
}

class _MiniMapState extends State<MiniMap> {
  // Cached bounds for coordinate conversion
  _MiniMapBounds? _bounds;

  @override
  Widget build(BuildContext context) {
    return Panel(
      position: widget.position,
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: widget.backgroundColor ?? Colors.grey.shade100,
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
            onTapDown: widget.pannable ? _handleTap : null,
            onPanStart: widget.pannable ? _handlePanStart : null,
            onPanUpdate: widget.pannable ? _handlePanUpdate : null,
            child: CustomPaint(
              painter: MiniMapPainter(
                context: context,
                nodeColor: widget.nodeColor ?? Colors.grey.shade500,
                nodeColorGetter: widget.nodeColorGetter,
                maskColor: widget.maskColor ?? Colors.blue.withValues(alpha: 0.1),
                nodeStrokeWidth: widget.nodeStrokeWidth,
                nodeBorderRadius: widget.nodeBorderRadius,
                onBoundsCalculated: (bounds) => _bounds = bounds,
              ),
              size: Size(widget.width, widget.height),
            ),
          ),
        ),
      ),
    );
  }

  void _handleTap(TapDownDetails details) {
    _panToPosition(details.localPosition);
  }

  void _handlePanStart(DragStartDetails details) {
    _panToPosition(details.localPosition);
  }

  void _handlePanUpdate(DragUpdateDetails details) {
    _panToPosition(details.localPosition);
  }

  void _panToPosition(Offset localPosition) {
    final state = XYFlowProvider.maybeOfAny(context);
    if (state == null || _bounds == null) return;

    final bounds = _bounds!;
    final viewport = state.viewport;
    final containerSize = state.containerSize;
    if (containerSize == null) return;

    // Convert minimap pixel position to flow coordinates
    final flowX = (localPosition.dx - bounds.offsetX) / bounds.scale + bounds.minX;
    final flowY = (localPosition.dy - bounds.offsetY) / bounds.scale + bounds.minY;

    // Calculate dimensions of the visible viewport in flow coordinate space
    final viewportWidthInFlow = containerSize.width / viewport.zoom;
    final viewportHeightInFlow = containerSize.height / viewport.zoom;

    // Center the viewport on the clicked point by calculating new viewport translation
    // (viewport.x/y represent the negative of the flow position multiplied by zoom)
    final newX = -(flowX - viewportWidthInFlow / 2) * viewport.zoom;
    final newY = -(flowY - viewportHeightInFlow / 2) * viewport.zoom;

    state.setViewport(xyflow.Viewport(
      x: newX,
      y: newY,
      zoom: viewport.zoom,
    ));
  }
}

/// Cached bounds information for coordinate conversion.
class _MiniMapBounds {
  const _MiniMapBounds({
    required this.minX,
    required this.minY,
    required this.maxX,
    required this.maxY,
    required this.scale,
    required this.offsetX,
    required this.offsetY,
  });

  final double minX;
  final double minY;
  final double maxX;
  final double maxY;
  final double scale;
  final double offsetX;
  final double offsetY;
}

/// Custom painter for the minimap.
class MiniMapPainter extends CustomPainter {
  /// Creates a minimap painter.
  MiniMapPainter({
    required this.context,
    required this.nodeColor,
    required this.maskColor,
    required this.nodeStrokeWidth,
    required this.nodeBorderRadius,
    this.nodeColorGetter,
    this.onBoundsCalculated,
  });

  /// Build context for accessing state.
  final BuildContext context;

  /// Default node color.
  final Color nodeColor;

  /// Function to get color for individual nodes.
  final Color Function(Object node)? nodeColorGetter;

  /// Viewport mask color.
  final Color maskColor;

  /// Node stroke width.
  final double nodeStrokeWidth;

  /// Node border radius.
  final double nodeBorderRadius;

  /// Callback when bounds are calculated.
  final void Function(_MiniMapBounds bounds)? onBoundsCalculated;

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
        final nodeWidth = internal.measured?.width ?? node.width ?? _kDefaultNodeWidth;
        final nodeHeight = internal.measured?.height ?? node.height ?? _kDefaultNodeHeight;

        // Update bounds using simplified comparisons
        if (minX.isInfinite || pos.x < minX) minX = pos.x;
        if (minY.isInfinite || pos.y < minY) minY = pos.y;
        if (maxX.isInfinite || pos.x + nodeWidth > maxX) maxX = pos.x + nodeWidth;
        if (maxY.isInfinite || pos.y + nodeHeight > maxY) maxY = pos.y + nodeHeight;
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
      final scale = math.min(scaleX, scaleY);

      // Center offset
      final offsetX = (size.width - boundsWidth * scale) / 2;
      final offsetY = (size.height - boundsHeight * scale) / 2;

      // Report bounds for gesture handling
      onBoundsCalculated?.call(_MiniMapBounds(
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        scale: scale,
        offsetX: offsetX,
        offsetY: offsetY,
      ));

      // Draw nodes
      final nodePaint = Paint()
        ..style = PaintingStyle.fill;

      for (final node in nodes) {
        if (node.hidden) continue;
        final internal = state.nodeLookup[node.id];
        if (internal == null) continue;

        final pos = internal.positionAbsolute;
        final nodeWidth = internal.measured?.width ?? node.width ?? _kDefaultNodeWidth;
        final nodeHeight = internal.measured?.height ?? node.height ?? _kDefaultNodeHeight;

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
      final containerSize = state.containerSize;
      if (containerSize == null) return;

      // Calculate viewport rect in flow coordinates
      final vpFlowX = -viewport.x / viewport.zoom;
      final vpFlowY = -viewport.y / viewport.zoom;
      final vpFlowWidth = containerSize.width / viewport.zoom;
      final vpFlowHeight = containerSize.height / viewport.zoom;

      // Convert to minimap coordinates
      final vpX = (vpFlowX - minX) * scale + offsetX;
      final vpY = (vpFlowY - minY) * scale + offsetY;
      final vpW = vpFlowWidth * scale;
      final vpH = vpFlowHeight * scale;

      // Draw viewport fill
      final viewportPaint = Paint()
        ..color = maskColor
        ..style = PaintingStyle.fill;

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
    } catch (e, stackTrace) {
      // Log error in debug mode for easier debugging
      debugPrint('MiniMap paint error: $e');
      if (kDebugMode) {
        debugPrint('Stack trace: $stackTrace');
      }
    }
  }

  @override
  bool shouldRepaint(covariant MiniMapPainter oldDelegate) {
    return nodeColor != oldDelegate.nodeColor ||
        nodeColorGetter != oldDelegate.nodeColorGetter ||
        maskColor != oldDelegate.maskColor ||
        nodeStrokeWidth != oldDelegate.nodeStrokeWidth ||
        nodeBorderRadius != oldDelegate.nodeBorderRadius;
  }
}
