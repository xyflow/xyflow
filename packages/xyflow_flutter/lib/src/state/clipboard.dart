import '../core/types/edge.dart';
import '../core/types/node.dart';
import '../core/types/position.dart';

/// Manages clipboard operations for nodes and edges.
///
/// Supports copy, cut, and paste operations with automatic
/// ID regeneration and position offsetting on paste.
class XYFlowClipboard<NodeData, EdgeData> {
  XYFlowClipboard();

  List<Node<NodeData>>? _copiedNodes;
  List<Edge<EdgeData>>? _copiedEdges;
  int _pasteCount = 0;

  /// Whether there is content in the clipboard.
  bool get hasContent =>
      (_copiedNodes?.isNotEmpty ?? false) || (_copiedEdges?.isNotEmpty ?? false);

  /// The number of nodes in the clipboard.
  int get nodeCount => _copiedNodes?.length ?? 0;

  /// The number of edges in the clipboard.
  int get edgeCount => _copiedEdges?.length ?? 0;

  /// Copies nodes and edges to the clipboard.
  ///
  /// Only copies edges where both source and target are in the copied nodes.
  void copy({
    required List<Node<NodeData>> nodes,
    required List<Edge<EdgeData>> edges,
  }) {
    _copiedNodes = List.from(nodes);

    // Only copy edges that connect copied nodes
    final nodeIds = nodes.map((n) => n.id).toSet();
    _copiedEdges = edges
        .where((e) => nodeIds.contains(e.source) && nodeIds.contains(e.target))
        .toList();

    _pasteCount = 0;
  }

  /// Clears the clipboard.
  void clear() {
    _copiedNodes = null;
    _copiedEdges = null;
    _pasteCount = 0;
  }

  /// Pastes the clipboard content with new IDs and offset positions.
  ///
  /// Returns null if clipboard is empty.
  /// The [idGenerator] function creates new unique IDs for pasted elements.
  /// The [offset] determines how far to offset pasted nodes from originals.
  ClipboardPasteResult<NodeData, EdgeData>? paste({
    String Function(String originalId)? idGenerator,
    XYPosition offset = const XYPosition(x: 20, y: 20),
  }) {
    if (_copiedNodes == null || _copiedNodes!.isEmpty) {
      return null;
    }

    _pasteCount++;
    final effectiveOffset = XYPosition(
      x: offset.x * _pasteCount,
      y: offset.y * _pasteCount,
    );

    // Create ID mapping from old to new
    final idMap = <String, String>{};
    final generator = idGenerator ?? _defaultIdGenerator;

    // Generate new nodes with new IDs and offset positions
    final newNodes = _copiedNodes!.map((node) {
      final newId = generator(node.id);
      idMap[node.id] = newId;

      return node.copyWith(
        id: newId,
        position: XYPosition(
          x: node.position.x + effectiveOffset.x,
          y: node.position.y + effectiveOffset.y,
        ),
        selected: true, // Select pasted nodes
      );
    }).toList();

    // Generate new edges with updated source/target IDs
    final newEdges = (_copiedEdges ?? []).map((edge) {
      final newId = generator(edge.id);
      final newSource = idMap[edge.source] ?? edge.source;
      final newTarget = idMap[edge.target] ?? edge.target;

      return edge.copyWith(
        id: newId,
        source: newSource,
        target: newTarget,
        selected: true, // Select pasted edges
      );
    }).toList();

    return ClipboardPasteResult(
      nodes: newNodes,
      edges: newEdges,
      idMapping: idMap,
    );
  }

  String _defaultIdGenerator(String originalId) {
    return '${originalId}_copy_${DateTime.now().millisecondsSinceEpoch}';
  }
}

/// Result of a paste operation.
class ClipboardPasteResult<NodeData, EdgeData> {
  const ClipboardPasteResult({
    required this.nodes,
    required this.edges,
    required this.idMapping,
  });

  /// The newly created nodes.
  final List<Node<NodeData>> nodes;

  /// The newly created edges.
  final List<Edge<EdgeData>> edges;

  /// Mapping from original IDs to new IDs.
  final Map<String, String> idMapping;
}
