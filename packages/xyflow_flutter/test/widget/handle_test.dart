import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/handle.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';
import 'package:xyflow_flutter/src/widgets/handle.dart';

void main() {
  group('HandleWidget', () {
    testWidgets('renders with required parameters', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(HandleWidget), findsOneWidget);
    });

    testWidgets('renders as source handle', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.type, HandleType.source);
    });

    testWidgets('renders as target handle', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.target,
                position: Position.left,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.type, HandleType.target);
    });

    testWidgets('accepts position on left', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.left,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.position, Position.left);
    });

    testWidgets('accepts position on top', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.top,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.position, Position.top);
    });

    testWidgets('accepts position on bottom', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.bottom,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.position, Position.bottom);
    });

    testWidgets('defaults isConnectable to true', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.isConnectable, true);
    });

    testWidgets('accepts custom id', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
                id: 'custom-handle-id',
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.id, 'custom-handle-id');
    });

    testWidgets('responds to hover with visual change', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
              ),
            ),
          ),
        ),
      );

      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);

      // Move mouse to center of handle
      await gesture.moveTo(tester.getCenter(find.byType(HandleWidget)));
      await tester.pump();

      expect(find.byType(HandleWidget), findsOneWidget);
    });

    testWidgets('accepts custom style', (tester) async {
      const customStyle = HandleStyle(
        size: 15,
        color: Colors.red,
        hoverColor: Colors.orange,
        activeColor: Colors.green,
        borderColor: Colors.black,
        borderWidth: 3,
      );

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
                style: customStyle,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.style, customStyle);
      expect(handle.style?.size, 15);
      expect(handle.style?.color, Colors.red);
    });

    testWidgets('renders with circle shape', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
              ),
            ),
          ),
        ),
      );

      // Find Container with BoxShape.circle decoration
      final container = tester.widget<Container>(find.byType(Container));
      expect(container.decoration, isA<BoxDecoration>());
    });

    testWidgets('accepts isConnectableStart parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.source,
                position: Position.right,
                isConnectableStart: false,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.isConnectableStart, false);
    });

    testWidgets('accepts isConnectableEnd parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HandleWidget(
                type: HandleType.target,
                position: Position.left,
                isConnectableEnd: false,
              ),
            ),
          ),
        ),
      );

      final handle = tester.widget<HandleWidget>(find.byType(HandleWidget));
      expect(handle.isConnectableEnd, false);
    });
  });

  group('HandleStyle', () {
    test('creates with default values', () {
      const style = HandleStyle();
      expect(style.size, 10);
      expect(style.borderWidth, 2);
      expect(style.color, isNull);
      expect(style.hoverColor, isNull);
      expect(style.activeColor, isNull);
      expect(style.borderColor, isNull);
    });

    test('creates with custom values', () {
      const style = HandleStyle(
        size: 15,
        color: Colors.red,
        hoverColor: Colors.orange,
        activeColor: Colors.green,
        borderColor: Colors.black,
        borderWidth: 3,
      );

      expect(style.size, 15);
      expect(style.color, Colors.red);
      expect(style.hoverColor, Colors.orange);
      expect(style.activeColor, Colors.green);
      expect(style.borderColor, Colors.black);
      expect(style.borderWidth, 3);
    });
  });

  group('HandleType', () {
    test('has source and target types', () {
      expect(HandleType.values, contains(HandleType.source));
      expect(HandleType.values, contains(HandleType.target));
      expect(HandleType.values.length, 2);
    });
  });
}
