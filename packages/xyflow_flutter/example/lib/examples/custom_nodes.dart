import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// An example demonstrating custom node types.
///
/// Features:
/// - Multiple custom node types with different designs
/// - Card node with header, body, and footer
/// - Gradient node with animated appearance
/// - Icon node with circular design
/// - Custom handles with different styles
class CustomNodesExample extends StatefulWidget {
  const CustomNodesExample({super.key});

  @override
  State<CustomNodesExample> createState() => _CustomNodesExampleState();
}

class _CustomNodesExampleState extends State<CustomNodesExample> {
  late List<Node<Map<String, dynamic>>> _nodes;
  late List<Edge<void>> _edges;

  @override
  void initState() {
    super.initState();
    _nodes = [
      Node<Map<String, dynamic>>(
        id: '1',
        type: 'card',
        position: XYPosition(x: 50, y: 50),
        data: {
          'title': 'Data Source',
          'description': 'Fetches data from API',
          'status': 'active',
        },
      ),
      Node<Map<String, dynamic>>(
        id: '2',
        type: 'gradient',
        position: XYPosition(x: 350, y: 30),
        data: {
          'label': 'Transform',
          'color': 'purple',
        },
      ),
      Node<Map<String, dynamic>>(
        id: '3',
        type: 'icon',
        position: XYPosition(x: 150, y: 200),
        data: {
          'icon': 'filter',
          'label': 'Filter',
        },
      ),
      Node<Map<String, dynamic>>(
        id: '4',
        type: 'icon',
        position: XYPosition(x: 350, y: 200),
        data: {
          'icon': 'analytics',
          'label': 'Analyze',
        },
      ),
      Node<Map<String, dynamic>>(
        id: '5',
        type: 'card',
        position: XYPosition(x: 200, y: 350),
        data: {
          'title': 'Output',
          'description': 'Saves results to database',
          'status': 'pending',
        },
      ),
    ];

    _edges = [
      Edge<void>(id: 'e1-2', source: '1', target: '2'),
      Edge<void>(id: 'e1-3', source: '1', target: '3'),
      Edge<void>(id: 'e2-4', source: '2', target: '4'),
      Edge<void>(id: 'e3-5', source: '3', target: '5'),
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
        ),
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom Nodes Example'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: XYFlow<Map<String, dynamic>, void>(
        nodes: _nodes,
        edges: _edges,
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        onConnect: _onConnect,
        nodeTypes: {
          'card': (props) => _CardNode(props: props),
          'gradient': (props) => _GradientNode(props: props),
          'icon': (props) => _IconNode(props: props),
        },
        fitViewOnInit: true,
        children: const [
          Background(
            variant: BackgroundVariant.lines,
            color: Color(0xFFE8E8E8),
          ),
          Controls(),
          MiniMap(),
        ],
      ),
    );
  }
}

/// A card-style node with header, body, and status indicator.
class _CardNode extends StatelessWidget {
  const _CardNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'active':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'error':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = props.data['title'] ?? 'Card';
    final description = props.data['description'] ?? '';
    final status = props.data['status'] as String?;
    final statusColor = _getStatusColor(status);

    return Container(
      width: 200,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: props.selected ? Colors.blue : Colors.grey[300]!,
          width: props.selected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: props.selected
                ? Colors.blue.withValues(alpha: 0.2)
                : Colors.black.withValues(alpha: 0.08),
            blurRadius: props.selected ? 12 : 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(11)),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: statusColor,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ),
                const HandleWidget(
                  type: HandleType.target,
                  position: Position.top,
                ),
              ],
            ),
          ),
          // Body
          Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              description,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ),
          // Footer with handle
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  status?.toUpperCase() ?? '',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: statusColor,
                  ),
                ),
                const HandleWidget(
                  type: HandleType.source,
                  position: Position.bottom,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// A gradient node with colorful background.
class _GradientNode extends StatelessWidget {
  const _GradientNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  List<Color> _getGradientColors(String? color) {
    switch (color) {
      case 'purple':
        return [Colors.purple[400]!, Colors.pink[400]!];
      case 'blue':
        return [Colors.blue[400]!, Colors.cyan[400]!];
      case 'green':
        return [Colors.green[400]!, Colors.teal[400]!];
      case 'orange':
        return [Colors.orange[400]!, Colors.red[400]!];
      default:
        return [Colors.grey[400]!, Colors.grey[600]!];
    }
  }

  @override
  Widget build(BuildContext context) {
    final label = props.data['label'] ?? 'Gradient';
    final color = props.data['color'] as String?;
    final gradientColors = _getGradientColors(color);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: props.selected
            ? Border.all(color: Colors.white, width: 3)
            : null,
        boxShadow: [
          BoxShadow(
            color: gradientColors[0].withValues(alpha: 0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
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
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
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

/// A circular icon node.
class _IconNode extends StatelessWidget {
  const _IconNode({required this.props});

  final NodeProps<Map<String, dynamic>> props;

  IconData _getIcon(String? iconName) {
    switch (iconName) {
      case 'filter':
        return Icons.filter_list;
      case 'analytics':
        return Icons.analytics;
      case 'cloud':
        return Icons.cloud;
      case 'database':
        return Icons.storage;
      case 'api':
        return Icons.api;
      default:
        return Icons.circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final iconName = props.data['icon'] as String?;
    final label = props.data['label'] ?? 'Icon';
    final icon = _getIcon(iconName);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const HandleWidget(
          type: HandleType.target,
          position: Position.top,
        ),
        const SizedBox(height: 4),
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            border: Border.all(
              color: props.selected ? Colors.blue : Colors.grey[300]!,
              width: props.selected ? 3 : 2,
            ),
            boxShadow: [
              BoxShadow(
                color: props.selected
                    ? Colors.blue.withValues(alpha: 0.3)
                    : Colors.black.withValues(alpha: 0.1),
                blurRadius: 8,
              ),
            ],
          ),
          child: Icon(
            icon,
            color: props.selected ? Colors.blue : Colors.grey[700],
            size: 28,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(4),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 4,
              ),
            ],
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
        ),
        const SizedBox(height: 4),
        const HandleWidget(
          type: HandleType.source,
          position: Position.bottom,
        ),
      ],
    );
  }
}
