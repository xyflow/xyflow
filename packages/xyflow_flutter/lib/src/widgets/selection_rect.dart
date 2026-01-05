import 'package:flutter/material.dart';

import '../core/types/rect.dart';
import '../state/xyflow_provider.dart';

/// A widget that renders a selection rectangle during drag-to-select.
///
/// This allows users to select multiple nodes by drawing a rectangle
/// around them. Similar to selection behavior in design tools.
class SelectionRect<NodeData, EdgeData> extends StatefulWidget {
  /// Creates a selection rectangle widget.
  const SelectionRect({
    super.key,
    this.color,
    this.strokeColor,
    this.strokeWidth = 1.0,
    this.onSelectionChange,
    this.onSelectionEnd,
    this.selectionKeyPressed = false,
  });

  /// Fill color for the selection rectangle.
  final Color? color;

  /// Stroke color for the selection rectangle border.
  final Color? strokeColor;

  /// Width of the selection rectangle border.
  final double strokeWidth;

  /// Called during selection as the rectangle changes.
  final void Function(XYRect rect)? onSelectionChange;

  /// Called when selection ends with the final rectangle.
  final void Function(XYRect rect)? onSelectionEnd;

  /// Whether the selection key (e.g., Shift) is currently pressed.
  /// When true, selection is additive rather than replacing.
  final bool selectionKeyPressed;

  @override
  State<SelectionRect<NodeData, EdgeData>> createState() =>
      _SelectionRectState<NodeData, EdgeData>();
}

class _SelectionRectState<NodeData, EdgeData>
    extends State<SelectionRect<NodeData, EdgeData>> {
  Offset? _startPosition;
  Offset? _currentPosition;
  bool _isSelecting = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final fillColor = widget.color ?? theme.primaryColor.withValues(alpha: 0.1);
    final borderColor = widget.strokeColor ?? theme.primaryColor;

    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onPanStart: _handlePanStart,
      onPanUpdate: _handlePanUpdate,
      onPanEnd: _handlePanEnd,
      child: Stack(
        children: [
          // Selection rectangle overlay
          if (_isSelecting && _startPosition != null && _currentPosition != null)
            Positioned.fill(
              child: CustomPaint(
                painter: _SelectionRectPainter(
                  startPosition: _startPosition!,
                  currentPosition: _currentPosition!,
                  fillColor: fillColor,
                  borderColor: borderColor,
                  strokeWidth: widget.strokeWidth,
                ),
              ),
            ),
        ],
      ),
    );
  }

  void _handlePanStart(DragStartDetails details) {
    setState(() {
      _startPosition = details.localPosition;
      _currentPosition = details.localPosition;
      _isSelecting = true;
    });
  }

  void _handlePanUpdate(DragUpdateDetails details) {
    if (!_isSelecting) return;

    setState(() {
      _currentPosition = details.localPosition;
    });

    // Calculate and report the selection rectangle
    final rect = _calculateRect();
    if (rect != null) {
      widget.onSelectionChange?.call(rect);
      _selectNodesInRect(rect);
    }
  }

  void _handlePanEnd(DragEndDetails details) {
    if (!_isSelecting) return;

    final rect = _calculateRect();
    if (rect != null) {
      widget.onSelectionEnd?.call(rect);
    }

    setState(() {
      _startPosition = null;
      _currentPosition = null;
      _isSelecting = false;
    });
  }

  XYRect? _calculateRect() {
    if (_startPosition == null || _currentPosition == null) return null;

    final state = XYFlowProvider.of<NodeData, EdgeData>(context);
    final viewport = state.viewport;

    // Convert screen coordinates to canvas coordinates
    final startCanvas = viewport.screenToCanvas(_startPosition!);
    final endCanvas = viewport.screenToCanvas(_currentPosition!);

    // Normalize rectangle (handle negative dimensions)
    final minX = startCanvas.dx < endCanvas.dx ? startCanvas.dx : endCanvas.dx;
    final minY = startCanvas.dy < endCanvas.dy ? startCanvas.dy : endCanvas.dy;
    final maxX = startCanvas.dx > endCanvas.dx ? startCanvas.dx : endCanvas.dx;
    final maxY = startCanvas.dy > endCanvas.dy ? startCanvas.dy : endCanvas.dy;

    return XYRect(
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    );
  }

  void _selectNodesInRect(XYRect rect) {
    final state = XYFlowProvider.of<NodeData, EdgeData>(context);
    final intersectingNodes = state.getIntersectingNodes(rect, partially: true);
    final nodeIds = intersectingNodes.map((n) => n.id).toList();

    if (widget.selectionKeyPressed) {
      // Additive selection
      state.selectNodes(nodeIds, additive: true);
    } else {
      // Replace selection
      state.selectNodes(nodeIds);
    }
  }
}

/// Custom painter for drawing the selection rectangle.
class _SelectionRectPainter extends CustomPainter {
  _SelectionRectPainter({
    required this.startPosition,
    required this.currentPosition,
    required this.fillColor,
    required this.borderColor,
    required this.strokeWidth,
  });

  final Offset startPosition;
  final Offset currentPosition;
  final Color fillColor;
  final Color borderColor;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    // Calculate rectangle bounds
    final left =
        startPosition.dx < currentPosition.dx ? startPosition.dx : currentPosition.dx;
    final top =
        startPosition.dy < currentPosition.dy ? startPosition.dy : currentPosition.dy;
    final right =
        startPosition.dx > currentPosition.dx ? startPosition.dx : currentPosition.dx;
    final bottom =
        startPosition.dy > currentPosition.dy ? startPosition.dy : currentPosition.dy;

    final rect = Rect.fromLTRB(left, top, right, bottom);

    // Draw fill
    final fillPaint = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;
    canvas.drawRect(rect, fillPaint);

    // Draw border
    final borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawRect(rect, borderPaint);
  }

  @override
  bool shouldRepaint(_SelectionRectPainter oldDelegate) {
    return startPosition != oldDelegate.startPosition ||
        currentPosition != oldDelegate.currentPosition ||
        fillColor != oldDelegate.fillColor ||
        borderColor != oldDelegate.borderColor ||
        strokeWidth != oldDelegate.strokeWidth;
  }
}
