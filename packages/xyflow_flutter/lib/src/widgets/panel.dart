import 'package:flutter/material.dart';

/// Position options for panels.
enum PanelPosition {
  /// Top-left corner.
  topLeft,

  /// Top-center.
  topCenter,

  /// Top-right corner.
  topRight,

  /// Bottom-left corner.
  bottomLeft,

  /// Bottom-center.
  bottomCenter,

  /// Bottom-right corner.
  bottomRight,

  /// Center-left.
  centerLeft,

  /// Center-right.
  centerRight,
}

/// A positioned panel widget.
///
/// Panels are fixed-position containers that float over the flow canvas.
class Panel extends StatelessWidget {
  /// Creates a panel widget.
  const Panel({
    super.key,
    required this.child,
    this.position = PanelPosition.topLeft,
    this.padding,
  });

  /// The content of the panel.
  final Widget child;

  /// The position of the panel.
  final PanelPosition position;

  /// Optional padding around the panel.
  final EdgeInsets? padding;

  @override
  Widget build(BuildContext context) {
    final effectivePadding = padding ?? const EdgeInsets.all(10);

    return Positioned(
      top: _getTop(position, effectivePadding),
      left: _getLeft(position, effectivePadding),
      right: _getRight(position, effectivePadding),
      bottom: _getBottom(position, effectivePadding),
      child: child,
    );
  }

  double? _getTop(PanelPosition pos, EdgeInsets padding) {
    switch (pos) {
      case PanelPosition.topLeft:
      case PanelPosition.topCenter:
      case PanelPosition.topRight:
        return padding.top;
      case PanelPosition.centerLeft:
      case PanelPosition.centerRight:
      case PanelPosition.bottomLeft:
      case PanelPosition.bottomCenter:
      case PanelPosition.bottomRight:
        return null;
    }
  }

  double? _getLeft(PanelPosition pos, EdgeInsets padding) {
    switch (pos) {
      case PanelPosition.topLeft:
      case PanelPosition.bottomLeft:
      case PanelPosition.centerLeft:
        return padding.left;
      case PanelPosition.topCenter:
      case PanelPosition.bottomCenter:
      case PanelPosition.topRight:
      case PanelPosition.centerRight:
      case PanelPosition.bottomRight:
        return null;
    }
  }

  double? _getRight(PanelPosition pos, EdgeInsets padding) {
    switch (pos) {
      case PanelPosition.topRight:
      case PanelPosition.bottomRight:
      case PanelPosition.centerRight:
        return padding.right;
      case PanelPosition.topCenter:
      case PanelPosition.bottomCenter:
      case PanelPosition.topLeft:
      case PanelPosition.centerLeft:
      case PanelPosition.bottomLeft:
        return null;
    }
  }

  double? _getBottom(PanelPosition pos, EdgeInsets padding) {
    switch (pos) {
      case PanelPosition.bottomLeft:
      case PanelPosition.bottomCenter:
      case PanelPosition.bottomRight:
        return padding.bottom;
      case PanelPosition.topLeft:
      case PanelPosition.topCenter:
      case PanelPosition.topRight:
      case PanelPosition.centerLeft:
      case PanelPosition.centerRight:
        return null;
    }
  }
}
