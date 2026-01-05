import 'package:flutter/widgets.dart';

import '../core/types/edge.dart';
import '../core/types/node.dart';
import 'xyflow_state.dart';

/// Provides XYFlow state to descendants.
///
/// This is similar to ReactFlowProvider in the React version.
class XYFlowProvider<NodeData, EdgeData>
    extends InheritedNotifier<XYFlowState<NodeData, EdgeData>> {
  /// Creates an XYFlow provider.
  const XYFlowProvider({
    super.key,
    required XYFlowState<NodeData, EdgeData> state,
    required super.child,
  }) : super(notifier: state);

  /// Gets the state from the nearest ancestor provider.
  static XYFlowState<NodeData, EdgeData>
      of<NodeData, EdgeData>(BuildContext context) {
    final provider = context
        .dependOnInheritedWidgetOfExactType<XYFlowProvider<NodeData, EdgeData>>();
    if (provider == null) {
      throw FlutterError(
        'XYFlowProvider.of() was called with a context that does not contain an XYFlowProvider.\n'
        'No XYFlowProvider ancestor could be found starting from the context that was passed to XYFlowProvider.of().\n'
        'This can happen if the context you used comes from a widget above the XYFlowProvider.\n'
        'The context used was: $context',
      );
    }
    return provider.notifier!;
  }

  /// Gets the state from the nearest ancestor provider, or null if not found.
  static XYFlowState<NodeData, EdgeData>?
      maybeOf<NodeData, EdgeData>(BuildContext context) {
    final provider = context
        .dependOnInheritedWidgetOfExactType<XYFlowProvider<NodeData, EdgeData>>();
    return provider?.notifier;
  }

  /// Gets the state from the nearest ancestor provider without type constraints.
  ///
  /// This is useful for widgets like Controls and Background that need to
  /// access the state but don't know the specific NodeData/EdgeData types.
  static XYFlowState<dynamic, dynamic>? maybeOfAny(BuildContext context) {
    final element = context.getElementForInheritedWidgetOfExactType<XYFlowProvider<dynamic, dynamic>>();
    if (element != null) {
      return (element.widget as XYFlowProvider<dynamic, dynamic>).notifier;
    }
    // Try to find any XYFlowProvider in the tree
    XYFlowState<dynamic, dynamic>? result;
    context.visitAncestorElements((element) {
      if (element.widget is XYFlowProvider) {
        final provider = element.widget as XYFlowProvider;
        result = provider.notifier as XYFlowState<dynamic, dynamic>?;
        return false; // Stop visiting
      }
      return true; // Continue visiting
    });
    return result;
  }

  @override
  bool updateShouldNotify(
    covariant XYFlowProvider<NodeData, EdgeData> oldWidget,
  ) {
    return notifier != oldWidget.notifier;
  }
}

/// Provides access to the XYFlow state and controller.
///
/// Use this mixin in your widgets to access XYFlow functionality.
mixin XYFlowScope<NodeData, EdgeData> on Widget {
  /// Gets the XYFlow state.
  static XYFlowState<NodeData, EdgeData>
      stateOf<NodeData, EdgeData>(BuildContext context) {
    return XYFlowProvider.of<NodeData, EdgeData>(context);
  }
}

/// A widget that provides convenient access to XYFlow state.
class XYFlowConsumer<NodeData, EdgeData> extends StatelessWidget {
  /// Creates an XYFlow consumer.
  const XYFlowConsumer({
    super.key,
    required this.builder,
    this.child,
  });

  /// Builder function that receives the state.
  final Widget Function(
    BuildContext context,
    XYFlowState<NodeData, EdgeData> state,
    Widget? child,
  ) builder;

  /// Optional child widget that doesn't depend on state.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final state = XYFlowProvider.of<NodeData, EdgeData>(context);
    return builder(context, state, child);
  }
}

/// A widget that rebuilds when specific parts of XYFlow state change.
class XYFlowSelector<NodeData, EdgeData, T> extends StatefulWidget {
  /// Creates an XYFlow selector.
  const XYFlowSelector({
    super.key,
    required this.selector,
    required this.builder,
    this.child,
  });

  /// Selector function that extracts the value to listen to.
  final T Function(XYFlowState<NodeData, EdgeData> state) selector;

  /// Builder function that receives the selected value.
  final Widget Function(BuildContext context, T value, Widget? child) builder;

  /// Optional child widget that doesn't depend on the selected value.
  final Widget? child;

  @override
  State<XYFlowSelector<NodeData, EdgeData, T>> createState() =>
      _XYFlowSelectorState<NodeData, EdgeData, T>();
}

class _XYFlowSelectorState<NodeData, EdgeData, T>
    extends State<XYFlowSelector<NodeData, EdgeData, T>> {
  T? _previousValue;

  @override
  Widget build(BuildContext context) {
    final state = XYFlowProvider.of<NodeData, EdgeData>(context);
    final value = widget.selector(state);

    // Only rebuild if value changed
    if (_previousValue != value) {
      _previousValue = value;
    }

    return widget.builder(context, value, widget.child);
  }
}

/// Provides the current node ID to descendants.
///
/// This is used inside custom node widgets to access the node ID.
class NodeIdProvider extends InheritedWidget {
  /// Creates a node ID provider.
  const NodeIdProvider({
    super.key,
    required this.nodeId,
    required super.child,
  });

  /// The node ID.
  final String nodeId;

  /// Gets the node ID from the nearest ancestor provider.
  static String of(BuildContext context) {
    final provider =
        context.dependOnInheritedWidgetOfExactType<NodeIdProvider>();
    if (provider == null) {
      throw FlutterError(
        'NodeIdProvider.of() was called with a context that does not contain a NodeIdProvider.\n'
        'This usually means you are trying to access the node ID outside of a custom node widget.\n'
        'The context used was: $context',
      );
    }
    return provider.nodeId;
  }

  /// Gets the node ID from the nearest ancestor provider, or null if not found.
  static String? maybeOf(BuildContext context) {
    final provider =
        context.dependOnInheritedWidgetOfExactType<NodeIdProvider>();
    return provider?.nodeId;
  }

  @override
  bool updateShouldNotify(NodeIdProvider oldWidget) {
    return nodeId != oldWidget.nodeId;
  }
}

/// Hook-like function to get the current node ID.
///
/// Must be called within a custom node widget.
String useNodeId(BuildContext context) => NodeIdProvider.of(context);

/// Hook-like function to get a node by ID.
Node<NodeData>? useNode<NodeData, EdgeData>(BuildContext context, String id) {
  return XYFlowProvider.of<NodeData, EdgeData>(context).getNode(id);
}

/// Hook-like function to get all nodes.
List<Node<NodeData>> useNodes<NodeData, EdgeData>(BuildContext context) {
  return XYFlowProvider.of<NodeData, EdgeData>(context).nodes;
}

/// Hook-like function to get all edges.
List<Edge<EdgeData>> useEdges<NodeData, EdgeData>(BuildContext context) {
  return XYFlowProvider.of<NodeData, EdgeData>(context).edges;
}
