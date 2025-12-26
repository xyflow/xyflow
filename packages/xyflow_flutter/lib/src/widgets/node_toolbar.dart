import 'package:flutter/material.dart';

import '../core/types/position.dart';
import '../state/xyflow_provider.dart';

/// A toolbar that appears near a node.
class NodeToolbar extends StatelessWidget {
  /// Creates a node toolbar.
  const NodeToolbar({
    super.key,
    required this.children,
    this.position = Position.top,
    this.offset = Offset.zero,
    this.isVisible = true,
    this.align,
  });

  /// The toolbar buttons/content.
  final List<Widget> children;

  /// Position relative to the node (top, bottom, left, right).
  final Position position;

  /// Additional offset from the calculated position.
  final Offset offset;

  /// Whether the toolbar is visible.
  final bool isVisible;

  /// Alignment within the positioned area.
  final Alignment? align;

  @override
  Widget build(BuildContext context) {
    if (!isVisible) return const SizedBox.shrink();

    // Get the node ID from context
    final nodeId = NodeIdProvider.maybeOf(context);
    if (nodeId == null) return const SizedBox.shrink();

    return Material(
      elevation: 4,
      borderRadius: BorderRadius.circular(4),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: children,
        ),
      ),
    );
  }
}

/// A button for use in NodeToolbar.
class NodeToolbarButton extends StatelessWidget {
  /// Creates a toolbar button.
  const NodeToolbarButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.tooltip,
    this.size = 24,
  });

  /// The button icon.
  final IconData icon;

  /// Called when the button is pressed.
  final VoidCallback onPressed;

  /// Optional tooltip text.
  final String? tooltip;

  /// The size of the button.
  final double size;

  @override
  Widget build(BuildContext context) {
    final button = InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(4),
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: Icon(
          icon,
          size: size - 8,
          color: Colors.grey.shade700,
        ),
      ),
    );

    if (tooltip != null) {
      return Tooltip(
        message: tooltip!,
        child: button,
      );
    }

    return button;
  }
}
