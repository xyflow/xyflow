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
    this.iconColor,
    this.disabledIconColor,
  });

  /// The button icon.
  final IconData icon;

  /// Called when the button is pressed.
  final VoidCallback? onPressed;

  /// Optional tooltip text.
  final String? tooltip;

  /// Whether the button is disabled.
  final bool disabled;

  /// Icon color when enabled.
  final Color? iconColor;

  /// Icon color when disabled.
  final Color? disabledIconColor;

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
            color: disabled
                ? (disabledIconColor ?? Colors.grey.shade400)
                : (iconColor ?? Colors.grey.shade700),
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
    this.backgroundColor,
    this.iconColor,
    this.disabledIconColor,
    this.dividerColor,
    this.borderColor,
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

  /// Background color of the controls panel.
  final Color? backgroundColor;

  /// Icon color for enabled buttons.
  final Color? iconColor;

  /// Icon color for disabled buttons.
  final Color? disabledIconColor;

  /// Divider color between buttons.
  final Color? dividerColor;

  /// Border color of the controls panel.
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final effectiveDividerColor = dividerColor ?? Colors.grey.shade300;

    return Panel(
      position: position,
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor ?? Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: borderColor != null
              ? Border.all(color: borderColor!)
              : null,
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
                iconColor: iconColor,
                disabledIconColor: disabledIconColor,
                onPressed: () {
                  if (onZoomIn != null) {
                    onZoomIn!();
                  } else {
                    _getController(context)?.zoomIn();
                  }
                },
              ),
              Divider(height: 1, color: effectiveDividerColor),
              ControlButton(
                icon: Icons.remove,
                tooltip: 'Zoom out',
                iconColor: iconColor,
                disabledIconColor: disabledIconColor,
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
              if (showZoom) Divider(height: 1, color: effectiveDividerColor),
              ControlButton(
                icon: Icons.fit_screen,
                tooltip: 'Fit view',
                iconColor: iconColor,
                disabledIconColor: disabledIconColor,
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
              Divider(height: 1, color: effectiveDividerColor),
              ControlButton(
                icon: Icons.lock_open,
                tooltip: 'Toggle interactive',
                iconColor: iconColor,
                disabledIconColor: disabledIconColor,
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
      final state = XYFlowProvider.maybeOfAny(context);
      if (state != null) {
        return XYFlowController(state: state);
      }
    } catch (_) {}
    return null;
  }
}
