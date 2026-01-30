import 'package:flutter/material.dart';

import '../core/types/connection.dart';
import '../core/types/handle.dart';
import '../core/types/position.dart';
import '../state/xyflow_provider.dart';

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
  Offset _startGlobalPosition = Offset.zero;
  String? _registeredNodeId;
  // Cache state reference for safe disposal (avoids deactivated ancestor lookup)
  dynamic _cachedState;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _cachedState = XYFlowProvider.maybeOfAny(context);
    _registerHandle();
  }

  @override
  void dispose() {
    _unregisterHandle();
    super.dispose();
  }

  void _registerHandle() {
    final state = _cachedState;
    final nodeId = NodeIdProvider.maybeOf(context);

    if (state == null || nodeId == null) return;
    _registeredNodeId = nodeId;

    // Schedule registration after build to get correct position
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final position = _getHandleFlowPosition();
      if (position != null) {
        state.registerHandle(HandleInfo(
          nodeId: nodeId,
          handleId: widget.id,
          handleType: widget.type,
          position: position,
        ));
      }
    });
  }

  void _unregisterHandle() {
    if (_registeredNodeId == null) return;
    // Use cached state reference — safe during dispose (no ancestor lookup needed)
    final state = _cachedState;
    state?.unregisterHandle(_registeredNodeId!, widget.id, widget.type);
  }

  XYPosition? _getHandleFlowPosition() {
    final RenderBox? box = context.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize) return null;

    final center = box.localToGlobal(Offset(box.size.width / 2, box.size.height / 2));
    return _screenToFlow(context, center);
  }

  @override
  Widget build(BuildContext context) {
    final style = widget.style ?? const HandleStyle();

    final size = style.size;
    final color = _getColor(style);

    // Update handle position on each build (node might have moved)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _updateHandlePosition();
    });

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onPanStart: widget.isConnectable && widget.isConnectableStart
            ? (details) => _handleDragStart(context, details)
            : null,
        onPanUpdate: _isConnecting
            ? (details) => _handleDragUpdate(context, details)
            : null,
        onPanEnd: _isConnecting
            ? (details) => _handleDragEnd(context, details)
            : null,
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
                      color: color.withValues(alpha: 0.4),
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

  void _updateHandlePosition() {
    final state = XYFlowProvider.maybeOfAny(context);
    final nodeId = NodeIdProvider.maybeOf(context);
    if (state == null || nodeId == null) return;

    final position = _getHandleFlowPosition();
    if (position != null) {
      state.updateHandlePosition(nodeId, widget.id, widget.type, position);
    }
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

  void _handleDragStart(BuildContext context, DragStartDetails details) {
    final state = XYFlowProvider.maybeOfAny(context);
    final nodeId = NodeIdProvider.maybeOf(context);

    if (state == null || nodeId == null) return;

    setState(() => _isConnecting = true);
    _startGlobalPosition = details.globalPosition;

    // Get handle position in flow coordinates
    final RenderBox? box = context.findRenderObject() as RenderBox?;
    if (box == null) return;

    final handleCenter = box.localToGlobal(Offset(box.size.width / 2, box.size.height / 2));
    final flowPosition = _screenToFlow(context, handleCenter);

    state.startConnection(
      nodeId: nodeId,
      handleId: widget.id,
      handleType: widget.type,
      position: flowPosition,
    );

    // Call onConnectStart callback
    state.onConnectStart?.call(OnConnectStartParams(
      nodeId: nodeId,
      handleId: widget.id,
      handleType: widget.type,
    ));
  }

  void _handleDragUpdate(BuildContext context, DragUpdateDetails details) {
    final state = XYFlowProvider.maybeOfAny(context);
    if (state == null) return;

    final flowPosition = _screenToFlow(context, details.globalPosition);
    state.updateConnection(flowPosition);
  }

  void _handleDragEnd(BuildContext context, DragEndDetails details) {
    final state = XYFlowProvider.maybeOfAny(context);
    if (state == null) return;

    setState(() => _isConnecting = false);

    // Get the current end position from state
    final endPosition = state.connectionState.endPosition;
    if (endPosition == null) {
      state.endConnection();
      return;
    }

    // Try to complete the connection with a target handle
    final connection = state.endConnectionWithTarget(endPosition);

    // If we got a valid connection, trigger the callbacks
    if (connection != null) {
      // Call local widget callback
      widget.onConnect?.call(connection);
      // Call the XYFlow's onConnect callback via state
      state.onConnect?.call(connection);
    }

    // Call onConnectEnd callback
    state.onConnectEnd?.call(OnConnectEndParams(
      connection: connection,
      isValid: connection != null,
    ));
  }

  XYPosition _screenToFlow(BuildContext context, Offset screenPosition) {
    final state = XYFlowProvider.maybeOfAny(context);
    if (state == null) return XYPosition(x: 0, y: 0);

    final viewport = state.viewport;

    // Find the XYFlow render box to get local position
    // Walk up to find the flow container
    RenderBox? flowBox;
    context.visitAncestorElements((element) {
      if (element.widget.runtimeType.toString().contains('XYFlow')) {
        flowBox = element.findRenderObject() as RenderBox?;
        return false;
      }
      return true;
    });

    if (flowBox == null) {
      // Fallback: use viewport transform directly
      return XYPosition(
        x: (screenPosition.dx - viewport.x) / viewport.zoom,
        y: (screenPosition.dy - viewport.y) / viewport.zoom,
      );
    }

    final localPosition = flowBox!.globalToLocal(screenPosition);
    return XYPosition(
      x: (localPosition.dx - viewport.x) / viewport.zoom,
      y: (localPosition.dy - viewport.y) / viewport.zoom,
    );
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
