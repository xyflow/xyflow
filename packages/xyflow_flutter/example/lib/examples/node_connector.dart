import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// Node Connector Example - demonstrates dragging handles to connect nodes
/// with grid snapping and alignment guides.
///
/// Features:
/// - Drag from handles to create connections
/// - Grid snapping when moving nodes
/// - Alignment guides when nodes approach alignment
/// - Visual connection line feedback
/// - Connection validation
class NodeConnectorExample extends StatefulWidget {
  const NodeConnectorExample({super.key});

  @override
  State<NodeConnectorExample> createState() => _NodeConnectorExampleState();
}

class _NodeConnectorExampleState extends State<NodeConnectorExample> {
  late List<Node<NodeData>> _nodes;
  late List<Edge<void>> _edges;
  XYFlowController<NodeData, void>? _controller;

  // Connection state
  String? _connectingFromNode;
  String? _connectingFromHandle;
  bool _isConnecting = false;

  // Alignment guides
  double? _horizontalGuide;
  double? _verticalGuide;

  // Settings
  bool _snapToGrid = true;
  double _gridSize = 20;
  bool _showAlignmentGuides = true;

  @override
  void initState() {
    super.initState();
    _initializeNodes();
  }

  void _initializeNodes() {
    _nodes = [
      Node<NodeData>(
        id: 'start',
        type: 'connector',
        position: XYPosition(x: 100, y: 100),
        data: NodeData(
          label: 'Start',
          color: const Color(0xFF4CAF50),
          inputs: 0,
          outputs: 1,
        ),
      ),
      Node<NodeData>(
        id: 'process-1',
        type: 'connector',
        position: XYPosition(x: 350, y: 80),
        data: NodeData(
          label: 'Process A',
          color: const Color(0xFF2196F3),
          inputs: 1,
          outputs: 2,
        ),
      ),
      Node<NodeData>(
        id: 'process-2',
        type: 'connector',
        position: XYPosition(x: 350, y: 220),
        data: NodeData(
          label: 'Process B',
          color: const Color(0xFF9C27B0),
          inputs: 1,
          outputs: 1,
        ),
      ),
      Node<NodeData>(
        id: 'end',
        type: 'connector',
        position: XYPosition(x: 600, y: 150),
        data: NodeData(
          label: 'End',
          color: const Color(0xFFF44336),
          inputs: 2,
          outputs: 0,
        ),
      ),
    ];

    _edges = [
      Edge<void>(
        id: 'e-start-process1',
        source: 'start',
        target: 'process-1',
        sourceHandle: 'out-0',
        targetHandle: 'in-0',
        type: EdgeTypes.smoothStep,
      ),
    ];
  }

  void _onNodesChange(List<NodeChange> changes) {
    setState(() {
      _nodes = applyNodeChanges(changes, _nodes);

      // Update alignment guides during drag
      if (_showAlignmentGuides) {
        _updateAlignmentGuides();
      }
    });
  }

  void _onEdgesChange(List<EdgeChange> changes) {
    setState(() {
      _edges = applyEdgeChanges(changes, _edges);
    });
  }

  void _onConnect(Connection connection) {
    // Validate connection
    if (!_isValidConnection(connection)) {
      _showSnackBar('Invalid connection!', isError: true);
      return;
    }

    setState(() {
      _edges = [
        ..._edges,
        Edge<void>(
          id: 'e-${connection.source}-${connection.target}-${DateTime.now().millisecondsSinceEpoch}',
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          type: EdgeTypes.smoothStep,
          animated: true,
        ),
      ];
    });

    _showSnackBar('Connection created!');
  }

  bool _isValidConnection(Connection connection) {
    // Prevent self-connections
    if (connection.source == connection.target) return false;

    // Check if connection already exists
    final exists = _edges.any((e) =>
        e.source == connection.source &&
        e.target == connection.target &&
        e.sourceHandle == connection.sourceHandle &&
        e.targetHandle == connection.targetHandle);
    if (exists) return false;

    return true;
  }

  void _onConnectStart(OnConnectStartParams params) {
    setState(() {
      _isConnecting = true;
      _connectingFromNode = params.nodeId;
      _connectingFromHandle = params.handleId;
    });
  }

  void _onConnectEnd(OnConnectEndParams params) {
    setState(() {
      _isConnecting = false;
      _connectingFromNode = null;
      _connectingFromHandle = null;
    });
  }

  void _updateAlignmentGuides() {
    // Find selected/dragging node
    final selectedNode = _nodes.where((n) => n.selected).firstOrNull;
    if (selectedNode == null) {
      _horizontalGuide = null;
      _verticalGuide = null;
      return;
    }

    const threshold = 10.0;
    double? newHGuide;
    double? newVGuide;

    for (final node in _nodes) {
      if (node.id == selectedNode.id) continue;

      // Check horizontal alignment (same Y)
      if ((node.position.y - selectedNode.position.y).abs() < threshold) {
        newHGuide = node.position.y;
      }

      // Check vertical alignment (same X)
      if ((node.position.x - selectedNode.position.x).abs() < threshold) {
        newVGuide = node.position.x;
      }
    }

    _horizontalGuide = newHGuide;
    _verticalGuide = newVGuide;
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _addNode() {
    final id = 'node-${DateTime.now().millisecondsSinceEpoch}';
    setState(() {
      _nodes = [
        ..._nodes,
        Node<NodeData>(
          id: id,
          type: 'connector',
          position: XYPosition(x: 200, y: 200),
          data: NodeData(
            label: 'New Node',
            color: Colors.orange,
            inputs: 1,
            outputs: 1,
          ),
        ),
      ];
    });
  }

  void _clearEdges() {
    setState(() {
      _edges = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1a1a2e),
      appBar: AppBar(
        backgroundColor: const Color(0xFF16213e),
        foregroundColor: Colors.white,
        title: const Text('Node Connector'),
        actions: [
          // Snap to grid toggle
          IconButton(
            icon: Icon(
              _snapToGrid ? Icons.grid_on : Icons.grid_off,
              color: _snapToGrid ? Colors.cyan : Colors.grey,
            ),
            tooltip: 'Snap to Grid',
            onPressed: () => setState(() => _snapToGrid = !_snapToGrid),
          ),
          // Alignment guides toggle
          IconButton(
            icon: Icon(
              Icons.straighten,
              color: _showAlignmentGuides ? Colors.cyan : Colors.grey,
            ),
            tooltip: 'Alignment Guides',
            onPressed: () => setState(() => _showAlignmentGuides = !_showAlignmentGuides),
          ),
          // Add node
          IconButton(
            icon: const Icon(Icons.add_box),
            tooltip: 'Add Node',
            onPressed: _addNode,
          ),
          // Clear connections
          IconButton(
            icon: const Icon(Icons.link_off),
            tooltip: 'Clear Connections',
            onPressed: _clearEdges,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          XYFlow<NodeData, void>(
            nodes: _nodes,
            edges: _edges,
            onNodesChange: _onNodesChange,
            onEdgesChange: _onEdgesChange,
            onConnect: _onConnect,
            onConnectStart: _onConnectStart,
            onConnectEnd: _onConnectEnd,
            onInit: (controller) => _controller = controller,
            snapToGrid: _snapToGrid,
            snapGrid: (_gridSize, _gridSize),
            connectionLineType: ConnectionLineType.smoothStep,
            nodeTypes: {
              'connector': (props) => _ConnectorNode(
                props: props,
                isConnecting: _isConnecting,
                connectingFromNode: _connectingFromNode,
              ),
            },
            fitView: true,
            fitViewOptions: const FitViewOptions(
              padding: EdgeInsets.all(50),
            ),
            children: [
              // Grid background
              Background(
                variant: BackgroundVariant.dots,
                gap: _gridSize,
                color: Colors.grey.shade700,
              ),
              // Controls
              Controls(
                backgroundColor: const Color(0xFF2D2D2D),
                iconColor: const Color(0xFFAAAAAA),
                dividerColor: const Color(0xFF404040),
                borderColor: const Color(0xFF404040),
              ),
              // Connection status indicator
              if (_isConnecting)
                Positioned(
                  top: 16,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.cyan.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.link, color: Colors.white, size: 16),
                          SizedBox(width: 8),
                          Text(
                            'Drag to a target handle to connect',
                            style: TextStyle(color: Colors.white, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
          // Alignment guides overlay
          if (_showAlignmentGuides) ...[
            if (_horizontalGuide != null)
              Positioned.fill(
                child: CustomPaint(
                  painter: _AlignmentGuidePainter(
                    horizontalY: _horizontalGuide,
                    verticalX: null,
                  ),
                ),
              ),
            if (_verticalGuide != null)
              Positioned.fill(
                child: CustomPaint(
                  painter: _AlignmentGuidePainter(
                    horizontalY: null,
                    verticalX: _verticalGuide,
                  ),
                ),
              ),
          ],
          // Instructions panel
          Positioned(
            bottom: 16,
            left: 16,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF2D2D2D).withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF404040)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildInstruction(Icons.pan_tool, 'Drag nodes to move'),
                  _buildInstruction(Icons.link, 'Drag from handles to connect'),
                  _buildInstruction(Icons.grid_on, 'Toggle grid snapping'),
                  _buildInstruction(Icons.straighten, 'Toggle alignment guides'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInstruction(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.cyan),
          const SizedBox(width: 8),
          Text(
            text,
            style: const TextStyle(color: Colors.white70, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

/// Data for connector nodes.
class NodeData {
  const NodeData({
    required this.label,
    required this.color,
    required this.inputs,
    required this.outputs,
  });

  final String label;
  final Color color;
  final int inputs;
  final int outputs;
}

/// Custom connector node with multiple input/output handles.
class _ConnectorNode extends StatelessWidget {
  const _ConnectorNode({
    required this.props,
    required this.isConnecting,
    this.connectingFromNode,
  });

  final NodeProps<NodeData> props;
  final bool isConnecting;
  final String? connectingFromNode;

  @override
  Widget build(BuildContext context) {
    final data = props.data;
    final isSource = connectingFromNode == props.id;
    final isValidTarget = isConnecting && !isSource && data.inputs > 0;

    return Container(
      width: 140,
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected
              ? Colors.cyan
              : isValidTarget
                  ? Colors.green
                  : const Color(0xFF404040),
          width: props.selected || isValidTarget ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: props.selected
                ? Colors.cyan.withValues(alpha: 0.3)
                : Colors.black.withValues(alpha: 0.3),
            blurRadius: props.selected ? 12 : 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header with color bar
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            decoration: BoxDecoration(
              color: data.color.withValues(alpha: 0.8),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(7)),
            ),
            child: Text(
              data.label,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          // Handles section
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Input handles
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(data.inputs, (i) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          HandleWidget(
                            id: 'in-$i',
                            type: HandleType.target,
                            position: Position.left,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'IN',
                            style: TextStyle(
                              color: Colors.grey.shade500,
                              fontSize: 8,
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ),
                // Output handles
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(data.outputs, (i) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'OUT',
                            style: TextStyle(
                              color: Colors.grey.shade500,
                              fontSize: 8,
                            ),
                          ),
                          const SizedBox(width: 4),
                          HandleWidget(
                            id: 'out-$i',
                            type: HandleType.source,
                            position: Position.right,
                          ),
                        ],
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Painter for alignment guide lines.
class _AlignmentGuidePainter extends CustomPainter {
  _AlignmentGuidePainter({
    this.horizontalY,
    this.verticalX,
  });

  final double? horizontalY;
  final double? verticalX;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.cyan.withValues(alpha: 0.5)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    // Draw dashed lines
    const dashWidth = 5.0;
    const dashSpace = 3.0;

    if (horizontalY != null) {
      double startX = 0;
      while (startX < size.width) {
        canvas.drawLine(
          Offset(startX, horizontalY!),
          Offset(startX + dashWidth, horizontalY!),
          paint,
        );
        startX += dashWidth + dashSpace;
      }
    }

    if (verticalX != null) {
      double startY = 0;
      while (startY < size.height) {
        canvas.drawLine(
          Offset(verticalX!, startY),
          Offset(verticalX!, startY + dashWidth),
          paint,
        );
        startY += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(_AlignmentGuidePainter oldDelegate) {
    return horizontalY != oldDelegate.horizontalY ||
        verticalX != oldDelegate.verticalX;
  }
}
