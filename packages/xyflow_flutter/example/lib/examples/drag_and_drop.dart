import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// A drag-and-drop example matching the React DragNDrop example.
///
/// Features:
/// - Sidebar with draggable node types (Input, Default, Output)
/// - Drop nodes onto the canvas
/// - Create connections between nodes
/// - Controls for zoom/pan
class DragAndDropExample extends StatefulWidget {
  const DragAndDropExample({super.key});

  @override
  State<DragAndDropExample> createState() => _DragAndDropExampleState();
}

class _DragAndDropExampleState extends State<DragAndDropExample> {
  late List<Node<Map<String, dynamic>>> _nodes;
  late List<Edge<void>> _edges;
  XYFlowController<Map<String, dynamic>, void>? _controller;
  int _nodeId = 0;

  @override
  void initState() {
    super.initState();
    _nodes = [
      Node<Map<String, dynamic>>(
        id: '1',
        type: 'input',
        position: XYPosition(x: 250, y: 5),
        data: {'label': 'input node'},
      ),
    ];
    _edges = [];
  }

  String _getId() => 'dndnode_${_nodeId++}';

  void _onNodesChange(List<NodeChange> changes) {
    setState(() {
      _nodes = applyNodeChanges(changes, _nodes);
    });
  }

  void _onEdgesChange(List<EdgeChange> changes) {
    setState(() {
      _edges = applyEdgeChanges(changes, _edges);
    });
  }

  void _onConnect(Connection connection) {
    setState(() {
      _edges = [
        ..._edges,
        Edge<void>(
          id: 'e${connection.source}-${connection.target}',
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
        ),
      ];
    });
  }

  void _addNode(String type, Offset position) {
    if (_controller == null) return;

    // Convert screen position to canvas position
    final canvasPosition = _controller!.screenToFlow(position);

    final newNode = Node<Map<String, dynamic>>(
      id: _getId(),
      type: type,
      position: XYPosition(x: canvasPosition.dx, y: canvasPosition.dy),
      data: {'label': '$type node'},
    );

    setState(() {
      _nodes = [..._nodes, newNode];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Drag & Drop Example'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Row(
        children: [
          // Sidebar with draggable nodes
          _Sidebar(onNodeDropped: _addNode),

          // Main flow canvas
          Expanded(
            child: DragTarget<String>(
              onAcceptWithDetails: (details) {
                _addNode(details.data, details.offset);
              },
              builder: (context, candidateData, rejectedData) {
                return XYFlow<Map<String, dynamic>, void>(
                  nodes: _nodes,
                  edges: _edges,
                  onNodesChange: _onNodesChange,
                  onEdgesChange: _onEdgesChange,
                  onConnect: _onConnect,
                  onInit: (controller) => _controller = controller,
                  nodeTypes: {
                    'input': (props) => _InputNode(props: props),
                    'default': (props) => _DefaultNode(props: props),
                    'output': (props) => _OutputNode(props: props),
                  },
                  fitViewOnInit: true,
                  children: const [
                    Background(variant: BackgroundVariant.dots),
                    Controls(),
                    MiniMap(),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// Sidebar with draggable node types.
class _Sidebar extends StatelessWidget {
  const _Sidebar({required this.onNodeDropped});

  final void Function(String type, Offset position) onNodeDropped;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      color: Colors.grey[100],
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Drag nodes to the canvas',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          const SizedBox(height: 16),
          _DraggableNode(
            type: 'input',
            label: 'Input Node',
            color: Colors.blue[100]!,
            borderColor: Colors.blue,
          ),
          const SizedBox(height: 8),
          _DraggableNode(
            type: 'default',
            label: 'Default Node',
            color: Colors.white,
            borderColor: Colors.grey,
          ),
          const SizedBox(height: 8),
          _DraggableNode(
            type: 'output',
            label: 'Output Node',
            color: Colors.green[100]!,
            borderColor: Colors.green,
          ),
          const Spacer(),
          const Divider(),
          Text(
            'Keyboard Shortcuts:',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          _ShortcutHint('Delete', 'Remove selected'),
          _ShortcutHint('Ctrl+A', 'Select all'),
          _ShortcutHint('Ctrl+C', 'Copy'),
          _ShortcutHint('Ctrl+V', 'Paste'),
          _ShortcutHint('Ctrl+Z', 'Undo'),
          _ShortcutHint('Arrows', 'Move nodes'),
        ],
      ),
    );
  }
}

class _ShortcutHint extends StatelessWidget {
  const _ShortcutHint(this.shortcut, this.description);

  final String shortcut;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(3),
            ),
            child: Text(
              shortcut,
              style: const TextStyle(fontSize: 10, fontFamily: 'monospace'),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              description,
              style: TextStyle(fontSize: 11, color: Colors.grey[600]),
            ),
          ),
        ],
      ),
    );
  }
}

/// A draggable node widget for the sidebar.
class _DraggableNode extends StatelessWidget {
  const _DraggableNode({
    required this.type,
    required this.label,
    required this.color,
    required this.borderColor,
  });

  final String type;
  final String label;
  final Color color;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return Draggable<String>(
      data: type,
      feedback: Material(
        elevation: 4,
        borderRadius: BorderRadius.circular(4),
        child: _NodeBox(
          label: label,
          color: color,
          borderColor: borderColor,
        ),
      ),
      childWhenDragging: Opacity(
        opacity: 0.5,
        child: _NodeBox(
          label: label,
          color: color,
          borderColor: borderColor,
        ),
      ),
      child: _NodeBox(
        label: label,
        color: color,
        borderColor: borderColor,
      ),
    );
  }
}

class _NodeBox extends StatelessWidget {
  const _NodeBox({
    required this.label,
    required this.color,
    required this.borderColor,
  });

  final String label;
  final Color color;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: borderColor),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 12),
      ),
    );
  }
}

/// Input node (blue, only has output handle).
class _InputNode extends StatelessWidget {
  const _InputNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.blue[300]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(4),
        boxShadow: props.selected
            ? [
                BoxShadow(
                  color: Colors.blue.withValues(alpha: 0.3),
                  blurRadius: 8,
                )
              ]
            : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            props.data['label'] ?? 'Input',
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(height: 8),
          const HandleWidget(
            type: HandleType.source,
            position: Position.bottom,
          ),
        ],
      ),
    );
  }
}

/// Default node (white, has both input and output handles).
class _DefaultNode extends StatelessWidget {
  const _DefaultNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.grey[400]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(4),
        boxShadow: props.selected
            ? [
                BoxShadow(
                  color: Colors.blue.withValues(alpha: 0.3),
                  blurRadius: 8,
                )
              ]
            : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const HandleWidget(
            type: HandleType.target,
            position: Position.top,
          ),
          const SizedBox(height: 8),
          Text(
            props.data['label'] ?? 'Default',
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(height: 8),
          const HandleWidget(
            type: HandleType.source,
            position: Position.bottom,
          ),
        ],
      ),
    );
  }
}

/// Output node (green, only has input handle).
class _OutputNode extends StatelessWidget {
  const _OutputNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.green[50],
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.green[300]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(4),
        boxShadow: props.selected
            ? [
                BoxShadow(
                  color: Colors.blue.withValues(alpha: 0.3),
                  blurRadius: 8,
                )
              ]
            : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const HandleWidget(
            type: HandleType.target,
            position: Position.top,
          ),
          const SizedBox(height: 8),
          Text(
            props.data['label'] ?? 'Output',
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }
}
