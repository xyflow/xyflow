// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:typed_data';
import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';

/// Web implementation of drop zone using dart:html
class WebDropZone extends StatefulWidget {
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
  State<WebDropZone> createState() => _WebDropZoneState();
}

class _WebDropZoneState extends State<WebDropZone> {
  late html.DivElement _dropZone;
  late String _viewType;
  bool _registered = false;

  @override
  void initState() {
    super.initState();
    _viewType = 'drop-zone-${DateTime.now().millisecondsSinceEpoch}';
    _setupDropZone();
  }

  void _setupDropZone() {
    _dropZone = html.DivElement()
      ..style.width = '100%'
      ..style.height = '100%'
      ..style.position = 'absolute'
      ..style.top = '0'
      ..style.left = '0'
      ..style.pointerEvents = 'auto';

    _dropZone.onDragOver.listen((event) {
      event.preventDefault();
      event.stopPropagation();
    });

    _dropZone.onDragEnter.listen((event) {
      event.preventDefault();
      event.stopPropagation();
      widget.onDragEnter?.call();
    });

    _dropZone.onDragLeave.listen((event) {
      event.preventDefault();
      event.stopPropagation();
      widget.onDragLeave?.call();
    });

    _dropZone.onDrop.listen((event) async {
      event.preventDefault();
      event.stopPropagation();
      widget.onDragLeave?.call();

      final files = event.dataTransfer?.files;
      if (files != null && files.isNotEmpty) {
        final file = files[0];
        final reader = html.FileReader();

        reader.onLoadEnd.listen((event) {
          final result = reader.result;
          if (result is Uint8List) {
            widget.onDrop?.call(result, file.name);
          }
        });

        reader.readAsArrayBuffer(file);
      }
    });

    // Register the platform view factory only once
    if (!_registered) {
      ui_web.platformViewRegistry.registerViewFactory(
        _viewType,
        (int viewId) => _dropZone,
      );
      _registered = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        Positioned.fill(
          child: IgnorePointer(
            ignoring: false,
            child: HtmlElementView(viewType: _viewType),
          ),
        ),
      ],
    );
  }
}
