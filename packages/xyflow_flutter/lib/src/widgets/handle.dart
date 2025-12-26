import 'package:flutter/material.dart';

import '../core/types/connection.dart';
import '../core/types/handle.dart';
import '../core/types/position.dart';

/// A connection handle widget.
///
/// Handles are the connection points on nodes where edges attach.
class HandleWidget extends StatefulWidget {
  /// Creates a handle widget.
  const HandleWidget({
    super.key,
    required this.type,
    required this.position,
    this.id,
    this.isConnectable = true,
    this.isConnectableStart = true,
    this.isConnectableEnd = true,
    this.onConnect,
    this.isValidConnection,
    this.style,
  });

  /// The handle type (source or target).
  final HandleType type;

  /// The position on the node (left, right, top, bottom).
  final Position position;

  /// Optional unique identifier for this handle.
  final String? id;

  /// Whether this handle can be connected.
  final bool isConnectable;

  /// Whether connections can start from this handle.
  final bool isConnectableStart;

  /// Whether connections can end at this handle.
  final bool isConnectableEnd;

  /// Called when a connection is made to this handle.
  final void Function(Connection connection)? onConnect;

  /// Validates if a connection is valid.
  final bool Function(Connection connection)? isValidConnection;

  /// Custom style for the handle.
  final HandleStyle? style;

  @override
  State<HandleWidget> createState() => _HandleWidgetState();
}

class _HandleWidgetState extends State<HandleWidget> {
  bool _isHovered = false;
  bool _isConnecting = false;

  @override
  Widget build(BuildContext context) {
    // NodeIdProvider.maybeOf(context) can be used for connection context
    final style = widget.style ?? const HandleStyle();

    final size = style.size;
    final color = _getColor(style);

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onPanStart: widget.isConnectable && widget.isConnectableStart
            ? _handleDragStart
            : null,
        onPanUpdate: _isConnecting ? _handleDragUpdate : null,
        onPanEnd: _isConnecting ? _handleDragEnd : null,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(
              color: style.borderColor ?? Colors.white,
              width: style.borderWidth,
            ),
            boxShadow: _isHovered || _isConnecting
                ? [
                    BoxShadow(
                      color: color.withOpacity(0.4),
                      blurRadius: 4,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
        ),
      ),
    );
  }

  Color _getColor(HandleStyle style) {
    if (_isConnecting) {
      return style.activeColor ?? Colors.blue;
    }
    if (_isHovered) {
      return style.hoverColor ?? Colors.blue.shade400;
    }
    return style.color ?? Colors.grey.shade600;
  }

  void _handleDragStart(DragStartDetails details) {
    setState(() => _isConnecting = true);
    // TODO: Start connection via state
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    // TODO: Update connection line position
  }

  void _handleDragEnd(DragEndDetails details) {
    setState(() => _isConnecting = false);
    // TODO: Complete or cancel connection
  }
}

/// Style configuration for handles.
@immutable
class HandleStyle {
  /// Creates a handle style.
  const HandleStyle({
    this.size = 10,
    this.color,
    this.hoverColor,
    this.activeColor,
    this.borderColor,
    this.borderWidth = 2,
  });

  /// The size of the handle.
  final double size;

  /// The default color.
  final Color? color;

  /// The color when hovered.
  final Color? hoverColor;

  /// The color when actively connecting.
  final Color? activeColor;

  /// The border color.
  final Color? borderColor;

  /// The border width.
  final double borderWidth;
}
