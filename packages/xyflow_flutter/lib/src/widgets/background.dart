import 'package:flutter/material.dart';

import '../state/xyflow_provider.dart';

/// Background pattern variants.
enum BackgroundVariant {
  /// Dot pattern.
  dots,

  /// Line grid pattern.
  lines,

  /// Cross pattern.
  cross,
}

/// Background widget for the flow canvas.
///
/// Renders a repeating pattern that moves with the viewport.
class Background extends StatelessWidget {
  /// Creates a background widget.
  const Background({
    super.key,
    this.variant = BackgroundVariant.dots,
    this.gap = 20,
    this.size = 1,
    this.color,
    this.lineWidth = 1,
    this.offset,
  });

  /// The pattern variant.
  final BackgroundVariant variant;

  /// The gap between pattern elements.
  final double gap;

  /// The size of pattern elements (dot radius or line length).
  final double size;

  /// The color of the pattern.
  final Color? color;

  /// The width of lines (for lines and cross variants).
  final double lineWidth;

  /// Optional fixed offset (overrides viewport-based positioning).
  final Offset? offset;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: CustomPaint(
          painter: BackgroundPainter(
            variant: variant,
            gap: gap,
            size: size,
            color: color ?? Colors.grey.shade300,
            lineWidth: lineWidth,
            offset: offset,
            context: context,
          ),
          size: Size.infinite,
        ),
      ),
    );
  }
}

/// Custom painter for the background pattern.
class BackgroundPainter extends CustomPainter {
  /// Creates a background painter.
  BackgroundPainter({
    required this.variant,
    required this.gap,
    required this.size,
    required this.color,
    required this.lineWidth,
    this.offset,
    required this.context,
  });

  /// The pattern variant.
  final BackgroundVariant variant;

  /// The gap between pattern elements.
  final double gap;

  /// The size of pattern elements.
  final double size;

  /// The color of the pattern.
  final Color color;

  /// The width of lines.
  final double lineWidth;

  /// Optional fixed offset.
  final Offset? offset;

  /// Build context for accessing state.
  final BuildContext context;

  @override
  void paint(Canvas canvas, Size canvasSize) {
    // Try to get viewport from state
    Offset effectiveOffset = offset ?? Offset.zero;
    double zoom = 1.0;

    try {
      final state = XYFlowProvider.maybeOfAny(context);
      if (state != null) {
        effectiveOffset = Offset(state.viewport.x, state.viewport.y);
        zoom = state.viewport.zoom;
      }
    } catch (_) {
      // Use defaults if state not available
    }

    final scaledGap = gap * zoom;
    if (scaledGap < 1) return; // Don't draw if too zoomed out

    final paint = Paint()
      ..color = color
      ..strokeWidth = lineWidth;

    // Calculate the starting offset
    final startX =
        (effectiveOffset.dx % scaledGap) - scaledGap;
    final startY =
        (effectiveOffset.dy % scaledGap) - scaledGap;

    switch (variant) {
      case BackgroundVariant.dots:
        _paintDots(canvas, canvasSize, startX, startY, scaledGap, paint, zoom);
        break;
      case BackgroundVariant.lines:
        _paintLines(canvas, canvasSize, startX, startY, scaledGap, paint);
        break;
      case BackgroundVariant.cross:
        _paintCross(canvas, canvasSize, startX, startY, scaledGap, paint, zoom);
        break;
    }
  }

  void _paintDots(
    Canvas canvas,
    Size canvasSize,
    double startX,
    double startY,
    double scaledGap,
    Paint paint,
    double zoom,
  ) {
    final dotSize = size * zoom;

    for (double x = startX; x < canvasSize.width + scaledGap; x += scaledGap) {
      for (double y = startY; y < canvasSize.height + scaledGap; y += scaledGap) {
        canvas.drawCircle(Offset(x, y), dotSize, paint);
      }
    }
  }

  void _paintLines(
    Canvas canvas,
    Size canvasSize,
    double startX,
    double startY,
    double scaledGap,
    Paint paint,
  ) {
    // Vertical lines
    for (double x = startX; x < canvasSize.width + scaledGap; x += scaledGap) {
      canvas.drawLine(
        Offset(x, 0),
        Offset(x, canvasSize.height),
        paint,
      );
    }

    // Horizontal lines
    for (double y = startY; y < canvasSize.height + scaledGap; y += scaledGap) {
      canvas.drawLine(
        Offset(0, y),
        Offset(canvasSize.width, y),
        paint,
      );
    }
  }

  void _paintCross(
    Canvas canvas,
    Size canvasSize,
    double startX,
    double startY,
    double scaledGap,
    Paint paint,
    double zoom,
  ) {
    final crossSize = size * zoom * 3;

    for (double x = startX; x < canvasSize.width + scaledGap; x += scaledGap) {
      for (double y = startY; y < canvasSize.height + scaledGap; y += scaledGap) {
        // Horizontal line of cross
        canvas.drawLine(
          Offset(x - crossSize / 2, y),
          Offset(x + crossSize / 2, y),
          paint,
        );
        // Vertical line of cross
        canvas.drawLine(
          Offset(x, y - crossSize / 2),
          Offset(x, y + crossSize / 2),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant BackgroundPainter oldDelegate) {
    return variant != oldDelegate.variant ||
        gap != oldDelegate.gap ||
        size != oldDelegate.size ||
        color != oldDelegate.color ||
        lineWidth != oldDelegate.lineWidth ||
        offset != oldDelegate.offset;
  }
}
