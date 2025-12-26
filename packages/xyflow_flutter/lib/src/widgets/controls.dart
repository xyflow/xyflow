import 'package:flutter/material.dart';

import '../state/xyflow_controller.dart';
import '../state/xyflow_provider.dart';
import 'panel.dart';

/// Control button widget for the Controls panel.
class ControlButton extends StatelessWidget {
  /// Creates a control button.
  const ControlButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.tooltip,
    this.disabled = false,
  });

  /// The button icon.
  final IconData icon;

  /// Called when the button is pressed.
  final VoidCallback? onPressed;

  /// Optional tooltip text.
  final String? tooltip;

  /// Whether the button is disabled.
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final button = Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: disabled ? null : onPressed,
        borderRadius: BorderRadius.circular(4),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Icon(
            icon,
            size: 18,
            color: disabled ? Colors.grey.shade400 : Colors.grey.shade700,
          ),
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

/// Controls widget for zoom and fit view actions.
class Controls extends StatelessWidget {
  /// Creates a controls widget.
  const Controls({
    super.key,
    this.position = PanelPosition.bottomLeft,
    this.showZoom = true,
    this.showFitView = true,
    this.showInteractive = false,
    this.onZoomIn,
    this.onZoomOut,
    this.onFitView,
    this.onInteractiveChange,
    this.fitViewOptions,
  });

  /// The position of the controls panel.
  final PanelPosition position;

  /// Whether to show zoom buttons.
  final bool showZoom;

  /// Whether to show fit view button.
  final bool showFitView;

  /// Whether to show interactive toggle button.
  final bool showInteractive;

  /// Custom zoom in handler.
  final VoidCallback? onZoomIn;

  /// Custom zoom out handler.
  final VoidCallback? onZoomOut;

  /// Custom fit view handler.
  final VoidCallback? onFitView;

  /// Called when interactive mode changes.
  final void Function(bool interactive)? onInteractiveChange;

  /// Options for fit view.
  final dynamic fitViewOptions;

  @override
  Widget build(BuildContext context) {
    return Panel(
      position: position,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showZoom) ...[
              ControlButton(
                icon: Icons.add,
                tooltip: 'Zoom in',
                onPressed: () {
                  if (onZoomIn != null) {
                    onZoomIn!();
                  } else {
                    _getController(context)?.zoomIn();
                  }
                },
              ),
              const Divider(height: 1),
              ControlButton(
                icon: Icons.remove,
                tooltip: 'Zoom out',
                onPressed: () {
                  if (onZoomOut != null) {
                    onZoomOut!();
                  } else {
                    _getController(context)?.zoomOut();
                  }
                },
              ),
            ],
            if (showFitView) ...[
              if (showZoom) const Divider(height: 1),
              ControlButton(
                icon: Icons.fit_screen,
                tooltip: 'Fit view',
                onPressed: () {
                  if (onFitView != null) {
                    onFitView!();
                  } else {
                    _getController(context)?.fitView();
                  }
                },
              ),
            ],
            if (showInteractive) ...[
              const Divider(height: 1),
              ControlButton(
                icon: Icons.lock_open,
                tooltip: 'Toggle interactive',
                onPressed: () => onInteractiveChange?.call(true),
              ),
            ],
          ],
        ),
      ),
    );
  }

  XYFlowController<dynamic, dynamic>? _getController(BuildContext context) {
    try {
      final state = XYFlowProvider.maybeOf<dynamic, dynamic>(context);
      if (state != null) {
        return XYFlowController(state: state);
      }
    } catch (_) {}
    return null;
  }
}
