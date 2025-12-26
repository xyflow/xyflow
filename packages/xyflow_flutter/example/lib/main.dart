import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'XYFlow Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const FlowDemoPage(),
    );
  }
}

class FlowDemoPage extends StatefulWidget {
  const FlowDemoPage({super.key});

  @override
  State<FlowDemoPage> createState() => _FlowDemoPageState();
}

class _FlowDemoPageState extends State<FlowDemoPage> {
  // Initial nodes
  late List<Node<Map<String, dynamic>>> _nodes;
  late List<Edge<void>> _edges;
  XYFlowController<Map<String, dynamic>, void>? _controller;

  @override
  void initState() {
    super.initState();
    _initializeFlow();
  }

  void _initializeFlow() {
    _nodes = [
      Node<Map<String, dynamic>>(
        id: '1',
        position: const XYPosition(x: 50, y: 50),
        data: {'label': 'Input Node'},
        type: 'input',
      ),
      Node<Map<String, dynamic>>(
        id: '2',
        position: const XYPosition(x: 250, y: 100),
        data: {'label': 'Process Node'},
      ),
      Node<Map<String, dynamic>>(
        id: '3',
        position: const XYPosition(x: 250, y: 250),
        data: {'label': 'Another Process'},
      ),
      Node<Map<String, dynamic>>(
        id: '4',
        position: const XYPosition(x: 450, y: 175),
        data: {'label': 'Output Node'},
        type: 'output',
      ),
    ];

    _edges = [
      const Edge<void>(
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      ),
      const Edge<void>(
        id: 'e1-3',
        source: '1',
        target: '3',
      ),
      const Edge<void>(
        id: 'e2-4',
        source: '2',
        target: '4',
        type: EdgeTypes.smoothStep,
      ),
      const Edge<void>(
        id: 'e3-4',
        source: '3',
        target: '4',
        type: EdgeTypes.step,
      ),
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

  void _addNode() {
    final newId = (_nodes.length + 1).toString();
    setState(() {
      _nodes = [
        ..._nodes,
        Node<Map<String, dynamic>>(
          id: newId,
          position: XYPosition(
            x: 100 + (_nodes.length * 50) % 300,
            y: 100 + (_nodes.length * 30) % 200,
          ),
          data: {'label': 'New Node $newId'},
        ),
      ];
    });
  }

  void _deleteSelected() {
    final selectedNodeIds = _nodes.where((n) => n.selected).map((n) => n.id).toList();
    final selectedEdgeIds = _edges.where((e) => e.selected).map((e) => e.id).toList();

    if (selectedNodeIds.isNotEmpty || selectedEdgeIds.isNotEmpty) {
      _controller?.deleteElements(
        nodeIds: selectedNodeIds,
        edgeIds: selectedEdgeIds,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('XYFlow Flutter Demo'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Add Node',
            onPressed: _addNode,
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            tooltip: 'Delete Selected',
            onPressed: _deleteSelected,
          ),
          IconButton(
            icon: const Icon(Icons.fit_screen),
            tooltip: 'Fit View',
            onPressed: () => _controller?.fitView(),
          ),
        ],
      ),
      body: XYFlow<Map<String, dynamic>, void>(
        nodes: _nodes,
        edges: _edges,
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        onConnect: _onConnect,
        onInit: (controller) {
          _controller = controller;
          // Fit view after initialization
          Future.delayed(const Duration(milliseconds: 100), () {
            controller.fitView(
              padding: const EdgeInsets.all(50),
            );
          });
        },
        onNodeClick: (node) {
          debugPrint('Node clicked: ${node.id}');
        },
        onEdgeClick: (edge) {
          debugPrint('Edge clicked: ${edge.id}');
        },
        nodeTypes: {
          'input': (props) => _InputNodeWidget(props: props),
          'output': (props) => _OutputNodeWidget(props: props),
        },
        fitView: true,
        snapToGrid: true,
        snapGrid: const (20, 20),
        minZoom: 0.25,
        maxZoom: 4,
        children: const [
          // Background with dots pattern
          Background(
            variant: BackgroundVariant.dots,
            gap: 20,
            size: 1,
          ),
          // Controls panel
          Controls(
            position: PanelPosition.bottomLeft,
            showZoom: true,
            showFitView: true,
          ),
          // MiniMap
          MiniMap(
            position: PanelPosition.bottomRight,
            width: 150,
            height: 100,
          ),
        ],
      ),
    );
  }
}

/// Custom input node widget
class _InputNodeWidget extends StatelessWidget {
  const _InputNodeWidget({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.green.shade400,
            Colors.green.shade600,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected ? Colors.white : Colors.green.shade700,
          width: props.selected ? 3 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.green.withOpacity(0.3),
            blurRadius: props.selected ? 12 : 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.input,
            color: Colors.white,
            size: 18,
          ),
          const SizedBox(width: 8),
          Text(
            props.data['label'] ?? 'Input',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
          const SizedBox(width: 12),
          // Source handle indicator
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.green.shade700, width: 2),
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom output node widget
class _OutputNodeWidget extends StatelessWidget {
  const _OutputNodeWidget({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.red.shade400,
            Colors.red.shade600,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected ? Colors.white : Colors.red.shade700,
          width: props.selected ? 3 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            blurRadius: props.selected ? 12 : 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Target handle indicator
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.red.shade700, width: 2),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            props.data['label'] ?? 'Output',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
          const SizedBox(width: 8),
          const Icon(
            Icons.output,
            color: Colors.white,
            size: 18,
          ),
        ],
      ),
    );
  }
}
