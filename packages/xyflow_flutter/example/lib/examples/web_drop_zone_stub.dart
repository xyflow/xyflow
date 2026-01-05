import 'dart:typed_data';
import 'package:flutter/widgets.dart';

/// Stub implementation for non-web platforms
class WebDropZone extends StatelessWidget {
  const WebDropZone({
    super.key,
    required this.child,
    this.onDrop,
    this.onDragEnter,
    this.onDragLeave,
  });

  final Widget child;
  final void Function(Uint8List bytes, String name)? onDrop;
  final VoidCallback? onDragEnter;
  final VoidCallback? onDragLeave;

  @override
  Widget build(BuildContext context) => child;
}
