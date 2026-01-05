import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/edge.dart';
import 'package:xyflow_flutter/src/core/types/node.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';
import 'package:xyflow_flutter/src/core/types/viewport.dart';
import 'package:xyflow_flutter/src/state/history.dart';

void main() {
  group('FlowSnapshot', () {
    test('creates snapshot with required fields', () {
      final snapshot = FlowSnapshot<Map<String, dynamic>, void>(
        nodes: [],
        edges: [],
        viewport: const Viewport.initial(),
        timestamp: DateTime.now(),
      );

      expect(snapshot.nodes, isEmpty);
      expect(snapshot.edges, isEmpty);
      expect(snapshot.viewport.zoom, 1.0);
    });

    test('copy creates deep copy', () {
      final original = FlowSnapshot<Map<String, dynamic>, void>(
        nodes: [
          Node<Map<String, dynamic>>(
            id: '1',
            position: XYPosition(x: 100, y: 100),
            data: {'label': 'Test'},
          ),
        ],
        edges: [],
        viewport: const Viewport(x: 10, y: 20, zoom: 1.5),
        timestamp: DateTime.now(),
      );

      final copy = original.copy();

      expect(copy.nodes.length, original.nodes.length);
      expect(copy.nodes.first.id, original.nodes.first.id);
      expect(copy.viewport.x, original.viewport.x);

      // Verify it's a deep copy (different instances)
      expect(identical(copy.nodes, original.nodes), isFalse);
    });
  });

  group('FlowHistory', () {
    late FlowHistory<Map<String, dynamic>, void> history;

    FlowSnapshot<Map<String, dynamic>, void> createSnapshot({
      List<Node<Map<String, dynamic>>>? nodes,
      Viewport? viewport,
    }) {
      return FlowSnapshot<Map<String, dynamic>, void>(
        nodes: nodes ?? [],
        edges: [],
        viewport: viewport ?? const Viewport.initial(),
        timestamp: DateTime.now(),
      );
    }

    setUp(() {
      history = FlowHistory<Map<String, dynamic>, void>();
    });

    test('initially has no undo/redo', () {
      expect(history.canUndo, isFalse);
      expect(history.canRedo, isFalse);
      expect(history.undoCount, 0);
      expect(history.redoCount, 0);
    });

    test('record adds to undo stack', () {
      history.record(createSnapshot());

      expect(history.canUndo, isTrue);
      expect(history.undoCount, 1);
    });

    test('record clears redo stack', () {
      history.record(createSnapshot());
      history.record(createSnapshot());

      // Undo to create redo history
      history.undo(createSnapshot());
      expect(history.canRedo, isTrue);

      // Record should clear redo
      history.record(createSnapshot());
      expect(history.canRedo, isFalse);
    });

    test('undo returns previous state', () {
      final state1 = createSnapshot(
        viewport: const Viewport(x: 0, y: 0, zoom: 1.0),
      );
      final state2 = createSnapshot(
        viewport: const Viewport(x: 100, y: 100, zoom: 2.0),
      );

      history.record(state1);

      final undoneState = history.undo(state2);

      expect(undoneState, isNotNull);
      expect(undoneState!.viewport.x, 0);
      expect(undoneState.viewport.zoom, 1.0);
    });

    test('undo pushes current state to redo stack', () {
      history.record(createSnapshot());

      expect(history.canRedo, isFalse);

      history.undo(createSnapshot());

      expect(history.canRedo, isTrue);
      expect(history.redoCount, 1);
    });

    test('undo returns null when stack is empty', () {
      final result = history.undo(createSnapshot());
      expect(result, isNull);
    });

    test('redo returns previously undone state', () {
      final state1 = createSnapshot(
        viewport: const Viewport(x: 0, y: 0, zoom: 1.0),
      );
      final state2 = createSnapshot(
        viewport: const Viewport(x: 100, y: 100, zoom: 2.0),
      );

      history.record(state1);
      history.undo(state2);

      final redoneState = history.redo(createSnapshot());

      expect(redoneState, isNotNull);
      expect(redoneState!.viewport.x, 100);
      expect(redoneState.viewport.zoom, 2.0);
    });

    test('redo returns null when stack is empty', () {
      final result = history.redo(createSnapshot());
      expect(result, isNull);
    });

    test('multiple undo/redo works correctly', () {
      final state1 = createSnapshot(
        viewport: const Viewport(x: 0, y: 0, zoom: 1.0),
      );
      final state2 = createSnapshot(
        viewport: const Viewport(x: 100, y: 100, zoom: 1.5),
      );
      final state3 = createSnapshot(
        viewport: const Viewport(x: 200, y: 200, zoom: 2.0),
      );

      history.record(state1);
      history.record(state2);

      // Undo from state3 back to state2
      var result = history.undo(state3);
      expect(result!.viewport.x, 100);

      // Undo from state2 back to state1
      result = history.undo(state2);
      expect(result!.viewport.x, 0);

      // Redo from state1 to state2
      result = history.redo(state1);
      expect(result!.viewport.x, 100);

      // Redo from state2 to state3
      result = history.redo(state2);
      expect(result!.viewport.x, 200);
    });

    test('respects max history limit', () {
      final limitedHistory =
          FlowHistory<Map<String, dynamic>, void>(maxHistory: 3);

      for (int i = 0; i < 5; i++) {
        limitedHistory.record(createSnapshot(
          viewport: Viewport(x: i.toDouble(), y: 0, zoom: 1.0),
        ));
      }

      expect(limitedHistory.undoCount, 3);
    });

    test('clear removes all history', () {
      history.record(createSnapshot());
      history.record(createSnapshot());
      history.undo(createSnapshot());

      expect(history.canUndo, isTrue);
      expect(history.canRedo, isTrue);

      history.clear();

      expect(history.canUndo, isFalse);
      expect(history.canRedo, isFalse);
    });

    test('clearRedo only clears redo stack', () {
      history.record(createSnapshot());
      history.undo(createSnapshot());

      expect(history.canRedo, isTrue);

      history.clearRedo();

      expect(history.canRedo, isFalse);
      expect(history.canUndo, isFalse); // Undo is empty because we undid
    });
  });
}
