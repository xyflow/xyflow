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

class _StoryFlowExampleState extends State<StoryFlowExample> {
  late List<Node<StoryNodeData>> _nodes;
  late List<Edge<void>> _edges;

  @override
  void initState() {
    super.initState();
    _initializeStory();
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
          imageUrl: 'forest',
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
          imageUrl: 'meadow',
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
          imageUrl: 'cave',
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
          imageUrl: 'tree',
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
      Edge<void>(id: 'e-branch1-scene2a', source: 'branch1', target: 'scene2a', label: 'Light'),
      Edge<void>(id: 'e-branch1-scene2b', source: 'branch1', target: 'scene2b', label: 'Cave'),
      Edge<void>(id: 'e-branch1-scene2c', source: 'branch1', target: 'scene2c', label: 'Tree'),
      Edge<void>(id: 'e-scene2a-branch2', source: 'scene2a', target: 'branch2'),
      Edge<void>(id: 'e-scene2b-branch2', source: 'scene2b', target: 'branch2'),
      Edge<void>(id: 'e-scene2c-branch2', source: 'scene2c', target: 'branch2'),
      Edge<void>(id: 'e-branch2-end1', source: 'branch2', target: 'end1', label: 'Speak'),
      Edge<void>(id: 'e-branch2-end2', source: 'branch2', target: 'end2', label: 'Run'),
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
          _buildToolbarButton(Icons.add_box_outlined, 'Add Story', () {}),
          _buildToolbarButton(Icons.call_split, 'Add Branch', () {}),
          _buildToolbarButton(Icons.image_outlined, 'Add Image', () {}),
          const SizedBox(width: 8),
        ],
      ),
      body: XYFlow<StoryNodeData, void>(
        nodes: _nodes,
        edges: _edges,
        onNodesChange: _onNodesChange,
        onEdgesChange: _onEdgesChange,
        nodeTypes: {
          'start': (props) => _StartNode(props: props),
          'story': (props) => _StoryNode(props: props),
          'branch': (props) => _BranchNode(props: props),
          'image': (props) => _ImageNode(props: props),
          'end': (props) => _EndNode(props: props),
        },
        fitView: true,
        fitViewOptions: const FitViewOptions(
          padding: EdgeInsets.all(80),
        ),
        minZoom: 0.2,
        maxZoom: 2.0,
        children: [
          const _ComfyBackground(),
          const Controls(),
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
}

// ============================================================================
// ComfyUI-Style Background
// ============================================================================

class _ComfyBackground extends StatelessWidget {
  const _ComfyBackground();

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: CustomPaint(
        painter: _GridPainter(),
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF2A2A2A)
      ..strokeWidth = 1;

    const gridSize = 20.0;

    // Draw dots at grid intersections
    final dotPaint = Paint()
      ..color = const Color(0xFF3A3A3A)
      ..style = PaintingStyle.fill;

    for (double x = 0; x < size.width; x += gridSize) {
      for (double y = 0; y < size.height; y += gridSize) {
        canvas.drawCircle(Offset(x, y), 1.5, dotPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
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
  const _StartNode({required this.props});
  final NodeProps<StoryNodeData> props;

  @override
  Widget build(BuildContext context) {
    return _ComfyNodeWrapper(
      props: props,
      headerColor: _ComfyStyle.startColor,
      width: 140,
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
            Text(
              props.data.title,
              style: const TextStyle(
                color: _ComfyStyle.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Story node - main narrative content
class _StoryNode extends StatelessWidget {
  const _StoryNode({required this.props});
  final NodeProps<StoryNodeData> props;

  @override
  Widget build(BuildContext context) {
    return _ComfyNodeWrapper(
      props: props,
      headerColor: _ComfyStyle.storyColor,
      width: 240,
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
    );
  }

  Widget _buildImagePreview(String imageKey) {
    // Simulated image previews with gradients
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
  const _BranchNode({required this.props});
  final NodeProps<StoryNodeData> props;

  @override
  Widget build(BuildContext context) {
    return _ComfyNodeWrapper(
      props: props,
      headerColor: _ComfyStyle.branchColor,
      width: 200,
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
    );
  }
}

/// Image node - visual content
class _ImageNode extends StatelessWidget {
  const _ImageNode({required this.props});
  final NodeProps<StoryNodeData> props;

  @override
  Widget build(BuildContext context) {
    return _ComfyNodeWrapper(
      props: props,
      headerColor: _ComfyStyle.imageColor,
      width: 160,
      child: Container(
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
      ),
    );
  }
}

/// End node - story conclusions
class _EndNode extends StatelessWidget {
  const _EndNode({required this.props});
  final NodeProps<StoryNodeData> props;

  @override
  Widget build(BuildContext context) {
    final isGood = props.data.nodeType == StoryNodeType.endGood;
    final color = isGood ? _ComfyStyle.endGoodColor : _ComfyStyle.endBadColor;

    return _ComfyNodeWrapper(
      props: props,
      headerColor: color,
      width: 200,
      showSourceHandle: false,
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
  });

  final NodeProps<StoryNodeData> props;
  final Color headerColor;
  final Widget child;
  final double width;
  final bool showSourceHandle;
  final bool showTargetHandle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        color: _ComfyStyle.nodeBackground,
        borderRadius: BorderRadius.circular(_ComfyStyle.borderRadius),
        border: Border.all(
          color: props.selected ? _ComfyStyle.nodeSelectedBorder : _ComfyStyle.nodeBorder,
          width: props.selected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
          if (props.selected)
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
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF1A1A1A), width: 2),
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
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF1A1A1A), width: 2),
            ),
          ),
        ],
      ],
    );
  }
}
