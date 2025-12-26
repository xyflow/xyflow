import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// An example demonstrating different edge types.
///
/// Features:
/// - Bezier edges (default curved)
/// - Straight edges
/// - Step edges (right angles)
/// - Smooth step edges (rounded right angles)
/// - Animated edges
/// - Edge labels
class EdgeTypesExample extends StatefulWidget {
  const EdgeTypesExample({super.key});

  @override
  State<EdgeTypesExample> createState() => _EdgeTypesExampleState();
}

class _EdgeTypesExampleState extends State<EdgeTypesExample> {
  late List<Node<Map<String, dynamic>>> _nodes;
  late List<Edge<Map<String, dynamic>>> _edges;
  EdgeType _selectedEdgeType = EdgeType.bezier;

  @override
  void initState() {
    super.initState();
    _initializeGraph();
  }

  void _initializeGraph() {
    _nodes = [
      Node<Map<String, dynamic>>(
        id: 'source',
        type: 'source',
        position: XYPosition(x: 50, y: 150),
        data: {'label': 'Source'},
      ),
      Node<Map<String, dynamic>>(
        id: 'bezier',
        position: XYPosition(x: 300, y: 0),
        data: {'label': 'Bezier Edge'},
      ),
      Node<Map<String, dynamic>>(
        id: 'straight',
        position: XYPosition(x: 300, y: 100),
        data: {'label': 'Straight Edge'},
      ),
      Node<Map<String, dynamic>>(
        id: 'step',
        position: XYPosition(x: 300, y: 200),
        data: {'label': 'Step Edge'},
      ),
      Node<Map<String, dynamic>>(
        id: 'smoothstep',
        position: XYPosition(x: 300, y: 300),
        data: {'label': 'Smooth Step Edge'},
      ),
    ];

    _edges = [
      Edge<Map<String, dynamic>>(
        id: 'e-bezier',
        source: 'source',
        target: 'bezier',
        type: EdgeType.bezier,
        data: {'label': 'Bezier'},
      ),
      Edge<Map<String, dynamic>>(
        id: 'e-straight',
        source: 'source',
        target: 'straight',
        type: EdgeType.straight,
        data: {'label': 'Straight'},
      ),
      Edge<Map<String, dynamic>>(
        id: 'e-step',
        source: 'source',
        target: 'step',
        type: EdgeType.step,
        data: {'label': 'Step'},
      ),
      Edge<Map<String, dynamic>>(
        id: 'e-smoothstep',
        source: 'source',
        target: 'smoothstep',
        type: EdgeType.smoothStep,
        data: {'label': 'Smooth'},
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
        Edge<Map<String, dynamic>>(
          id: 'e${connection.source}-${connection.target}',
          source: connection.source,
          target: connection.target,
          type: _selectedEdgeType,
          data: {'label': _selectedEdgeType.name},
        ),
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edge Types Example'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: XYFlow<Map<String, dynamic>, Map<String, dynamic>>(
        nodes: _nodes,
        edges: _edges,
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        onConnect: _onConnect,
        nodeTypes: {
          'source': (props) => _SourceNode(props: props),
          'default': (props) => _TargetNode(props: props),
        },
        edgeTypes: {
          EdgeType.bezier: (props) => _LabeledBezierEdge(props: props),
          EdgeType.straight: (props) => _LabeledStraightEdge(props: props),
          EdgeType.step: (props) => _LabeledStepEdge(props: props),
          EdgeType.smoothStep: (props) => _LabeledSmoothStepEdge(props: props),
        },
        fitViewOnInit: true,
        children: [
          const Background(variant: BackgroundVariant.dots),
          const Controls(),
          Panel(
            position: PanelPosition.topLeft,
            child: _EdgeTypeSelector(
              selectedType: _selectedEdgeType,
              onTypeChanged: (type) => setState(() => _selectedEdgeType = type),
            ),
          ),
        ],
      ),
    );
  }
}

/// Panel to select the edge type for new connections.
class _EdgeTypeSelector extends StatelessWidget {
  const _EdgeTypeSelector({
    required this.selectedType,
    required this.onTypeChanged,
  });

  final EdgeType selectedType;
  final ValueChanged<EdgeType> onTypeChanged;

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
            'New Connection Type',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          ),
          const SizedBox(height: 8),
          ...EdgeType.values.map((type) => _EdgeTypeOption(
                type: type,
                isSelected: selectedType == type,
                onTap: () => onTypeChanged(type),
              )),
        ],
      ),
    );
  }
}

class _EdgeTypeOption extends StatelessWidget {
  const _EdgeTypeOption({
    required this.type,
    required this.isSelected,
    required this.onTap,
  });

  final EdgeType type;
  final bool isSelected;
  final VoidCallback onTap;

  String _getTypeName() {
    switch (type) {
      case EdgeType.bezier:
        return 'Bezier';
      case EdgeType.straight:
        return 'Straight';
      case EdgeType.step:
        return 'Step';
      case EdgeType.smoothStep:
        return 'Smooth Step';
      case EdgeType.simpleBezier:
        return 'Simple Bezier';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 4),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue[50] : Colors.transparent,
          borderRadius: BorderRadius.circular(4),
          border: isSelected ? Border.all(color: Colors.blue) : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              size: 16,
              color: isSelected ? Colors.blue : Colors.grey,
            ),
            const SizedBox(width: 8),
            Text(
              _getTypeName(),
              style: TextStyle(
                fontSize: 12,
                color: isSelected ? Colors.blue : Colors.grey[700],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Source node with multiple output handles.
class _SourceNode extends StatelessWidget {
  const _SourceNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.indigo[50],
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.indigo[300]!,
          width: props.selected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: props.selected
                ? Colors.blue.withValues(alpha: 0.3)
                : Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.source, color: Colors.indigo[700], size: 20),
              const SizedBox(width: 8),
              Text(
                props.data['label'] ?? 'Source',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo[900],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const HandleWidget(
            type: HandleType.source,
            position: Position.right,
          ),
        ],
      ),
    );
  }
}

/// Target node with input handle.
class _TargetNode extends StatelessWidget {
  const _TargetNode({required this.props});

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
            blurRadius: 8,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const HandleWidget(
            type: HandleType.target,
            position: Position.left,
          ),
          const SizedBox(width: 8),
          Text(
            props.data['label'] ?? 'Target',
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }
}

/// Bezier edge with label.
class _LabeledBezierEdge extends StatelessWidget {
  const _LabeledBezierEdge({required this.props});

  final EdgeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return BezierEdge(
      id: props.id,
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      selected: props.selected,
      style: EdgeStyle(
        strokeColor: props.selected ? Colors.blue : Colors.indigo,
        strokeWidth: props.selected ? 2.5 : 2.0,
      ),
      label: props.data?['label'],
      labelStyle: TextStyle(
        fontSize: 10,
        color: Colors.indigo[700],
        backgroundColor: Colors.white,
      ),
    );
  }
}

/// Straight edge with label.
class _LabeledStraightEdge extends StatelessWidget {
  const _LabeledStraightEdge({required this.props});

  final EdgeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return StraightEdge(
      id: props.id,
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      selected: props.selected,
      style: EdgeStyle(
        strokeColor: props.selected ? Colors.blue : Colors.teal,
        strokeWidth: props.selected ? 2.5 : 2.0,
      ),
      label: props.data?['label'],
      labelStyle: TextStyle(
        fontSize: 10,
        color: Colors.teal[700],
        backgroundColor: Colors.white,
      ),
    );
  }
}

/// Step edge with label.
class _LabeledStepEdge extends StatelessWidget {
  const _LabeledStepEdge({required this.props});

  final EdgeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return StepEdge(
      id: props.id,
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      selected: props.selected,
      style: EdgeStyle(
        strokeColor: props.selected ? Colors.blue : Colors.orange,
        strokeWidth: props.selected ? 2.5 : 2.0,
      ),
      label: props.data?['label'],
      labelStyle: TextStyle(
        fontSize: 10,
        color: Colors.orange[700],
        backgroundColor: Colors.white,
      ),
    );
  }
}

/// Smooth step edge with label.
class _LabeledSmoothStepEdge extends StatelessWidget {
  const _LabeledSmoothStepEdge({required this.props});

  final EdgeProps<Map<String, dynamic>> props;

  @override
  Widget build(BuildContext context) {
    return SmoothStepEdge(
      id: props.id,
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      selected: props.selected,
      style: EdgeStyle(
        strokeColor: props.selected ? Colors.blue : Colors.purple,
        strokeWidth: props.selected ? 2.5 : 2.0,
      ),
      label: props.data?['label'],
      labelStyle: TextStyle(
        fontSize: 10,
        color: Colors.purple[700],
        backgroundColor: Colors.white,
      ),
    );
  }
}
