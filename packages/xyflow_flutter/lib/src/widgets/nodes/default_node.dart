import 'package:flutter/material.dart';

import '../xyflow.dart';
import '../handle.dart';
import '../../core/types/handle.dart' show HandleType;
import '../../core/types/position.dart';

/// Default node widget used when no custom node type is specified.
class DefaultNode<T> extends StatelessWidget {
  /// Creates a default node.
  const DefaultNode({
    super.key,
    required this.props,
  });

  /// The node props.
  final NodeProps<T> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.grey.shade400,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(5),
        boxShadow: props.selected
            ? [
                BoxShadow(
                  color: Colors.blue.withValues(alpha: 0.3),
                  blurRadius: 8,
                  spreadRadius: 1,
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Node content
          Text(
            _getLabel(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade800,
            ),
          ),
          // Target handle (left)
          Positioned(
            left: -20,
            top: 0,
            bottom: 0,
            child: Center(
              child: HandleWidget(
                type: HandleType.target,
                position: Position.left,
                isConnectable: props.isConnectable,
              ),
            ),
          ),
          // Source handle (right)
          Positioned(
            right: -20,
            top: 0,
            bottom: 0,
            child: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
                isConnectable: props.isConnectable,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getLabel() {
    final data = props.data;
    if (data is Map && data.containsKey('label')) {
      return data['label'].toString();
    }
    if (data is String) {
      return data;
    }
    return props.id;
  }
}

/// An input node with only source handles.
class InputNode<T> extends StatelessWidget {
  /// Creates an input node.
  const InputNode({
    super.key,
    required this.props,
  });

  /// The node props.
  final NodeProps<T> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        border: Border.all(
          color: props.selected ? Colors.green : Colors.green.shade300,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Text(
            _getLabel(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.green.shade800,
            ),
          ),
          // Only source handle
          Positioned(
            right: -20,
            top: 0,
            bottom: 0,
            child: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
                isConnectable: props.isConnectable,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getLabel() {
    final data = props.data;
    if (data is Map && data.containsKey('label')) {
      return data['label'].toString();
    }
    if (data is String) {
      return data;
    }
    return 'Input';
  }
}

/// An output node with only target handles.
class OutputNode<T> extends StatelessWidget {
  /// Creates an output node.
  const OutputNode({
    super.key,
    required this.props,
  });

  /// The node props.
  final NodeProps<T> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        border: Border.all(
          color: props.selected ? Colors.red : Colors.red.shade300,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Text(
            _getLabel(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.red.shade800,
            ),
          ),
          // Only target handle
          Positioned(
            left: -20,
            top: 0,
            bottom: 0,
            child: Center(
              child: HandleWidget(
                type: HandleType.target,
                position: Position.left,
                isConnectable: props.isConnectable,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getLabel() {
    final data = props.data;
    if (data is Map && data.containsKey('label')) {
      return data['label'].toString();
    }
    if (data is String) {
      return data;
    }
    return 'Output';
  }
}

/// A group node that can contain other nodes.
class GroupNode<T> extends StatelessWidget {
  /// Creates a group node.
  const GroupNode({
    super.key,
    required this.props,
  });

  /// The node props.
  final NodeProps<T> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: props.width ?? 200,
      height: props.height ?? 150,
      decoration: BoxDecoration(
        color: Colors.grey.shade100.withValues(alpha: 0.5),
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.grey.shade400,
          width: props.selected ? 2 : 1,
          style: BorderStyle.solid,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Text(
          _getLabel(),
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade600,
          ),
        ),
      ),
    );
  }

  String _getLabel() {
    final data = props.data;
    if (data is Map && data.containsKey('label')) {
      return data['label'].toString();
    }
    if (data is String) {
      return data;
    }
    return 'Group';
  }
}
