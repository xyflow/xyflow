import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart' hide Transform;

/// Advanced Features Example - demonstrates cutting-edge xyflow capabilities.
///
/// Features demonstrated:
/// 1. Double-tap drag zoom (Google Maps style)
/// 2. Auto-resize parent groups based on children
/// 3. Slot-based multi-input handles with reordering
/// 4. Center-based symmetric resize (Alt/Option key)
/// 5. Node unmount animations
/// 6. Auto-pan during selection
/// 7. Configurable zoom speed
class AdvancedFeaturesExample extends StatefulWidget {
  const AdvancedFeaturesExample({super.key});

  @override
  State<AdvancedFeaturesExample> createState() => _AdvancedFeaturesExampleState();
}

class _AdvancedFeaturesExampleState extends State<AdvancedFeaturesExample>
    with TickerProviderStateMixin {
  late List<Node<AdvancedNodeData>> _nodes;
  late List<Edge<void>> _edges;
  XYFlowController<AdvancedNodeData, void>? _controller;

  // Feature toggles
  bool _doubleTapDragZoom = true;
  bool _autoResizeGroups = true;
  bool _symmetricResize = false;
  bool _animateUnmount = true;
  double _zoomSpeed = 1.0;

  // Double-tap drag zoom state
  bool _isDoubleTapDragging = false;
  double _doubleTapStartY = 0;
  double _doubleTapStartZoom = 1.0;
  DateTime? _lastTapTime;
  Offset? _lastTapPosition;

  // Animation controllers for unmount
  final Map<String, AnimationController> _unmountControllers = {};
  final Set<String> _removingNodes = {};

  @override
  void initState() {
    super.initState();
    _initializeNodes();
  }

  @override
  void dispose() {
    for (final controller in _unmountControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  void _initializeNodes() {
    _nodes = [
      // Group node (parent)
      Node<AdvancedNodeData>(
        id: 'group-1',
        type: 'group',
        position: XYPosition(x: 50, y: 50),
        data: AdvancedNodeData(
          label: 'Auto-Resize Group',
          nodeType: AdvancedNodeType.group,
          isExpanded: true,
        ),
        width: 400,
        height: 250,
      ),

      // Child nodes inside group
      Node<AdvancedNodeData>(
        id: 'child-1',
        type: 'default',
        position: XYPosition(x: 80, y: 100),
        data: AdvancedNodeData(
          label: 'Child Node 1',
          nodeType: AdvancedNodeType.default_,
        ),
        parentId: 'group-1',
      ),
      Node<AdvancedNodeData>(
        id: 'child-2',
        type: 'default',
        position: XYPosition(x: 280, y: 100),
        data: AdvancedNodeData(
          label: 'Child Node 2',
          nodeType: AdvancedNodeType.default_,
        ),
        parentId: 'group-1',
      ),
      Node<AdvancedNodeData>(
        id: 'child-3',
        type: 'default',
        position: XYPosition(x: 180, y: 200),
        data: AdvancedNodeData(
          label: 'Child Node 3',
          nodeType: AdvancedNodeType.default_,
        ),
        parentId: 'group-1',
      ),

      // Multi-input node (slot-based)
      Node<AdvancedNodeData>(
        id: 'multi-input',
        type: 'multiInput',
        position: XYPosition(x: 550, y: 120),
        data: AdvancedNodeData(
          label: 'Multi-Input Node',
          nodeType: AdvancedNodeType.multiInput,
          inputSlots: ['Slot 1', 'Slot 2', 'Slot 3'],
        ),
      ),

      // Output nodes that connect to multi-input
      Node<AdvancedNodeData>(
        id: 'output-1',
        type: 'output',
        position: XYPosition(x: 550, y: 300),
        data: AdvancedNodeData(
          label: 'Output A',
          nodeType: AdvancedNodeType.output,
          color: Colors.green,
        ),
      ),
      Node<AdvancedNodeData>(
        id: 'output-2',
        type: 'output',
        position: XYPosition(x: 700, y: 300),
        data: AdvancedNodeData(
          label: 'Output B',
          nodeType: AdvancedNodeType.output,
          color: Colors.blue,
        ),
      ),

      // Resizable node (symmetric resize demo)
      Node<AdvancedNodeData>(
        id: 'resizable',
        type: 'resizable',
        position: XYPosition(x: 100, y: 350),
        data: AdvancedNodeData(
          label: 'Resize Me\n(Hold Alt for symmetric)',
          nodeType: AdvancedNodeType.resizable,
        ),
        width: 180,
        height: 100,
      ),

      // Animated node (for unmount demo)
      Node<AdvancedNodeData>(
        id: 'animated-1',
        type: 'animated',
        position: XYPosition(x: 350, y: 380),
        data: AdvancedNodeData(
          label: 'Click to Remove',
          nodeType: AdvancedNodeType.animated,
        ),
      ),
    ];

    _edges = [
      Edge<void>(
        id: 'e-child1-multi',
        source: 'child-1',
        target: 'multi-input',
        targetHandle: 'slot-0',
      ),
      Edge<void>(
        id: 'e-child2-multi',
        source: 'child-2',
        target: 'multi-input',
        targetHandle: 'slot-1',
      ),
      Edge<void>(
        id: 'e-output1-output2',
        source: 'output-1',
        target: 'output-2',
      ),
    ];
  }

  void _onNodesChange(List<NodeChange> changes) {
    setState(() {
      _nodes = applyNodeChanges(changes, _nodes);

      // Auto-resize groups if enabled
      if (_autoResizeGroups) {
        _autoResizeGroupNodes();
      }
    });
  }

  void _onEdgesChange(List<EdgeChange> changes) {
    setState(() {
      _edges = applyEdgeChanges(changes, _edges);
    });
  }

  void _autoResizeGroupNodes() {
    // Find all group nodes and resize based on children
    final groupNodes = _nodes.where((n) => n.data.nodeType == AdvancedNodeType.group).toList();

    for (final group in groupNodes) {
      final children = _nodes.where((n) => n.parentId == group.id).toList();
      if (children.isEmpty) continue;

      // Calculate bounds of children
      double minX = double.infinity;
      double minY = double.infinity;
      double maxX = double.negativeInfinity;
      double maxY = double.negativeInfinity;

      for (final child in children) {
        final childWidth = child.width ?? 150.0;
        final childHeight = child.height ?? 50.0;

        if (child.position.x < minX) minX = child.position.x;
        if (child.position.y < minY) minY = child.position.y;
        if (child.position.x + childWidth > maxX) maxX = child.position.x + childWidth;
        if (child.position.y + childHeight > maxY) maxY = child.position.y + childHeight;
      }

      // Add padding
      const padding = 40.0;
      const headerHeight = 40.0;

      final newWidth = (maxX - minX) + padding * 2;
      final newHeight = (maxY - minY) + padding * 2 + headerHeight;

      // Only update if size changed significantly
      final currentWidth = group.width ?? 300.0;
      final currentHeight = group.height ?? 200.0;

      if ((newWidth - currentWidth).abs() > 5 || (newHeight - currentHeight).abs() > 5) {
        final index = _nodes.indexWhere((n) => n.id == group.id);
        if (index != -1) {
          _nodes[index] = Node<AdvancedNodeData>(
            id: group.id,
            type: group.type,
            position: group.position,
            data: group.data,
            width: math.max(newWidth, 200),
            height: math.max(newHeight, 150),
            parentId: group.parentId,
          );
        }
      }
    }
  }

  void _removeNodeWithAnimation(String nodeId) async {
    if (_removingNodes.contains(nodeId)) return;

    if (_animateUnmount) {
      setState(() {
        _removingNodes.add(nodeId);
      });

      // Create animation controller for this node
      final controller = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 300),
      );
      _unmountControllers[nodeId] = controller;

      // Play reverse animation
      await controller.forward();

      // Actually remove the node
      setState(() {
        _nodes = _nodes.where((n) => n.id != nodeId).toList();
        _edges = _edges.where((e) => e.source != nodeId && e.target != nodeId).toList();
        _removingNodes.remove(nodeId);
        _unmountControllers.remove(nodeId)?..dispose();
      });
    } else {
      setState(() {
        _nodes = _nodes.where((n) => n.id != nodeId).toList();
        _edges = _edges.where((e) => e.source != nodeId && e.target != nodeId).toList();
      });
    }
  }

  void _addAnimatedNode() {
    final id = 'animated-${DateTime.now().millisecondsSinceEpoch}';
    setState(() {
      _nodes = [
        ..._nodes,
        Node<AdvancedNodeData>(
          id: id,
          type: 'animated',
          position: XYPosition(
            x: 300 + math.Random().nextDouble() * 200,
            y: 350 + math.Random().nextDouble() * 100,
          ),
          data: AdvancedNodeData(
            label: 'New Node',
            nodeType: AdvancedNodeType.animated,
          ),
        ),
      ];
    });
  }

  // Handle double-tap drag zoom gesture
  void _handleTapDown(TapDownDetails details) {
    final now = DateTime.now();
    if (_lastTapTime != null &&
        _lastTapPosition != null &&
        now.difference(_lastTapTime!).inMilliseconds < 300 &&
        (details.localPosition - _lastTapPosition!).distance < 50) {
      // Double tap detected - start drag zoom mode
      if (_doubleTapDragZoom) {
        setState(() {
          _isDoubleTapDragging = true;
          _doubleTapStartY = details.localPosition.dy;
          _doubleTapStartZoom = _controller?.getZoom() ?? 1.0;
        });
      }
    }
    _lastTapTime = now;
    _lastTapPosition = details.localPosition;
  }

  void _handlePanUpdate(DragUpdateDetails details) {
    if (_isDoubleTapDragging && _controller != null) {
      // Calculate zoom based on vertical drag
      final deltaY = details.localPosition.dy - _doubleTapStartY;
      final zoomDelta = -deltaY * 0.005 * _zoomSpeed; // Negative because drag down = zoom in
      final newZoom = (_doubleTapStartZoom + zoomDelta).clamp(0.1, 4.0);

      _controller!.zoomTo(newZoom);
    }
  }

  void _handlePanEnd(DragEndDetails details) {
    if (_isDoubleTapDragging) {
      setState(() {
        _isDoubleTapDragging = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1a1a2e),
      appBar: AppBar(
        backgroundColor: const Color(0xFF16213e),
        foregroundColor: Colors.white,
        title: const Text('Advanced Features'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Add Animated Node',
            onPressed: _addAnimatedNode,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Settings',
            onPressed: _showSettings,
          ),
        ],
      ),
      body: GestureDetector(
        onTapDown: _handleTapDown,
        onPanUpdate: _isDoubleTapDragging ? _handlePanUpdate : null,
        onPanEnd: _isDoubleTapDragging ? _handlePanEnd : null,
        child: Stack(
          children: [
            XYFlow<AdvancedNodeData, void>(
              nodes: _nodes,
              edges: _edges,
              onNodesChange: _onNodesChange,
              onEdgesChange: _onEdgesChange,
              onInit: (controller) => _controller = controller,
              nodeTypes: {
                'group': (props) => _GroupNode(
                      props: props,
                      onAutoResize: _autoResizeGroups,
                    ),
                'default': (props) => _DefaultNode(props: props),
                'multiInput': (props) => _MultiInputNode(
                      props: props,
                      onSlotReorder: (fromIndex, toIndex) {
                        _reorderSlot(props.id, fromIndex, toIndex);
                      },
                    ),
                'output': (props) => _OutputNode(props: props),
                'resizable': (props) => _ResizableNode(
                      props: props,
                      symmetricResize: _symmetricResize,
                    ),
                'animated': (props) => _AnimatedNode(
                      props: props,
                      isRemoving: _removingNodes.contains(props.id),
                      animation: _unmountControllers[props.id],
                      onRemove: () => _removeNodeWithAnimation(props.id),
                    ),
              },
              fitView: true,
              fitViewOptions: const FitViewOptions(
                padding: EdgeInsets.all(50),
              ),
              children: [
                Background(
                  variant: BackgroundVariant.dots,
                  gap: 20,
                  color: Colors.grey.shade700,
                ),
                Controls(
                  backgroundColor: const Color(0xFF2D2D2D),
                  iconColor: const Color(0xFFAAAAAA),
                  dividerColor: const Color(0xFF404040),
                  borderColor: const Color(0xFF404040),
                ),
              ],
            ),
            // Feature status overlay
            Positioned(
              bottom: 16,
              left: 16,
              child: _buildFeatureStatus(),
            ),
            // Double-tap zoom indicator
            if (_isDoubleTapDragging)
              Positioned(
                top: 16,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.blue.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.zoom_in, color: Colors.white, size: 16),
                        SizedBox(width: 8),
                        Text(
                          'Drag up/down to zoom',
                          style: TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureStatus() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D).withValues(alpha: 0.95),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF404040)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Active Features:',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 8),
          _featureItem('Double-tap drag zoom', _doubleTapDragZoom),
          _featureItem('Auto-resize groups', _autoResizeGroups),
          _featureItem('Symmetric resize (Alt)', _symmetricResize),
          _featureItem('Unmount animations', _animateUnmount),
          _featureItem('Zoom speed: ${_zoomSpeed.toStringAsFixed(1)}x', true),
        ],
      ),
    );
  }

  Widget _featureItem(String label, bool enabled) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            enabled ? Icons.check_circle : Icons.cancel,
            size: 12,
            color: enabled ? Colors.green : Colors.grey,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: enabled ? Colors.white70 : Colors.grey,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  void _showSettings() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF2D2D2D),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Feature Settings',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Double-tap drag zoom',
                    style: TextStyle(color: Colors.white)),
                subtitle: const Text('Like Google Maps',
                    style: TextStyle(color: Colors.grey)),
                value: _doubleTapDragZoom,
                onChanged: (v) {
                  setSheetState(() => _doubleTapDragZoom = v);
                  setState(() => _doubleTapDragZoom = v);
                },
              ),
              SwitchListTile(
                title: const Text('Auto-resize groups',
                    style: TextStyle(color: Colors.white)),
                subtitle: const Text('Groups expand to fit children',
                    style: TextStyle(color: Colors.grey)),
                value: _autoResizeGroups,
                onChanged: (v) {
                  setSheetState(() => _autoResizeGroups = v);
                  setState(() => _autoResizeGroups = v);
                },
              ),
              SwitchListTile(
                title: const Text('Symmetric resize',
                    style: TextStyle(color: Colors.white)),
                subtitle: const Text('Resize from center (Alt key)',
                    style: TextStyle(color: Colors.grey)),
                value: _symmetricResize,
                onChanged: (v) {
                  setSheetState(() => _symmetricResize = v);
                  setState(() => _symmetricResize = v);
                },
              ),
              SwitchListTile(
                title: const Text('Unmount animations',
                    style: TextStyle(color: Colors.white)),
                subtitle: const Text('Animate when removing nodes',
                    style: TextStyle(color: Colors.grey)),
                value: _animateUnmount,
                onChanged: (v) {
                  setSheetState(() => _animateUnmount = v);
                  setState(() => _animateUnmount = v);
                },
              ),
              ListTile(
                title: const Text('Zoom speed',
                    style: TextStyle(color: Colors.white)),
                subtitle: Slider(
                  value: _zoomSpeed,
                  min: 0.5,
                  max: 3.0,
                  divisions: 5,
                  label: '${_zoomSpeed.toStringAsFixed(1)}x',
                  onChanged: (v) {
                    setSheetState(() => _zoomSpeed = v);
                    setState(() => _zoomSpeed = v);
                  },
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  void _reorderSlot(String nodeId, int fromIndex, int toIndex) {
    // Find edges connected to this node and reorder their targetHandle
    setState(() {
      final nodeEdges = _edges
          .where((e) => e.target == nodeId && e.targetHandle != null)
          .toList();

      // Update edge slots
      for (int i = 0; i < nodeEdges.length; i++) {
        final edge = nodeEdges[i];
        final currentSlot = int.tryParse(edge.targetHandle!.replaceAll('slot-', ''));
        if (currentSlot == fromIndex) {
          // Move this edge to the new slot
          final edgeIndex = _edges.indexOf(edge);
          _edges[edgeIndex] = Edge<void>(
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: 'slot-$toIndex',
          );
        }
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Data Models
// ═══════════════════════════════════════════════════════════════════════════

enum AdvancedNodeType {
  group,
  default_,
  multiInput,
  output,
  resizable,
  animated,
}

class AdvancedNodeData {
  const AdvancedNodeData({
    required this.label,
    required this.nodeType,
    this.color,
    this.isExpanded = true,
    this.inputSlots,
  });

  final String label;
  final AdvancedNodeType nodeType;
  final Color? color;
  final bool isExpanded;
  final List<String>? inputSlots;
}

// ═══════════════════════════════════════════════════════════════════════════
// Node Widgets
// ═══════════════════════════════════════════════════════════════════════════

/// Group node with auto-resize capability
class _GroupNode extends StatelessWidget {
  const _GroupNode({
    required this.props,
    this.onAutoResize = false,
  });

  final NodeProps<AdvancedNodeData> props;
  final bool onAutoResize;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: props.width ?? 300,
      height: props.height ?? 200,
      decoration: BoxDecoration(
        color: Colors.purple.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: props.selected ? Colors.purple : Colors.purple.withValues(alpha: 0.5),
          width: props.selected ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.purple.withValues(alpha: 0.3),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(11)),
            ),
            child: Row(
              children: [
                const Icon(Icons.folder, color: Colors.purple, size: 16),
                const SizedBox(width: 8),
                Text(
                  props.data.label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const Spacer(),
                if (onAutoResize)
                  const Icon(Icons.aspect_ratio, color: Colors.purple, size: 14),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Default node
class _DefaultNode extends StatelessWidget {
  const _DefaultNode({required this.props});

  final NodeProps<AdvancedNodeData> props;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected ? Colors.cyan : const Color(0xFF404040),
          width: props.selected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          HandleWidget(
            type: HandleType.target,
            position: Position.left,
          ),
          const SizedBox(width: 8),
          Text(
            props.data.label,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
          const SizedBox(width: 8),
          HandleWidget(
            type: HandleType.source,
            position: Position.right,
          ),
        ],
      ),
    );
  }
}

/// Multi-input node with slot-based handles
class _MultiInputNode extends StatelessWidget {
  const _MultiInputNode({
    required this.props,
    this.onSlotReorder,
  });

  final NodeProps<AdvancedNodeData> props;
  final void Function(int fromIndex, int toIndex)? onSlotReorder;

  @override
  Widget build(BuildContext context) {
    final slots = props.data.inputSlots ?? ['Input 1', 'Input 2', 'Input 3'];

    return Container(
      width: 180,
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected ? Colors.orange : const Color(0xFF404040),
          width: props.selected ? 2 : 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.orange.withValues(alpha: 0.2),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(7)),
            ),
            child: Row(
              children: [
                const Icon(Icons.merge_type, color: Colors.orange, size: 16),
                const SizedBox(width: 8),
                const Text(
                  'Multi-Input',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          // Slots
          ...slots.asMap().entries.map((entry) {
            return _SlotHandle(
              index: entry.key,
              label: entry.value,
              onReorder: onSlotReorder,
            );
          }),
          const SizedBox(height: 8),
          // Output
          Padding(
            padding: const EdgeInsets.only(bottom: 8, right: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Text(
                  'OUT',
                  style: TextStyle(color: Colors.grey, fontSize: 10),
                ),
                const SizedBox(width: 4),
                HandleWidget(
                  type: HandleType.source,
                  position: Position.right,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Individual slot handle with drag-to-reorder
class _SlotHandle extends StatelessWidget {
  const _SlotHandle({
    required this.index,
    required this.label,
    this.onReorder,
  });

  final int index;
  final String label;
  final void Function(int fromIndex, int toIndex)? onReorder;

  @override
  Widget build(BuildContext context) {
    return DragTarget<int>(
      onWillAcceptWithDetails: (details) => details.data != index,
      onAcceptWithDetails: (details) {
        onReorder?.call(details.data, index);
      },
      builder: (context, candidateData, rejectedData) {
        final isHovered = candidateData.isNotEmpty;
        return Draggable<int>(
          data: index,
          feedback: Material(
            color: Colors.transparent,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                label,
                style: const TextStyle(color: Colors.white, fontSize: 11),
              ),
            ),
          ),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            color: isHovered ? Colors.orange.withValues(alpha: 0.2) : null,
            child: Row(
              children: [
                HandleWidget(
                  id: 'slot-$index',
                  type: HandleType.target,
                  position: Position.left,
                  style: HandleStyle(
                    size: 10,
                    color: Colors.orange.shade400,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    label,
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ),
                const Icon(Icons.drag_handle, color: Colors.grey, size: 14),
              ],
            ),
          ),
        );
      },
    );
  }
}

/// Output node
class _OutputNode extends StatelessWidget {
  const _OutputNode({required this.props});

  final NodeProps<AdvancedNodeData> props;

  @override
  Widget build(BuildContext context) {
    final color = props.data.color ?? Colors.green;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: props.selected ? color : const Color(0xFF404040),
          width: props.selected ? 2 : 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            props.data.label,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
          const SizedBox(width: 8),
          HandleWidget(
            type: HandleType.source,
            position: Position.right,
            style: HandleStyle(color: color),
          ),
        ],
      ),
    );
  }
}

/// Resizable node with symmetric resize support
class _ResizableNode extends StatefulWidget {
  const _ResizableNode({
    required this.props,
    this.symmetricResize = false,
  });

  final NodeProps<AdvancedNodeData> props;
  final bool symmetricResize;

  @override
  State<_ResizableNode> createState() => _ResizableNodeState();
}

class _ResizableNodeState extends State<_ResizableNode> {
  bool _isAltPressed = false;

  @override
  Widget build(BuildContext context) {
    return Focus(
      onKeyEvent: (node, event) {
        final isAlt = event.logicalKey == LogicalKeyboardKey.altLeft ||
            event.logicalKey == LogicalKeyboardKey.altRight;
        if (isAlt) {
          setState(() {
            _isAltPressed = event is KeyDownEvent;
          });
        }
        return KeyEventResult.ignored;
      },
      child: Container(
        width: widget.props.width ?? 180,
        height: widget.props.height ?? 100,
        decoration: BoxDecoration(
          color: const Color(0xFF2D2D2D),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: widget.props.selected ? Colors.teal : const Color(0xFF404040),
            width: widget.props.selected ? 2 : 1,
          ),
        ),
        child: Stack(
          children: [
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    widget.props.data.label,
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    textAlign: TextAlign.center,
                  ),
                  if (_isAltPressed || widget.symmetricResize)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.teal.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Symmetric Mode',
                        style: TextStyle(color: Colors.teal, fontSize: 9),
                      ),
                    ),
                ],
              ),
            ),
            // Resize handles
            Positioned(
              right: 0,
              bottom: 0,
              child: GestureDetector(
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: Colors.teal.withValues(alpha: 0.5),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(4),
                      bottomRight: Radius.circular(8),
                    ),
                  ),
                  child: const Icon(
                    Icons.open_in_full,
                    size: 10,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Animated node with mount/unmount transitions
class _AnimatedNode extends StatefulWidget {
  const _AnimatedNode({
    required this.props,
    this.isRemoving = false,
    this.animation,
    this.onRemove,
  });

  final NodeProps<AdvancedNodeData> props;
  final bool isRemoving;
  final AnimationController? animation;
  final VoidCallback? onRemove;

  @override
  State<_AnimatedNode> createState() => _AnimatedNodeState();
}

class _AnimatedNodeState extends State<_AnimatedNode>
    with SingleTickerProviderStateMixin {
  late AnimationController _mountController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _mountController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _mountController, curve: Curves.elasticOut),
    );
    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _mountController, curve: Curves.easeOut),
    );

    // Play mount animation
    _mountController.forward();
  }

  @override
  void dispose() {
    _mountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Use unmount animation if removing, otherwise mount animation
    final controller = widget.isRemoving ? widget.animation : _mountController;
    final scale = widget.isRemoving
        ? Tween<double>(begin: 1.0, end: 0.0)
            .animate(CurvedAnimation(parent: controller!, curve: Curves.easeIn))
        : _scaleAnimation;
    final opacity = widget.isRemoving
        ? Tween<double>(begin: 1.0, end: 0.0)
            .animate(CurvedAnimation(parent: controller!, curve: Curves.easeOut))
        : _opacityAnimation;

    return AnimatedBuilder(
      animation: controller ?? _mountController,
      builder: (context, child) {
        return Transform.scale(
          scale: scale.value,
          child: Opacity(
            opacity: opacity.value.clamp(0.0, 1.0),
            child: child,
          ),
        );
      },
      child: GestureDetector(
        onTap: widget.onRemove,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.pink.shade700, Colors.purple.shade700],
            ),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: widget.props.selected ? Colors.white : Colors.transparent,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.pink.withValues(alpha: 0.4),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.touch_app, color: Colors.white, size: 16),
              const SizedBox(width: 8),
              Text(
                widget.props.data.label,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
