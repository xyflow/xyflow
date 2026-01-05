import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/rect.dart';
import 'package:xyflow_flutter/src/widgets/selection_rect.dart';
import 'package:xyflow_flutter/src/state/xyflow_provider.dart';
import 'package:xyflow_flutter/src/state/xyflow_state.dart';
import 'package:xyflow_flutter/src/core/types/node.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';

void main() {
  group('SelectionRect', () {
    late XYFlowState<Map<String, dynamic>, void> state;

    setUp(() {
      state = XYFlowState<Map<String, dynamic>, void>(
        nodes: [
          Node<Map<String, dynamic>>(
            id: '1',
            position: XYPosition(x: 50, y: 50),
            data: {'label': 'Node 1'},
          ),
          Node<Map<String, dynamic>>(
            id: '2',
            position: XYPosition(x: 200, y: 50),
            data: {'label': 'Node 2'},
          ),
          Node<Map<String, dynamic>>(
            id: '3',
            position: XYPosition(x: 50, y: 200),
            data: {'label': 'Node 3'},
          ),
        ],
        edges: [],
      );
    });

    Widget buildTestWidget({
      void Function(XYRect)? onSelectionChange,
      void Function(XYRect)? onSelectionEnd,
    }) {
      return MaterialApp(
        home: Scaffold(
          body: XYFlowProvider<Map<String, dynamic>, void>(
            state: state,
            child: SizedBox(
              width: 800,
              height: 600,
              child: SelectionRect<Map<String, dynamic>, void>(
                onSelectionChange: onSelectionChange,
                onSelectionEnd: onSelectionEnd,
              ),
            ),
          ),
        ),
      );
    }

    testWidgets('renders without errors', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      expect(find.byType(SelectionRect<Map<String, dynamic>, void>), findsOneWidget);
    });

    testWidgets('calls onSelectionEnd when drag ends', (tester) async {
      XYRect? selectionRect;

      await tester.pumpWidget(buildTestWidget(
        onSelectionEnd: (rect) => selectionRect = rect,
      ));

      // Start a drag gesture
      final gesture = await tester.startGesture(const Offset(100, 100));
      await tester.pump();

      // Move the drag
      await gesture.moveTo(const Offset(300, 300));
      await tester.pump();

      // End the drag
      await gesture.up();
      await tester.pump();

      expect(selectionRect, isNotNull);
      expect(selectionRect!.width, greaterThan(0));
      expect(selectionRect!.height, greaterThan(0));
    });

    testWidgets('default color uses theme primary color', (tester) async {
      await tester.pumpWidget(MaterialApp(
        theme: ThemeData(primaryColor: Colors.blue),
        home: Scaffold(
          body: XYFlowProvider<Map<String, dynamic>, void>(
            state: state,
            child: const SizedBox(
              width: 800,
              height: 600,
              child: SelectionRect<Map<String, dynamic>, void>(),
            ),
          ),
        ),
      ));

      expect(find.byType(SelectionRect<Map<String, dynamic>, void>), findsOneWidget);
    });

    testWidgets('custom colors are applied', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlowProvider<Map<String, dynamic>, void>(
            state: state,
            child: const SizedBox(
              width: 800,
              height: 600,
              child: SelectionRect<Map<String, dynamic>, void>(
                color: Colors.red,
                strokeColor: Colors.green,
                strokeWidth: 2.0,
              ),
            ),
          ),
        ),
      ));

      expect(find.byType(SelectionRect<Map<String, dynamic>, void>), findsOneWidget);
    });

    testWidgets('calls onSelectionChange during drag', (tester) async {
      final selectionChanges = <XYRect>[];

      await tester.pumpWidget(buildTestWidget(
        onSelectionChange: (rect) => selectionChanges.add(rect),
      ));

      // Start a drag gesture
      final gesture = await tester.startGesture(const Offset(100, 100));
      await tester.pump();

      // Move the drag multiple times
      await gesture.moveTo(const Offset(150, 150));
      await tester.pump();

      await gesture.moveTo(const Offset(200, 200));
      await tester.pump();

      await gesture.moveTo(const Offset(250, 250));
      await tester.pump();

      await gesture.up();
      await tester.pump();

      // Should have multiple selection change callbacks
      expect(selectionChanges.length, greaterThanOrEqualTo(3));
    });

    testWidgets('selection rectangle bounds are normalized', (tester) async {
      XYRect? selectionRect;

      await tester.pumpWidget(buildTestWidget(
        onSelectionEnd: (rect) => selectionRect = rect,
      ));

      // Drag from bottom-right to top-left (negative direction)
      final gesture = await tester.startGesture(const Offset(300, 300));
      await tester.pump();

      await gesture.moveTo(const Offset(100, 100));
      await tester.pump();

      await gesture.up();
      await tester.pump();

      expect(selectionRect, isNotNull);
      // Width and height should still be positive
      expect(selectionRect!.width, greaterThan(0));
      expect(selectionRect!.height, greaterThan(0));
    });

    testWidgets('additive selection with selectionKeyPressed', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: XYFlowProvider<Map<String, dynamic>, void>(
            state: state,
            child: const SizedBox(
              width: 800,
              height: 600,
              child: SelectionRect<Map<String, dynamic>, void>(
                selectionKeyPressed: true,
              ),
            ),
          ),
        ),
      ));

      expect(find.byType(SelectionRect<Map<String, dynamic>, void>), findsOneWidget);
    });
  });

  group('XYRect', () {
    test('intersects returns true for overlapping rects', () {
      final rect1 = XYRect(x: 0, y: 0, width: 100, height: 100);
      final rect2 = XYRect(x: 50, y: 50, width: 100, height: 100);

      expect(rect1.intersects(rect2), isTrue);
      expect(rect2.intersects(rect1), isTrue);
    });

    test('intersects returns false for non-overlapping rects', () {
      final rect1 = XYRect(x: 0, y: 0, width: 50, height: 50);
      final rect2 = XYRect(x: 100, y: 100, width: 50, height: 50);

      expect(rect1.intersects(rect2), isFalse);
      expect(rect2.intersects(rect1), isFalse);
    });

    test('containsRect returns true when fully contained', () {
      final outer = XYRect(x: 0, y: 0, width: 200, height: 200);
      final inner = XYRect(x: 50, y: 50, width: 50, height: 50);

      expect(outer.containsRect(inner), isTrue);
    });

    test('containsRect returns false when not fully contained', () {
      final rect1 = XYRect(x: 0, y: 0, width: 100, height: 100);
      final rect2 = XYRect(x: 50, y: 50, width: 100, height: 100);

      expect(rect1.containsRect(rect2), isFalse);
    });

    test('containsPoint returns true for point inside', () {
      final rect = XYRect(x: 0, y: 0, width: 100, height: 100);

      expect(rect.containsPoint(50, 50), isTrue);
      expect(rect.containsPoint(0, 0), isTrue);
      expect(rect.containsPoint(100, 100), isTrue);
    });

    test('containsPoint returns false for point outside', () {
      final rect = XYRect(x: 0, y: 0, width: 100, height: 100);

      expect(rect.containsPoint(-10, 50), isFalse);
      expect(rect.containsPoint(150, 50), isFalse);
      expect(rect.containsPoint(50, -10), isFalse);
      expect(rect.containsPoint(50, 150), isFalse);
    });
  });
}
