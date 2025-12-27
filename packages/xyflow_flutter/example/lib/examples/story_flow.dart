import 'package:flutter/material.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart';

/// ComfyUI-style dark node graph for story branching.
///
/// Features a dark theme with colored node headers, grid background,
/// and various node types for narrative design.
class StoryFlowExample extends StatefulWidget {
  const StoryFlowExample({super.key});

  @override
  State<StoryFlowExample> createState() => _StoryFlowExampleState();
}

class _StoryFlowExampleState extends State<StoryFlowExample>
    with TickerProviderStateMixin {
  late List<Node<StoryNodeData>> _nodes;
  late List<Edge<void>> _edges;

  // Animation state for route visualization
  AnimationController? _playController;
  String? _activeNodeId;
  String? _activeEdgeId;
  bool _isPlaying = false;
  List<String> _executionPath = [];
  int _currentPathIndex = 0;

  // Edit mode state
  String? _editingNodeId;

  @override
  void initState() {
    super.initState();
    _initializeStory();
  }

  @override
  void dispose() {
    _playController?.dispose();
    super.dispose();
  }

  /// Starts the route visualization animation
  void _startPlayback() {
    if (_isPlaying) {
      _stopPlayback();
      return;
    }

    // Define execution path: start -> scene1 -> branch1 -> scene2b (cave) -> branch2 -> end1 (good)
    _executionPath = [
      'start',
      'e-start-scene1',
      'scene1',
      'e-scene1-branch1',
      'branch1',
      'e-branch1-scene2b', // Taking the cave path
      'scene2b',
      'e-scene2b-branch2',
      'branch2',
      'e-branch2-end1', // Speaking to the figure
      'end1',
    ];

    _currentPathIndex = 0;
    _isPlaying = true;

    _playController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _playController!.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _advanceToNextStep();
      }
    });

    setState(() {
      _activeNodeId = _executionPath[0].startsWith('e-') ? null : _executionPath[0];
      _activeEdgeId = _executionPath[0].startsWith('e-') ? _executionPath[0] : null;
    });
    _playController!.forward();
  }

  void _advanceToNextStep() {
    if (!_isPlaying) return;

    _currentPathIndex++;
    if (_currentPathIndex >= _executionPath.length) {
      _stopPlayback();
      return;
    }

    final currentItem = _executionPath[_currentPathIndex];
    setState(() {
      if (currentItem.startsWith('e-')) {
        _activeEdgeId = currentItem;
        _activeNodeId = null;
      } else {
        _activeNodeId = currentItem;
        _activeEdgeId = null;
      }
    });

    _playController!.reset();
    _playController!.forward();
  }

  void _stopPlayback() {
    _isPlaying = false;
    _playController?.stop();
    _playController?.dispose();
    _playController = null;
    setState(() {
      _activeNodeId = null;
      _activeEdgeId = null;
    });
  }

  /// Opens edit dialog for a node on double tap
  void _onNodeDoubleTap(String nodeId) {
    final nodeIndex = _nodes.indexWhere((n) => n.id == nodeId);
    if (nodeIndex == -1) return;

    final node = _nodes[nodeIndex];
    _showEditDialog(node, nodeIndex);
  }

  void _showEditDialog(Node<StoryNodeData> node, int nodeIndex) {
    final titleController = TextEditingController(text: node.data.title);
    final descController = TextEditingController(text: node.data.description ?? '');
    final imageController = TextEditingController(text: node.data.imageUrl ?? '');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF2D2D2D),
        title: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: _getNodeColor(node.data.nodeType),
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Edit ${_getNodeTypeName(node.data.nodeType)}',
              style: const TextStyle(
                color: Color(0xFFE0E0E0),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildEditField('Title', titleController),
              const SizedBox(height: 16),
              if (node.data.nodeType == StoryNodeType.story ||
                  node.data.nodeType == StoryNodeType.branch ||
                  node.data.nodeType == StoryNodeType.endGood ||
                  node.data.nodeType == StoryNodeType.endBad)
                _buildEditField('Description', descController, maxLines: 3),
              if (node.data.nodeType == StoryNodeType.story ||
                  node.data.nodeType == StoryNodeType.image) ...[
                const SizedBox(height: 16),
                _buildEditField('Image URL', imageController, hint: 'https://... or asset name'),
                const SizedBox(height: 8),
                // Image preview
                if (imageController.text.isNotEmpty)
                  Container(
                    height: 80,
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E1E1E),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: _buildImagePreviewForUrl(imageController.text),
                  ),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF9E9E9E))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CAF50),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _nodes[nodeIndex] = Node<StoryNodeData>(
                  id: node.id,
                  type: node.type,
                  position: node.position,
                  data: node.data.copyWith(
                    title: titleController.text,
                    description: descController.text.isEmpty ? null : descController.text,
                    imageUrl: imageController.text.isEmpty ? null : imageController.text,
                  ),
                  sourcePosition: node.sourcePosition,
                  targetPosition: node.targetPosition,
                  width: node.width,
                  height: node.height,
                );
              });
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  Widget _buildEditField(String label, TextEditingController controller, {int maxLines = 1, String? hint}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF9E9E9E),
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF666666)),
            filled: true,
            fillColor: const Color(0xFF1E1E1E),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(4),
              borderSide: const BorderSide(color: Color(0xFF3D3D3D)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(4),
              borderSide: const BorderSide(color: Color(0xFF3D3D3D)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(4),
              borderSide: const BorderSide(color: Color(0xFF5B9BD5)),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
      ],
    );
  }

  Widget _buildImagePreviewForUrl(String url) {
    if (url.startsWith('http')) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: Image.network(
          url,
          fit: BoxFit.cover,
          width: double.infinity,
          errorBuilder: (_, __, ___) => const Center(
            child: Icon(Icons.broken_image, color: Color(0xFF666666)),
          ),
        ),
      );
    }
    // Fallback gradient for asset names
    return _buildGradientPreview(url);
  }

  Widget _buildGradientPreview(String imageKey) {
    final gradients = {
      'forest': [const Color(0xFF1B4332), const Color(0xFF2D6A4F)],
      'meadow': [const Color(0xFF3A5A40), const Color(0xFF588157)],
      'cave': [const Color(0xFF212529), const Color(0xFF343A40)],
      'tree': [const Color(0xFF2D6A4F), const Color(0xFF40916C)],
      'mood': [const Color(0xFF2C2C54), const Color(0xFF474787)],
    };
    final colors = gradients[imageKey] ?? [const Color(0xFF333333), const Color(0xFF444444)];
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: colors, begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Center(
        child: Icon(Icons.landscape, color: Colors.white.withValues(alpha: 0.3), size: 24),
      ),
    );
  }

  Color _getNodeColor(StoryNodeType type) {
    switch (type) {
      case StoryNodeType.start: return _ComfyStyle.startColor;
      case StoryNodeType.story: return _ComfyStyle.storyColor;
      case StoryNodeType.branch: return _ComfyStyle.branchColor;
      case StoryNodeType.image: return _ComfyStyle.imageColor;
      case StoryNodeType.endGood: return _ComfyStyle.endGoodColor;
      case StoryNodeType.endBad: return _ComfyStyle.endBadColor;
    }
  }

  String _getNodeTypeName(StoryNodeType type) {
    switch (type) {
      case StoryNodeType.start: return 'Start Node';
      case StoryNodeType.story: return 'Story Node';
      case StoryNodeType.branch: return 'Branch Node';
      case StoryNodeType.image: return 'Image Node';
      case StoryNodeType.endGood: return 'Good Ending';
      case StoryNodeType.endBad: return 'Bad Ending';
    }
  }

  void _initializeStory() {
    _nodes = [
      // Start node
      Node<StoryNodeData>(
        id: 'start',
        type: 'start',
        position: XYPosition(x: 50, y: 200),
        data: StoryNodeData(
          title: 'Begin Story',
          nodeType: StoryNodeType.start,
        ),
        sourcePosition: Position.right,
      ),

      // Opening scene with image
      Node<StoryNodeData>(
        id: 'scene1',
        type: 'story',
        position: XYPosition(x: 280, y: 150),
        data: StoryNodeData(
          title: 'The Mysterious Forest',
          description: 'You wake up in a dark forest. The moon casts eerie shadows through the twisted branches above.',
          imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=200&fit=crop',
          nodeType: StoryNodeType.story,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // First branch - decision point
      Node<StoryNodeData>(
        id: 'branch1',
        type: 'branch',
        position: XYPosition(x: 580, y: 150),
        data: StoryNodeData(
          title: 'Choose Your Path',
          description: 'A fork in the road lies ahead.',
          choices: ['Follow the light', 'Enter the cave', 'Climb the tree'],
          nodeType: StoryNodeType.branch,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Path A - Light
      Node<StoryNodeData>(
        id: 'scene2a',
        type: 'story',
        position: XYPosition(x: 900, y: 0),
        data: StoryNodeData(
          title: 'The Glowing Meadow',
          description: 'You follow the ethereal light to a peaceful meadow filled with fireflies.',
          imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=200&fit=crop',
          nodeType: StoryNodeType.story,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Path B - Cave
      Node<StoryNodeData>(
        id: 'scene2b',
        type: 'story',
        position: XYPosition(x: 900, y: 180),
        data: StoryNodeData(
          title: 'The Dark Cave',
          description: 'The cave entrance looms before you. Strange sounds echo from within.',
          imageUrl: 'https://images.unsplash.com/photo-1504699439244-a7e34274ca3b?w=400&h=200&fit=crop',
          nodeType: StoryNodeType.story,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Path C - Tree
      Node<StoryNodeData>(
        id: 'scene2c',
        type: 'story',
        position: XYPosition(x: 900, y: 360),
        data: StoryNodeData(
          title: 'The Ancient Tree',
          description: 'From the treetop, you spot a hidden village in the distance.',
          imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=200&fit=crop',
          nodeType: StoryNodeType.story,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Image node for atmosphere
      Node<StoryNodeData>(
        id: 'img1',
        type: 'image',
        position: XYPosition(x: 280, y: 380),
        data: StoryNodeData(
          title: 'Atmosphere',
          imageUrl: 'mood',
          nodeType: StoryNodeType.image,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Convergence point
      Node<StoryNodeData>(
        id: 'branch2',
        type: 'branch',
        position: XYPosition(x: 1200, y: 150),
        data: StoryNodeData(
          title: 'The Encounter',
          description: 'A mysterious figure appears before you.',
          choices: ['Speak to them', 'Run away'],
          nodeType: StoryNodeType.branch,
        ),
        sourcePosition: Position.right,
        targetPosition: Position.left,
      ),

      // Good ending
      Node<StoryNodeData>(
        id: 'end1',
        type: 'end',
        position: XYPosition(x: 1500, y: 80),
        data: StoryNodeData(
          title: 'New Beginning',
          description: 'The figure reveals themselves as a guide, leading you to safety.',
          nodeType: StoryNodeType.endGood,
        ),
        targetPosition: Position.left,
      ),

      // Bad ending
      Node<StoryNodeData>(
        id: 'end2',
        type: 'end',
        position: XYPosition(x: 1500, y: 250),
        data: StoryNodeData(
          title: 'Lost Forever',
          description: 'You flee deeper into the forest, never to be seen again.',
          nodeType: StoryNodeType.endBad,
        ),
        targetPosition: Position.left,
      ),
    ];

    _edges = [
      Edge<void>(id: 'e-start-scene1', source: 'start', target: 'scene1'),
      Edge<void>(id: 'e-scene1-branch1', source: 'scene1', target: 'branch1'),
      Edge<void>(id: 'e-branch1-scene2a', source: 'branch1', target: 'scene2a', label: 'Light', labelShowBg: false, labelStyle: {'color': 0xFFE0E0E0, 'fontSize': 11.0}),
      Edge<void>(id: 'e-branch1-scene2b', source: 'branch1', target: 'scene2b', label: 'Cave', labelShowBg: false, labelStyle: {'color': 0xFFE0E0E0, 'fontSize': 11.0}),
      Edge<void>(id: 'e-branch1-scene2c', source: 'branch1', target: 'scene2c', label: 'Tree', labelShowBg: false, labelStyle: {'color': 0xFFE0E0E0, 'fontSize': 11.0}),
      Edge<void>(id: 'e-scene2a-branch2', source: 'scene2a', target: 'branch2'),
      Edge<void>(id: 'e-scene2b-branch2', source: 'scene2b', target: 'branch2'),
      Edge<void>(id: 'e-scene2c-branch2', source: 'scene2c', target: 'branch2'),
      Edge<void>(id: 'e-branch2-end1', source: 'branch2', target: 'end1', label: 'Speak', labelShowBg: false, labelStyle: {'color': 0xFFE0E0E0, 'fontSize': 11.0}),
      Edge<void>(id: 'e-branch2-end2', source: 'branch2', target: 'end2', label: 'Run', labelShowBg: false, labelStyle: {'color': 0xFFE0E0E0, 'fontSize': 11.0}),
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
    // Check if connection already exists
    final exists = _edges.any((e) =>
        e.source == connection.source &&
        e.target == connection.target &&
        e.sourceHandle == connection.sourceHandle &&
        e.targetHandle == connection.targetHandle);
    if (exists) return;

    // Prevent self-connections
    if (connection.source == connection.target) return;

    setState(() {
      _edges = [
        ..._edges,
        Edge<void>(
          id: 'e-${connection.source}-${connection.target}-${DateTime.now().millisecondsSinceEpoch}',
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
        ),
      ];
    });
  }

  /// Returns edges with active highlighting applied
  List<Edge<void>> _getStyledEdges() {
    return _edges.map((edge) {
      final isActive = _activeEdgeId == edge.id;
      if (isActive) {
        return Edge<void>(
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          label: edge.label,
          labelShowBg: edge.labelShowBg,
          labelStyle: edge.labelStyle,
          type: edge.type,
          animated: true, // Animate the active edge
          style: {'stroke': 0xFF4CAF50, 'strokeWidth': 3.0}, // Green highlight
        );
      }
      return edge;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A1A),
      appBar: AppBar(
        title: const Text(
          'Story Flow Editor',
          style: TextStyle(
            fontFamily: 'JetBrains Mono',
            fontWeight: FontWeight.w500,
            color: Color(0xFFE0E0E0),
          ),
        ),
        backgroundColor: const Color(0xFF2D2D2D),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFFE0E0E0)),
        actions: [
          // Play/Stop button for route visualization
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            decoration: BoxDecoration(
              color: _isPlaying
                ? const Color(0xFFFF5722).withValues(alpha: 0.2)
                : const Color(0xFF4CAF50).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(6),
            ),
            child: IconButton(
              icon: Icon(
                _isPlaying ? Icons.stop : Icons.play_arrow,
                size: 22,
                color: _isPlaying ? const Color(0xFFFF5722) : const Color(0xFF4CAF50),
              ),
              onPressed: _startPlayback,
              tooltip: _isPlaying ? 'Stop' : 'Run Story Flow',
            ),
          ),
          const SizedBox(width: 8),
          _buildToolbarButton(Icons.add_box_outlined, 'Add Story', () {}),
          _buildToolbarButton(Icons.call_split, 'Add Branch', () {}),
          _buildToolbarButton(Icons.image_outlined, 'Add Image', () {}),
          const SizedBox(width: 8),
        ],
      ),
      body: XYFlow<StoryNodeData, void>(
        nodes: _nodes,
        edges: _getStyledEdges(),
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        onConnect: _onConnect,
        connectionLineType: ConnectionLineType.smoothStep,
        nodeTypes: {
          'start': (props) => _StartNode(props: props, isActive: _activeNodeId == props.id, onDoubleTap: () => _onNodeDoubleTap(props.id)),
          'story': (props) => _StoryNode(props: props, isActive: _activeNodeId == props.id, onDoubleTap: () => _onNodeDoubleTap(props.id)),
          'branch': (props) => _BranchNode(props: props, isActive: _activeNodeId == props.id, onDoubleTap: () => _onNodeDoubleTap(props.id)),
          'image': (props) => _ImageNode(props: props, isActive: _activeNodeId == props.id, onDoubleTap: () => _onNodeDoubleTap(props.id)),
          'end': (props) => _EndNode(props: props, isActive: _activeNodeId == props.id, onDoubleTap: () => _onNodeDoubleTap(props.id)),
        },
        fitView: true,
        fitViewOnResize: true, // Auto-refit on device rotation
        fitViewOptions: const FitViewOptions(
          padding: EdgeInsets.all(80),
        ),
        minZoom: 0.2,
        maxZoom: 2.0,
        children: [
          const _ComfyBackground(),
          const Controls(
            backgroundColor: Color(0xFF2D2D2D),
            iconColor: Color(0xFFAAAAAA),
            disabledIconColor: Color(0xFF555555),
            dividerColor: Color(0xFF404040),
            borderColor: Color(0xFF404040),
          ),
          const MiniMap(
            backgroundColor: Color(0xFF252525),
            maskColor: Color(0x40FFFFFF),
          ),
        ],
      ),
    );
  }

  Widget _buildToolbarButton(IconData icon, String tooltip, VoidCallback onPressed) {
    return Tooltip(
      message: tooltip,
      child: IconButton(
        icon: Icon(icon, size: 20),
        onPressed: onPressed,
        color: const Color(0xFF9E9E9E),
        hoverColor: const Color(0xFF3D3D3D),
      ),
    );
  }
}

// ============================================================================
// Data Models
// ============================================================================

enum StoryNodeType {
  start,
  story,
  branch,
  image,
  endGood,
  endBad,
}

class StoryNodeData {
  final String title;
  final String? description;
  final String? imageUrl;
  final List<String>? choices;
  final StoryNodeType nodeType;

  const StoryNodeData({
    required this.title,
    this.description,
    this.imageUrl,
    this.choices,
    required this.nodeType,
  });

  StoryNodeData copyWith({
    String? title,
    String? description,
    String? imageUrl,
    List<String>? choices,
    StoryNodeType? nodeType,
  }) {
    return StoryNodeData(
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      choices: choices ?? this.choices,
      nodeType: nodeType ?? this.nodeType,
    );
  }
}

// ============================================================================
// ComfyUI-Style Background
// ============================================================================

// Use the standard Background widget with ComfyUI-style colors
// This extends Background so z-ordering works correctly
class _ComfyBackground extends Background {
  const _ComfyBackground()
      : super(
          variant: BackgroundVariant.dots,
          gap: 20,
          size: 1.5,
          color: const Color(0xFF3A3A3A),
        );
}

// ============================================================================
// Node Widgets - ComfyUI Style
// ============================================================================

/// Base styling constants for ComfyUI aesthetic
class _ComfyStyle {
  static const nodeBackground = Color(0xFF2D2D2D);
  static const nodeBorder = Color(0xFF3D3D3D);
  static const nodeSelectedBorder = Color(0xFF5B9BD5);
  static const textPrimary = Color(0xFFE0E0E0);
  static const textSecondary = Color(0xFF9E9E9E);
  static const handleSize = 12.0;
  static const borderRadius = 8.0;

  // Node type colors (header accent)
  static const startColor = Color(0xFF4CAF50);
  static const storyColor = Color(0xFF5B9BD5);
  static const branchColor = Color(0xFFFF9800);
  static const imageColor = Color(0xFF9C27B0);
  static const endGoodColor = Color(0xFF4CAF50);
  static const endBadColor = Color(0xFFF44336);
}

/// Start node - entry point
class _StartNode extends StatelessWidget {
  const _StartNode({required this.props, this.isActive = false, this.onDoubleTap});
  final NodeProps<StoryNodeData> props;
  final bool isActive;
  final VoidCallback? onDoubleTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: onDoubleTap,
      child: _ComfyNodeWrapper(
        props: props,
        headerColor: _ComfyStyle.startColor,
        width: 140,
        isActive: isActive,
        child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(
              Icons.play_circle_filled,
              color: _ComfyStyle.startColor,
              size: 24,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                props.data.title,
                style: const TextStyle(
                  color: _ComfyStyle.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }
}

/// Story node - main narrative content
class _StoryNode extends StatelessWidget {
  const _StoryNode({required this.props, this.isActive = false, this.onDoubleTap});
  final NodeProps<StoryNodeData> props;
  final bool isActive;
  final VoidCallback? onDoubleTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: onDoubleTap,
      child: _ComfyNodeWrapper(
        props: props,
        headerColor: _ComfyStyle.storyColor,
        width: 240,
        isActive: isActive,
        child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image preview area
          if (props.data.imageUrl != null)
            Container(
              height: 100,
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(4),
              ),
              child: _buildImagePreview(props.data.imageUrl!),
            ),
          if (props.data.imageUrl != null) const SizedBox(height: 8),

          // Description
          if (props.data.description != null)
            Text(
              props.data.description!,
              style: const TextStyle(
                color: _ComfyStyle.textSecondary,
                fontSize: 11,
                height: 1.4,
              ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
        ],
      ),
      ),
    );
  }

  Widget _buildImagePreview(String imageKey) {
    // Check if it's a URL - show actual image
    if (imageKey.startsWith('http')) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: Image.network(
          imageKey,
          fit: BoxFit.cover,
          width: double.infinity,
          height: double.infinity,
          errorBuilder: (_, __, ___) => _buildGradientFallback(imageKey),
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                    : null,
                strokeWidth: 2,
                color: _ComfyStyle.storyColor,
              ),
            );
          },
        ),
      );
    }
    // Fallback to gradient for asset names
    return _buildGradientFallback(imageKey);
  }

  Widget _buildGradientFallback(String imageKey) {
    final gradients = {
      'forest': [const Color(0xFF1B4332), const Color(0xFF2D6A4F)],
      'meadow': [const Color(0xFF3A5A40), const Color(0xFF588157)],
      'cave': [const Color(0xFF212529), const Color(0xFF343A40)],
      'tree': [const Color(0xFF2D6A4F), const Color(0xFF40916C)],
      'mood': [const Color(0xFF2C2C54), const Color(0xFF474787)],
    };

    final colors = gradients[imageKey] ?? [const Color(0xFF333333), const Color(0xFF444444)];

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: colors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Center(
        child: Icon(
          Icons.landscape,
          color: Colors.white.withValues(alpha: 0.3),
          size: 32,
        ),
      ),
    );
  }
}

/// Branch node - decision points
class _BranchNode extends StatelessWidget {
  const _BranchNode({required this.props, this.isActive = false, this.onDoubleTap});
  final NodeProps<StoryNodeData> props;
  final bool isActive;
  final VoidCallback? onDoubleTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: onDoubleTap,
      child: _ComfyNodeWrapper(
        props: props,
        headerColor: _ComfyStyle.branchColor,
        width: 200,
        isActive: isActive,
        child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (props.data.description != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                props.data.description!,
                style: const TextStyle(
                  color: _ComfyStyle.textSecondary,
                  fontSize: 11,
                ),
              ),
            ),

          // Choice options
          if (props.data.choices != null)
            ...props.data.choices!.asMap().entries.map((entry) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    Container(
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: _ComfyStyle.branchColor.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Center(
                        child: Text(
                          '${entry.key + 1}',
                          style: TextStyle(
                            color: _ComfyStyle.branchColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        entry.value,
                        style: const TextStyle(
                          color: _ComfyStyle.textPrimary,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
      ),
    );
  }
}

/// Image node - visual content
class _ImageNode extends StatelessWidget {
  const _ImageNode({required this.props, this.isActive = false, this.onDoubleTap});
  final NodeProps<StoryNodeData> props;
  final bool isActive;
  final VoidCallback? onDoubleTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onDoubleTap: onDoubleTap,
      child: _ComfyNodeWrapper(
        props: props,
        headerColor: _ComfyStyle.imageColor,
        width: 160,
        isActive: isActive,
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    // Show actual image if URL is provided
    if (props.data.imageUrl != null && props.data.imageUrl!.startsWith('http')) {
      return Container(
        height: 100,
        decoration: BoxDecoration(
          color: const Color(0xFF1E1E1E),
          borderRadius: BorderRadius.circular(4),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: Image.network(
            props.data.imageUrl!,
            fit: BoxFit.cover,
            width: double.infinity,
            height: double.infinity,
            errorBuilder: (_, __, ___) => _buildPlaceholder(),
          ),
        ),
      );
    }
    return _buildPlaceholder();
  }

  Widget _buildPlaceholder() {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _ComfyStyle.imageColor.withValues(alpha: 0.3),
            _ComfyStyle.imageColor.withValues(alpha: 0.1),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image,
              color: _ComfyStyle.imageColor.withValues(alpha: 0.6),
              size: 32,
            ),
            const SizedBox(height: 4),
            Text(
              'Click to upload',
              style: TextStyle(
                color: _ComfyStyle.textSecondary.withValues(alpha: 0.6),
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// End node - story conclusions
class _EndNode extends StatelessWidget {
  const _EndNode({required this.props, this.isActive = false, this.onDoubleTap});
  final NodeProps<StoryNodeData> props;
  final bool isActive;
  final VoidCallback? onDoubleTap;

  @override
  Widget build(BuildContext context) {
    final isGood = props.data.nodeType == StoryNodeType.endGood;
    final color = isGood ? _ComfyStyle.endGoodColor : _ComfyStyle.endBadColor;

    return GestureDetector(
      onDoubleTap: onDoubleTap,
      child: _ComfyNodeWrapper(
        props: props,
        headerColor: color,
        width: 200,
        showSourceHandle: false,
        isActive: isActive,
        child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isGood ? Icons.emoji_events : Icons.dangerous,
                color: color,
                size: 18,
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  isGood ? 'GOOD END' : 'BAD END',
                  style: TextStyle(
                    color: color,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          if (props.data.description != null) ...[
            const SizedBox(height: 8),
            Text(
              props.data.description!,
              style: const TextStyle(
                color: _ComfyStyle.textSecondary,
                fontSize: 11,
                height: 1.4,
              ),
            ),
          ],
        ],
      ),
      ),
    );
  }
}

// ============================================================================
// ComfyUI Node Wrapper - Shared styling
// ============================================================================

class _ComfyNodeWrapper extends StatelessWidget {
  const _ComfyNodeWrapper({
    required this.props,
    required this.headerColor,
    required this.child,
    this.width = 200,
    this.showSourceHandle = true,
    this.showTargetHandle = true,
    this.isActive = false,
  });

  final NodeProps<StoryNodeData> props;
  final Color headerColor;
  final Widget child;
  final double width;
  final bool showSourceHandle;
  final bool showTargetHandle;
  final bool isActive;

  // Active execution color (ComfyUI-style green glow)
  static const _activeColor = Color(0xFF4CAF50);

  @override
  Widget build(BuildContext context) {
    // Border color priority: active > selected > default
    final borderColor = isActive
        ? _activeColor
        : props.selected
            ? _ComfyStyle.nodeSelectedBorder
            : _ComfyStyle.nodeBorder;
    final borderWidth = (isActive || props.selected) ? 2.0 : 1.0;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      width: width,
      decoration: BoxDecoration(
        color: _ComfyStyle.nodeBackground,
        borderRadius: BorderRadius.circular(_ComfyStyle.borderRadius),
        border: Border.all(
          color: borderColor,
          width: borderWidth,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
          if (isActive)
            BoxShadow(
              color: _activeColor.withValues(alpha: 0.6),
              blurRadius: 20,
              spreadRadius: 3,
            ),
          if (props.selected && !isActive)
            BoxShadow(
              color: headerColor.withValues(alpha: 0.3),
              blurRadius: 12,
              spreadRadius: 1,
            ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header bar with title
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: headerColor.withValues(alpha: 0.15),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(_ComfyStyle.borderRadius - 1),
              ),
              border: Border(
                bottom: BorderSide(
                  color: headerColor.withValues(alpha: 0.3),
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                // Color indicator dot
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: headerColor,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: headerColor.withValues(alpha: 0.5),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    props.data.title,
                    style: const TextStyle(
                      color: _ComfyStyle.textPrimary,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'JetBrains Mono',
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                // Node type indicator
                Icon(
                  _getNodeIcon(props.data.nodeType),
                  color: headerColor.withValues(alpha: 0.6),
                  size: 14,
                ),
              ],
            ),
          ),

          // Content area
          Padding(
            padding: const EdgeInsets.all(12),
            child: child,
          ),

          // Handle indicators at bottom
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF252525),
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(_ComfyStyle.borderRadius - 1),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (showTargetHandle)
                  _HandleIndicator(
                    label: 'IN',
                    color: headerColor,
                    isInput: true,
                  )
                else
                  const SizedBox(width: 40),
                if (showSourceHandle)
                  _HandleIndicator(
                    label: 'OUT',
                    color: headerColor,
                    isInput: false,
                  )
                else
                  const SizedBox(width: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _getNodeIcon(StoryNodeType type) {
    switch (type) {
      case StoryNodeType.start:
        return Icons.play_arrow;
      case StoryNodeType.story:
        return Icons.auto_stories;
      case StoryNodeType.branch:
        return Icons.call_split;
      case StoryNodeType.image:
        return Icons.image;
      case StoryNodeType.endGood:
      case StoryNodeType.endBad:
        return Icons.flag;
    }
  }
}

class _HandleIndicator extends StatelessWidget {
  const _HandleIndicator({
    required this.label,
    required this.color,
    required this.isInput,
  });

  final String label;
  final Color color;
  final bool isInput;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (isInput) ...[
          HandleWidget(
            type: HandleType.target,
            position: Position.left,
            style: HandleStyle(
              size: 12,
              color: color,
              hoverColor: color,
              activeColor: const Color(0xFF4CAF50),
              borderColor: const Color(0xFF1A1A1A),
              borderWidth: 2,
            ),
          ),
          const SizedBox(width: 4),
        ],
        Text(
          label,
          style: TextStyle(
            color: _ComfyStyle.textSecondary.withValues(alpha: 0.6),
            fontSize: 9,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.5,
          ),
        ),
        if (!isInput) ...[
          const SizedBox(width: 4),
          HandleWidget(
            type: HandleType.source,
            position: Position.right,
            style: HandleStyle(
              size: 12,
              color: color,
              hoverColor: color,
              activeColor: const Color(0xFF4CAF50),
              borderColor: const Color(0xFF1A1A1A),
              borderWidth: 2,
            ),
          ),
        ],
      ],
    );
  }
}
