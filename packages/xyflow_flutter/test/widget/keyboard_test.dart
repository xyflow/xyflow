import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/node.dart';
import 'package:xyflow_flutter/src/core/types/edge.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';
import 'package:xyflow_flutter/src/state/xyflow_controller.dart';
import 'package:xyflow_flutter/src/widgets/xyflow.dart';

void main() {
  group('XYFlow Keyboard Shortcuts', () {
    late List<Node<Map<String, dynamic>>> nodes;
    late List<Edge<void>> edges;

    setUp(() {
      nodes = [
        Node<Map<String, dynamic>>(
          id: '1',
          position: XYPosition(x: 100, y: 100),
          data: {'label': 'Node 1'},
        ),
        Node<Map<String, dynamic>>(
          id: '2',
          position: XYPosition(x: 300, y: 100),
          data: {'label': 'Node 2'},
        ),
      ];

      edges = [
        Edge<void>(
          id: 'e1-2',
          source: '1',
          target: '2',
        ),
      ];
    });

    Widget buildTestWidget({
      void Function(XYFlowController<Map<String, dynamic>, void>)? onInit,
    }) {
      return MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: nodes,
            edges: edges,
            onInit: onInit,
          ),
        ),
      );
    }

    testWidgets('Escape clears selection', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      // Select a node
      controller!.selectNodes(['1']);
      await tester.pump();
      expect(controller!.state.selectedNodeIds, contains('1'));

      // Press Escape
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pump();

      // Selection should be cleared
      expect(controller!.state.selectedNodeIds, isEmpty);
    });

    testWidgets('Delete key removes selected elements', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      expect(controller!.getNodes().length, 2);

      // Select a node
      controller!.selectNodes(['1']);
      await tester.pump();

      // Press Delete
      await tester.sendKeyEvent(LogicalKeyboardKey.delete);
      await tester.pump();

      // Node should be deleted
      expect(controller!.getNodes().length, 1);
      expect(controller!.getNode('1'), isNull);
    });

    testWidgets('Backspace also deletes selected elements', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      expect(controller!.getNodes().length, 2);

      // Select a node
      controller!.selectNodes(['2']);
      await tester.pump();

      // Press Backspace
      await tester.sendKeyEvent(LogicalKeyboardKey.backspace);
      await tester.pump();

      // Node should be deleted
      expect(controller!.getNodes().length, 1);
      expect(controller!.getNode('2'), isNull);
    });

    testWidgets('selectAll selects all nodes and edges', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      // Initially no selection
      expect(controller!.state.selectedNodeIds, isEmpty);
      expect(controller!.state.selectedEdgeIds, isEmpty);

      // Call selectAll directly
      controller!.selectAll();
      await tester.pump();

      // All should be selected
      expect(controller!.state.selectedNodeIds.length, 2);
      expect(controller!.state.selectedNodeIds, contains('1'));
      expect(controller!.state.selectedNodeIds, contains('2'));
      expect(controller!.state.selectedEdgeIds, contains('e1-2'));
    });

    testWidgets('zoomIn increases zoom level', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      final initialZoom = controller!.getZoom();

      controller!.zoomIn();
      await tester.pump();

      expect(controller!.getZoom(), greaterThan(initialZoom));
    });

    testWidgets('zoomOut decreases zoom level', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      final initialZoom = controller!.getZoom();

      controller!.zoomOut();
      await tester.pump();

      expect(controller!.getZoom(), lessThan(initialZoom));
    });

    testWidgets('zoomTo sets specific zoom level', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(buildTestWidget(
        onInit: (c) => controller = c,
      ));
      await tester.pumpAndSettle();

      controller!.zoomTo(1.5);
      await tester.pump();

      expect(controller!.getZoom(), 1.5);
    });

    testWidgets('zoom is clamped to min/max', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: nodes,
            edges: edges,
            minZoom: 0.5,
            maxZoom: 2.0,
            onInit: (c) => controller = c,
          ),
        ),
      ));
      await tester.pumpAndSettle();

      // Try to zoom beyond max
      controller!.zoomTo(10.0);
      await tester.pump();
      expect(controller!.getZoom(), 2.0);

      // Try to zoom below min
      controller!.zoomTo(0.1);
      await tester.pump();
      expect(controller!.getZoom(), 0.5);
    });
  });

  group('Controller operations', () {
    testWidgets('getNode returns node by ID', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: [
              Node<Map<String, dynamic>>(
                id: 'test-node',
                position: XYPosition(x: 50, y: 50),
                data: {'label': 'Test'},
              ),
            ],
            edges: const [],
            onInit: (c) => controller = c,
          ),
        ),
      ));
      await tester.pumpAndSettle();

      final node = controller!.getNode('test-node');
      expect(node, isNotNull);
      expect(node!.id, 'test-node');
      expect(node.data['label'], 'Test');
    });

    testWidgets('addNodes adds new nodes', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: const [],
            edges: const [],
            onInit: (c) => controller = c,
          ),
        ),
      ));
      await tester.pumpAndSettle();

      expect(controller!.getNodes().length, 0);

      controller!.addNodes([
        Node<Map<String, dynamic>>(
          id: 'new-node',
          position: XYPosition(x: 100, y: 100),
          data: {'label': 'New Node'},
        ),
      ]);
      await tester.pump();

      expect(controller!.getNodes().length, 1);
      expect(controller!.getNode('new-node'), isNotNull);
    });

    testWidgets('deleteElements removes nodes and connected edges', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: [
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
            ],
            edges: [
              Edge<void>(id: 'e1', source: '1', target: '2'),
            ],
            onInit: (c) => controller = c,
          ),
        ),
      ));
      await tester.pumpAndSettle();

      expect(controller!.getNodes().length, 2);
      expect(controller!.getEdges().length, 1);

      // Delete node 1 - should also remove the edge
      controller!.deleteElements(nodeIds: ['1']);
      await tester.pump();

      expect(controller!.getNodes().length, 1);
      expect(controller!.getEdges().length, 0);
    });

    testWidgets('viewport operations work correctly', (tester) async {
      XYFlowController<Map<String, dynamic>, void>? controller;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlow<Map<String, dynamic>, void>(
            nodes: const [],
            edges: const [],
            onInit: (c) => controller = c,
          ),
        ),
      ));
      await tester.pumpAndSettle();

      final viewport = controller!.getViewport();
      expect(viewport.zoom, 1.0);

      // Test project (screen to canvas)
      final projected = controller!.project(const Offset(100, 100));
      expect(projected, isNotNull);

      // Test flowToScreen (canvas to screen)
      final screenPos = controller!.flowToScreen(const Offset(50, 50));
      expect(screenPos, isNotNull);
    });
  });
}
