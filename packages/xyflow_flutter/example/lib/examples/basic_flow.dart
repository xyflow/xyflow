import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// A basic flow example demonstrating core XYFlow features.
///
/// Features:
/// - Nodes with different types (input, default, output)
/// - Edges connecting nodes
/// - Background with dots pattern
/// - Controls for zoom/pan
/// - MiniMap for navigation
class BasicFlowExample extends StatefulWidget {
  const BasicFlowExample({super.key});

  @override
  State<BasicFlowExample> createState() => _BasicFlowExampleState();
}

class _BasicFlowExampleState extends State<BasicFlowExample> {
  late List<Node<Map<String, dynamic>>> _nodes;
  late List<Edge<void>> _edges;

  @override
  void initState() {
    super.initState();
    _nodes = [
      Node<Map<String, dynamic>>(
        id: '1',
        type: 'input',
        position: XYPosition(x: 250, y: 0),
        data: {'label': 'Start'},
        sourcePosition: Position.bottom, // Handle is at bottom
      ),
      Node<Map<String, dynamic>>(
        id: '2',
        position: XYPosition(x: 100, y: 100),
        data: {'label': 'Process A'},
        sourcePosition: Position.bottom,
        targetPosition: Position.top,
      ),
      Node<Map<String, dynamic>>(
        id: '3',
        position: XYPosition(x: 400, y: 100),
        data: {'label': 'Process B'},
        sourcePosition: Position.bottom,
        targetPosition: Position.top,
      ),
      Node<Map<String, dynamic>>(
        id: '4',
        position: XYPosition(x: 250, y: 200),
        data: {'label': 'Merge'},
        sourcePosition: Position.bottom,
        targetPosition: Position.top,
      ),
      Node<Map<String, dynamic>>(
        id: '5',
        type: 'output',
        position: XYPosition(x: 250, y: 300),
        data: {'label': 'End'},
        targetPosition: Position.top, // Handle is at top
      ),
    ];

    _edges = [
      Edge<void>(id: 'e1-2', source: '1', target: '2'),
      Edge<void>(id: 'e1-3', source: '1', target: '3'),
      Edge<void>(id: 'e2-4', source: '2', target: '4'),
      Edge<void>(id: 'e3-4', source: '3', target: '4'),
      Edge<void>(id: 'e4-5', source: '4', target: '5'),
    ];
  }

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Basic Flow Example'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: XYFlow<Map<String, dynamic>, void>(
        nodes: _nodes,
        edges: _edges,
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        onConnect: _onConnect,
        nodeTypes: {
          'input': (props) => _InputNode(props: props),
          'default': (props) => _DefaultNode(props: props),
          'output': (props) => _OutputNode(props: props),
        },
        fitView: true,
        children: const [
          Background(variant: BackgroundVariant.dots),
          Controls(),
          MiniMap(),
          Panel(
            position: PanelPosition.topLeft,
            child: _InfoPanel(),
          ),
        ],
      ),
    );
  }
}

class _InfoPanel extends StatelessWidget {
  const _InfoPanel();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Basic Flow',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            'Drag nodes to move them\nConnect handles to create edges',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
          ),
        ],
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
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.blue[300]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
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
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.play_circle, color: Colors.blue[700], size: 16),
              const SizedBox(width: 6),
              Text(
                props.data['label'] ?? 'Input',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.blue[900],
                ),
              ),
            ],
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
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.grey[400]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: props.selected
                ? Colors.blue.withValues(alpha: 0.3)
                : Colors.black.withValues(alpha: 0.1),
            blurRadius: props.selected ? 8 : 4,
          ),
        ],
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
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green[50],
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.green[300]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
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
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.check_circle, color: Colors.green[700], size: 16),
              const SizedBox(width: 6),
              Text(
                props.data['label'] ?? 'Output',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.green[900],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
