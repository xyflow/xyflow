import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/widgets/panel.dart';

void main() {
  group('Panel', () {
    testWidgets('renders child widget', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  child: Text('Panel Content'),
                ),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Panel Content'), findsOneWidget);
    });

    testWidgets('positions in topLeft by default', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final panel = tester.widget<Panel>(find.byType(Panel));
      expect(panel.position, PanelPosition.topLeft);
    });

    testWidgets('positions in topRight when specified', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.topRight,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final panel = tester.widget<Panel>(find.byType(Panel));
      expect(panel.position, PanelPosition.topRight);
    });

    testWidgets('positions in bottomLeft when specified', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.bottomLeft,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final panel = tester.widget<Panel>(find.byType(Panel));
      expect(panel.position, PanelPosition.bottomLeft);
    });

    testWidgets('positions in bottomRight when specified', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.bottomRight,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final panel = tester.widget<Panel>(find.byType(Panel));
      expect(panel.position, PanelPosition.bottomRight);
    });

    testWidgets('applies default padding', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.top, 10); // Default padding
      expect(positioned.left, 10);
    });

    testWidgets('applies custom padding', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  padding: EdgeInsets.all(20),
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.top, 20);
      expect(positioned.left, 20);
    });

    testWidgets('topCenter positions at top without left/right', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.topCenter,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.top, isNotNull);
      expect(positioned.left, isNull);
      expect(positioned.right, isNull);
    });

    testWidgets('bottomCenter positions at bottom without left/right', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.bottomCenter,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.bottom, isNotNull);
      expect(positioned.left, isNull);
      expect(positioned.right, isNull);
    });

    testWidgets('centerLeft positions on left without top/bottom', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.centerLeft,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.left, isNotNull);
      expect(positioned.top, isNull);
      expect(positioned.bottom, isNull);
    });

    testWidgets('centerRight positions on right without top/bottom', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Panel(
                  position: PanelPosition.centerRight,
                  child: SizedBox(width: 50, height: 50),
                ),
              ],
            ),
          ),
        ),
      );

      final positioned = tester.widget<Positioned>(find.byType(Positioned));
      expect(positioned.right, isNotNull);
      expect(positioned.top, isNull);
      expect(positioned.bottom, isNull);
    });
  });

  group('PanelPosition', () {
    test('has all expected positions', () {
      expect(PanelPosition.values, contains(PanelPosition.topLeft));
      expect(PanelPosition.values, contains(PanelPosition.topCenter));
      expect(PanelPosition.values, contains(PanelPosition.topRight));
      expect(PanelPosition.values, contains(PanelPosition.bottomLeft));
      expect(PanelPosition.values, contains(PanelPosition.bottomCenter));
      expect(PanelPosition.values, contains(PanelPosition.bottomRight));
      expect(PanelPosition.values, contains(PanelPosition.centerLeft));
      expect(PanelPosition.values, contains(PanelPosition.centerRight));
      expect(PanelPosition.values.length, 8);
    });
  });
}
