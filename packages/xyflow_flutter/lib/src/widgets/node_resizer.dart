import 'package:flutter/material.dart';

/// Resize directions/corners.
enum ResizeDirection {
  /// Top-left corner.
  topLeft,

  /// Top-right corner.
  topRight,

  /// Bottom-left corner.
  bottomLeft,

  /// Bottom-right corner.
  bottomRight,

  /// Top edge.
  top,

  /// Right edge.
  right,

  /// Bottom edge.
  bottom,

  /// Left edge.
  left,
}

/// A node resizer widget that adds resize handles to a node.
class NodeResizer extends StatefulWidget {
  /// Creates a node resizer.
  const NodeResizer({
    super.key,
    this.minWidth = 10,
    this.maxWidth = double.infinity,
    this.minHeight = 10,
    this.maxHeight = double.infinity,
    this.keepAspectRatio = false,
    this.onResizeStart,
    this.onResize,
    this.onResizeEnd,
    this.handleSize = 8,
    this.handleColor,
    this.handleBorderColor,
    this.isVisible = true,
    this.directions = const [
      ResizeDirection.topLeft,
      ResizeDirection.topRight,
      ResizeDirection.bottomLeft,
      ResizeDirection.bottomRight,
    ],
  });

  /// Minimum allowed width.
  final double minWidth;

  /// Maximum allowed width.
  final double maxWidth;

  /// Minimum allowed height.
  final double minHeight;

  /// Maximum allowed height.
  final double maxHeight;

  /// Whether to maintain aspect ratio while resizing.
  final bool keepAspectRatio;

  /// Called when resizing starts.
  final VoidCallback? onResizeStart;

  /// Called during resizing with new dimensions.
  final void Function(double width, double height)? onResize;

  /// Called when resizing ends.
  final VoidCallback? onResizeEnd;

  /// Size of the resize handles.
  final double handleSize;

  /// Color of the resize handles.
  final Color? handleColor;

  /// Border color of the resize handles.
  final Color? handleBorderColor;

  /// Whether the resizer is visible.
  final bool isVisible;

  /// Which resize handles to show.
  final List<ResizeDirection> directions;

  @override
  State<NodeResizer> createState() => _NodeResizerState();
}

class _NodeResizerState extends State<NodeResizer> {
  // ignore: unused_field - used for visual feedback during resize
  bool _isResizing = false;
  // ignore: unused_field - tracks which handle is being dragged
  ResizeDirection? _activeDirection;

  @override
  Widget build(BuildContext context) {
    if (!widget.isVisible) return const SizedBox.shrink();

    return Stack(
      clipBehavior: Clip.none,
      children: [
        for (final direction in widget.directions)
          _buildHandle(direction),
      ],
    );
  }

  Widget _buildHandle(ResizeDirection direction) {
    final handleColor = widget.handleColor ?? Colors.blue;
    final borderColor = widget.handleBorderColor ?? Colors.white;
    final size = widget.handleSize;

    Offset position;
    MouseCursor cursor;

    switch (direction) {
      case ResizeDirection.topLeft:
        position = Offset(-size / 2, -size / 2);
        cursor = SystemMouseCursors.resizeUpLeftDownRight;
        break;
      case ResizeDirection.topRight:
        position = Offset(-size / 2, -size / 2);
        cursor = SystemMouseCursors.resizeUpRightDownLeft;
        break;
      case ResizeDirection.bottomLeft:
        position = Offset(-size / 2, -size / 2);
        cursor = SystemMouseCursors.resizeUpRightDownLeft;
        break;
      case ResizeDirection.bottomRight:
        position = Offset(-size / 2, -size / 2);
        cursor = SystemMouseCursors.resizeUpLeftDownRight;
        break;
      case ResizeDirection.top:
        position = Offset(0, -size / 2);
        cursor = SystemMouseCursors.resizeUpDown;
        break;
      case ResizeDirection.right:
        position = Offset(-size / 2, 0);
        cursor = SystemMouseCursors.resizeLeftRight;
        break;
      case ResizeDirection.bottom:
        position = Offset(0, -size / 2);
        cursor = SystemMouseCursors.resizeUpDown;
        break;
      case ResizeDirection.left:
        position = Offset(-size / 2, 0);
        cursor = SystemMouseCursors.resizeLeftRight;
        break;
    }

    return Positioned(
      left: _getLeft(direction, position, size),
      top: _getTop(direction, position, size),
      right: _getRight(direction, position, size),
      bottom: _getBottom(direction, position, size),
      child: MouseRegion(
        cursor: cursor,
        child: GestureDetector(
          onPanStart: (_) => _handleResizeStart(direction),
          onPanUpdate: (details) => _handleResizeUpdate(direction, details),
          onPanEnd: (_) => _handleResizeEnd(),
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: handleColor,
              border: Border.all(color: borderColor, width: 1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),
      ),
    );
  }

  double? _getLeft(ResizeDirection direction, Offset position, double size) {
    switch (direction) {
      case ResizeDirection.topLeft:
      case ResizeDirection.bottomLeft:
      case ResizeDirection.left:
        return position.dx;
      case ResizeDirection.top:
      case ResizeDirection.bottom:
        return null; // Centered
      default:
        return null;
    }
  }

  double? _getTop(ResizeDirection direction, Offset position, double size) {
    switch (direction) {
      case ResizeDirection.topLeft:
      case ResizeDirection.topRight:
      case ResizeDirection.top:
        return position.dy;
      case ResizeDirection.left:
      case ResizeDirection.right:
        return null; // Centered
      default:
        return null;
    }
  }

  double? _getRight(ResizeDirection direction, Offset position, double size) {
    switch (direction) {
      case ResizeDirection.topRight:
      case ResizeDirection.bottomRight:
      case ResizeDirection.right:
        return position.dx;
      default:
        return null;
    }
  }

  double? _getBottom(ResizeDirection direction, Offset position, double size) {
    switch (direction) {
      case ResizeDirection.bottomLeft:
      case ResizeDirection.bottomRight:
      case ResizeDirection.bottom:
        return position.dy;
      default:
        return null;
    }
  }

  void _handleResizeStart(ResizeDirection direction) {
    setState(() {
      _isResizing = true;
      _activeDirection = direction;
    });
    widget.onResizeStart?.call();
  }

  void _handleResizeUpdate(ResizeDirection direction, DragUpdateDetails details) {
    // Calculate new dimensions based on drag delta and direction
    // This is a simplified implementation - full version would need
    // current node dimensions and apply constraints
    widget.onResize?.call(
      details.delta.dx,
      details.delta.dy,
    );
  }

  void _handleResizeEnd() {
    setState(() {
      _isResizing = false;
      _activeDirection = null;
    });
    widget.onResizeEnd?.call();
  }
}
