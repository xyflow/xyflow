import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/connection.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';
import 'package:xyflow_flutter/src/widgets/connection_line.dart';

void main() {
  group('ConnectionLine', () {
    testWidgets('renders with required parameters', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
      // CustomPaint may appear multiple times due to theme/scaffold rendering
      expect(find.byType(CustomPaint), findsWidgets);
    });

    testWidgets('accepts different connection line types', (tester) async {
      for (final type in ConnectionLineType.values) {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: SizedBox(
                width: 400,
                height: 400,
                child: ConnectionLine(
                  fromX: 0,
                  fromY: 0,
                  toX: 100,
                  toY: 100,
                  connectionLineType: type,
                ),
              ),
            ),
          ),
        );

        expect(find.byType(ConnectionLine), findsOneWidget);
      }
    });

    testWidgets('accepts custom color', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
                color: Colors.red,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.color, Colors.red);
    });

    testWidgets('accepts custom stroke width', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
                strokeWidth: 3.0,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.strokeWidth, 3.0);
    });

    testWidgets('uses default stroke width of 1.5', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.strokeWidth, 1.5);
    });

    testWidgets('accepts from and to positions', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
                fromPosition: Position.bottom,
                toPosition: Position.top,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.fromPosition, Position.bottom);
      expect(connectionLine.toPosition, Position.top);
    });

    testWidgets('defaults to right -> left positions', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.fromPosition, Position.right);
      expect(connectionLine.toPosition, Position.left);
    });

    testWidgets('isValid defaults to true', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
              ),
            ),
          ),
        ),
      );

      final connectionLine = tester.widget<ConnectionLine>(find.byType(ConnectionLine));
      expect(connectionLine.isValid, true);
    });

    testWidgets('renders correctly when isValid is false', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 0,
                fromY: 0,
                toX: 100,
                toY: 100,
                isValid: false,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });

    testWidgets('renders bezier connection line', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 50,
                fromY: 50,
                toX: 200,
                toY: 150,
                connectionLineType: ConnectionLineType.bezier,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });

    testWidgets('renders smoothStep connection line', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 50,
                fromY: 50,
                toX: 200,
                toY: 150,
                connectionLineType: ConnectionLineType.smoothStep,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });

    testWidgets('renders step connection line', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 50,
                fromY: 50,
                toX: 200,
                toY: 150,
                connectionLineType: ConnectionLineType.step,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });

    testWidgets('renders straight connection line', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 50,
                fromY: 50,
                toX: 200,
                toY: 150,
                connectionLineType: ConnectionLineType.straight,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });

    testWidgets('renders simpleBezier connection line', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 400,
              child: ConnectionLine(
                fromX: 50,
                fromY: 50,
                toX: 200,
                toY: 150,
                connectionLineType: ConnectionLineType.simpleBezier,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(ConnectionLine), findsOneWidget);
    });
  });

  group('ConnectionLineType', () {
    test('has all expected types', () {
      expect(ConnectionLineType.values, contains(ConnectionLineType.bezier));
      expect(ConnectionLineType.values, contains(ConnectionLineType.smoothStep));
      expect(ConnectionLineType.values, contains(ConnectionLineType.step));
      expect(ConnectionLineType.values, contains(ConnectionLineType.straight));
      expect(ConnectionLineType.values, contains(ConnectionLineType.simpleBezier));
      expect(ConnectionLineType.values.length, 5);
    });
  });
}
