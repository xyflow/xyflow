import '../core/types/edge.dart';
import '../core/types/node.dart';
import '../core/types/viewport.dart';

/// A snapshot of the flow state at a point in time.
class FlowSnapshot<NodeData, EdgeData> {
  const FlowSnapshot({
    required this.nodes,
    required this.edges,
    required this.viewport,
    required this.timestamp,
  });

  final List<Node<NodeData>> nodes;
  final List<Edge<EdgeData>> edges;
  final Viewport viewport;
  final DateTime timestamp;

  /// Creates a deep copy of this snapshot.
  FlowSnapshot<NodeData, EdgeData> copy() {
    return FlowSnapshot(
      nodes: nodes.map((n) => n.copyWith()).toList(),
      edges: edges.map((e) => e.copyWith()).toList(),
      viewport: viewport.copyWith(),
      timestamp: timestamp,
    );
  }
}

/// Manages undo/redo history for the flow state.
///
/// Uses a snapshot-based approach where each state change is recorded
/// as a full snapshot. This is simple and reliable, though less memory
/// efficient than command-based undo.
class FlowHistory<NodeData, EdgeData> {
  FlowHistory({
    this.maxHistory = 100,
  });

  /// Maximum number of history entries to keep.
  final int maxHistory;

  final List<FlowSnapshot<NodeData, EdgeData>> _undoStack = [];
  final List<FlowSnapshot<NodeData, EdgeData>> _redoStack = [];

  /// Whether undo is available.
  bool get canUndo => _undoStack.isNotEmpty;

  /// Whether redo is available.
  bool get canRedo => _redoStack.isNotEmpty;

  /// Number of undo steps available.
  int get undoCount => _undoStack.length;

  /// Number of redo steps available.
  int get redoCount => _redoStack.length;

  /// Records a new state snapshot.
  ///
  /// This clears the redo stack since we're creating a new timeline.
  void record(FlowSnapshot<NodeData, EdgeData> snapshot) {
    _undoStack.add(snapshot.copy());
    _redoStack.clear();

    // Limit history size
    while (_undoStack.length > maxHistory) {
      _undoStack.removeAt(0);
    }
  }

  /// Undoes the last change and returns the previous state.
  ///
  /// The [currentState] is pushed to the redo stack.
  /// Returns null if there's nothing to undo.
  FlowSnapshot<NodeData, EdgeData>? undo(
      FlowSnapshot<NodeData, EdgeData> currentState) {
    if (_undoStack.isEmpty) return null;

    // Save current state to redo stack
    _redoStack.add(currentState.copy());

    // Pop and return previous state
    return _undoStack.removeLast();
  }

  /// Redoes the last undone change and returns that state.
  ///
  /// The [currentState] is pushed to the undo stack.
  /// Returns null if there's nothing to redo.
  FlowSnapshot<NodeData, EdgeData>? redo(
      FlowSnapshot<NodeData, EdgeData> currentState) {
    if (_redoStack.isEmpty) return null;

    // Save current state to undo stack
    _undoStack.add(currentState.copy());

    // Pop and return redo state
    return _redoStack.removeLast();
  }

  /// Clears all history.
  void clear() {
    _undoStack.clear();
    _redoStack.clear();
  }

  /// Clears only the redo stack.
  ///
  /// Call this when a new action is performed that invalidates
  /// the redo history.
  void clearRedo() {
    _redoStack.clear();
  }
}
