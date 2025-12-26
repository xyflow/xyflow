import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/edge.dart';
import 'package:xyflow_flutter/src/core/types/node.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';
import 'package:xyflow_flutter/src/state/clipboard.dart';

void main() {
  group('XYFlowClipboard', () {
    late XYFlowClipboard<Map<String, dynamic>, void> clipboard;

    setUp(() {
      clipboard = XYFlowClipboard<Map<String, dynamic>, void>();
    });

    test('initially has no content', () {
      expect(clipboard.hasContent, isFalse);
      expect(clipboard.nodeCount, 0);
      expect(clipboard.edgeCount, 0);
    });

    test('copy stores nodes', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 100, y: 100),
          data: {'label': 'Node 1'},
        ),
        Node<Map<String, dynamic>>(
          id: '2',
          position: XYPosition(x: 200, y: 200),
          data: {'label': 'Node 2'},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);

      expect(clipboard.hasContent, isTrue);
      expect(clipboard.nodeCount, 2);
    });

    test('copy only stores edges connecting copied nodes', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 100, y: 100),
          data: {},
        ),
        Node<Map<String, dynamic>>(
          id: '2',
          position: XYPosition(x: 200, y: 200),
          data: {},
        ),
      ];

      final edges = [
        Edge<void>(id: 'e1', source: '1', target: '2'), // Should be copied
        Edge<void>(id: 'e2', source: '1', target: '3'), // Should NOT be copied
        Edge<void>(id: 'e3', source: '3', target: '4'), // Should NOT be copied
      ];

      clipboard.copy(nodes: nodes, edges: edges);

      expect(clipboard.nodeCount, 2);
      expect(clipboard.edgeCount, 1);
    });

    test('paste returns null when clipboard is empty', () {
      final result = clipboard.paste();
      expect(result, isNull);
    });

    test('paste generates new IDs', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: 'original-id',
          position: XYPosition(x: 100, y: 100),
          data: {'label': 'Test'},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);
      final result = clipboard.paste();

      expect(result, isNotNull);
      expect(result!.nodes.length, 1);
      expect(result.nodes.first.id, isNot('original-id'));
      expect(result.nodes.first.id, contains('original-id'));
    });

    test('paste offsets node positions', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 100, y: 100),
          data: {},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);
      final result = clipboard.paste(offset: XYPosition(x: 50, y: 50));

      expect(result, isNotNull);
      expect(result!.nodes.first.position.x, 150); // 100 + 50
      expect(result.nodes.first.position.y, 150); // 100 + 50
    });

    test('paste increments offset on multiple pastes', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 100, y: 100),
          data: {},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);

      final result1 = clipboard.paste(offset: XYPosition(x: 20, y: 20));
      final result2 = clipboard.paste(offset: XYPosition(x: 20, y: 20));

      // First paste: 100 + 20*1 = 120
      expect(result1!.nodes.first.position.x, 120);

      // Second paste: 100 + 20*2 = 140
      expect(result2!.nodes.first.position.x, 140);
    });

    test('paste updates edge source/target to new node IDs', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 0, y: 0),
          data: {},
        ),
        Node<Map<String, dynamic>>(
          id: '2',
          position: XYPosition(x: 100, y: 0),
          data: {},
        ),
      ];

      final edges = [
        Edge<void>(id: 'e1', source: '1', target: '2'),
      ];

      clipboard.copy(nodes: nodes, edges: edges);
      final result = clipboard.paste();

      expect(result, isNotNull);
      expect(result!.edges.length, 1);

      final pastedEdge = result.edges.first;
      expect(pastedEdge.source, isNot('1'));
      expect(pastedEdge.target, isNot('2'));

      // Verify edge connects the new nodes
      final newNodeIds = result.nodes.map((n) => n.id).toSet();
      expect(newNodeIds.contains(pastedEdge.source), isTrue);
      expect(newNodeIds.contains(pastedEdge.target), isTrue);
    });

    test('paste provides ID mapping', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: 'original',
          position: XYPosition(x: 0, y: 0),
          data: {},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);
      final result = clipboard.paste();

      expect(result, isNotNull);
      expect(result!.idMapping.containsKey('original'), isTrue);
      expect(result.idMapping['original'], equals(result.nodes.first.id));
    });

    test('paste with custom ID generator', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: 'node-1',
          position: XYPosition(x: 0, y: 0),
          data: {},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);

      int counter = 0;
      final result = clipboard.paste(
        idGenerator: (originalId) => 'custom-${counter++}',
      );

      expect(result, isNotNull);
      expect(result!.nodes.first.id, 'custom-0');
    });

    test('clear removes all content', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 0, y: 0),
          data: {},
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);
      expect(clipboard.hasContent, isTrue);

      clipboard.clear();
      expect(clipboard.hasContent, isFalse);
      expect(clipboard.nodeCount, 0);
    });

    test('pasted nodes are selected', () {
      final nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 0, y: 0),
          data: {},
          selected: false,
        ),
      ];

      clipboard.copy(nodes: nodes, edges: []);
      final result = clipboard.paste();

      expect(result, isNotNull);
      expect(result!.nodes.first.selected, isTrue);
    });
  });
}
