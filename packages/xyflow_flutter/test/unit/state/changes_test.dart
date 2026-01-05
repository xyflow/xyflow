import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/changes.dart';
import 'package:xyflow_flutter/src/core/types/node.dart';
import 'package:xyflow_flutter/src/core/types/edge.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';

void main() {
  group('applyNodeChanges', () {
    test('applies position change', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
      ];

      final changes = [
        const NodePositionChange(
          id: 'a',
          position: XYPosition(x: 100, y: 100),
        ),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 1);
      expect(result.first.position.x, 100);
      expect(result.first.position.y, 100);
    });

    test('applies selection change', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
          selected: false,
        ),
      ];

      final changes = [
        const NodeSelectionChange(id: 'a', selected: true),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.first.selected, true);
    });

    test('applies remove change', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
        const Node<String>(
          id: 'b',
          position: XYPosition(x: 100, y: 0),
          data: 'Node B',
        ),
      ];

      final changes = [
        const NodeRemoveChange(id: 'a'),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 1);
      expect(result.first.id, 'b');
    });

    test('applies add change', () {
      final nodes = <Node<String>>[
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
      ];

      final changes = [
        NodeAddChange<String>(
          node: const Node<String>(
            id: 'b',
            position: XYPosition(x: 100, y: 0),
            data: 'Node B',
          ),
        ),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 2);
      expect(result.last.id, 'b');
    });

    test('applies replace change', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
      ];

      final changes = [
        const NodeReplaceChange<String>(
          id: 'a',
          node: Node<String>(
            id: 'a',
            position: XYPosition(x: 50, y: 50),
            data: 'Updated Node A',
          ),
        ),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 1);
      expect(result.first.data, 'Updated Node A');
      expect(result.first.position.x, 50);
    });

    test('ignores changes for non-existent nodes', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
      ];

      final changes = [
        const NodePositionChange(
          id: 'non-existent',
          position: XYPosition(x: 100, y: 100),
        ),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 1);
      expect(result.first.position.x, 0);
    });

    test('applies multiple changes in order', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
          selected: false,
        ),
      ];

      final changes = [
        const NodePositionChange(
          id: 'a',
          position: XYPosition(x: 100, y: 100),
        ),
        const NodeSelectionChange(id: 'a', selected: true),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.first.position.x, 100);
      expect(result.first.selected, true);
    });

    test('does not duplicate nodes on add', () {
      final nodes = [
        const Node<String>(
          id: 'a',
          position: XYPosition(x: 0, y: 0),
          data: 'Node A',
        ),
      ];

      final changes = [
        NodeAddChange<String>(
          node: const Node<String>(
            id: 'a', // Same ID
            position: XYPosition(x: 100, y: 0),
            data: 'Duplicate',
          ),
        ),
      ];

      final result = applyNodeChanges(changes, nodes);

      expect(result.length, 1);
      expect(result.first.data, 'Node A'); // Original kept
    });
  });

  group('applyEdgeChanges', () {
    test('applies selection change', () {
      final edges = <Edge<void>>[
        Edge<void>(
          id: 'e1',
          source: 'a',
          target: 'b',
          selected: false,
        ),
      ];

      final changes = [
        const EdgeSelectionChange(id: 'e1', selected: true),
      ];

      final result = applyEdgeChanges(changes, edges);

      expect(result.first.selected, true);
    });

    test('applies remove change', () {
      final edges = <Edge<void>>[
        Edge<void>(id: 'e1', source: 'a', target: 'b'),
        Edge<void>(id: 'e2', source: 'b', target: 'c'),
      ];

      final changes = [
        const EdgeRemoveChange(id: 'e1'),
      ];

      final result = applyEdgeChanges(changes, edges);

      expect(result.length, 1);
      expect(result.first.id, 'e2');
    });

    test('applies add change', () {
      final edges = <Edge<void>>[
        Edge<void>(id: 'e1', source: 'a', target: 'b'),
      ];

      final changes = [
        EdgeAddChange<void>(
          edge: Edge<void>(id: 'e2', source: 'b', target: 'c'),
        ),
      ];

      final result = applyEdgeChanges(changes, edges);

      expect(result.length, 2);
      expect(result.last.id, 'e2');
    });

    test('applies replace change', () {
      final edges = <Edge<void>>[
        Edge<void>(
          id: 'e1',
          source: 'a',
          target: 'b',
          animated: false,
        ),
      ];

      final changes = [
        EdgeReplaceChange<void>(
          id: 'e1',
          edge: Edge<void>(
            id: 'e1',
            source: 'a',
            target: 'b',
            animated: true,
          ),
        ),
      ];

      final result = applyEdgeChanges(changes, edges);

      expect(result.first.animated, true);
    });
  });

  group('NodeChange types', () {
    test('NodePositionChange equality', () {
      const c1 = NodePositionChange(
        id: 'a',
        position: XYPosition(x: 10, y: 20),
      );
      const c2 = NodePositionChange(
        id: 'a',
        position: XYPosition(x: 10, y: 20),
      );
      const c3 = NodePositionChange(
        id: 'a',
        position: XYPosition(x: 30, y: 40),
      );

      expect(c1, equals(c2));
      expect(c1, isNot(equals(c3)));
    });

    test('NodeSelectionChange equality', () {
      const c1 = NodeSelectionChange(id: 'a', selected: true);
      const c2 = NodeSelectionChange(id: 'a', selected: true);
      const c3 = NodeSelectionChange(id: 'a', selected: false);

      expect(c1, equals(c2));
      expect(c1, isNot(equals(c3)));
    });

    test('NodeRemoveChange equality', () {
      const c1 = NodeRemoveChange(id: 'a');
      const c2 = NodeRemoveChange(id: 'a');
      const c3 = NodeRemoveChange(id: 'b');

      expect(c1, equals(c2));
      expect(c1, isNot(equals(c3)));
    });
  });
}
