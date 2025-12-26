import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/widgets/minimap.dart';
import 'package:xyflow_flutter/src/widgets/panel.dart';

void main() {
  group('MiniMap', () {
    testWidgets('renders with default parameters', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(MiniMap), findsOneWidget);
    });

    testWidgets('positions in bottomRight by default', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.position, PanelPosition.bottomRight);
    });

    testWidgets('uses default width and height', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.width, 200);
      expect(minimap.height, 150);
    });

    testWidgets('accepts custom width and height', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(width: 300, height: 200),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.width, 300);
      expect(minimap.height, 200);
    });

    testWidgets('accepts custom position', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(position: PanelPosition.topRight),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.position, PanelPosition.topRight);
    });

    testWidgets('accepts custom node color', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(nodeColor: Colors.red),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.nodeColor, Colors.red);
    });

    testWidgets('accepts custom mask color', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(maskColor: Colors.blue),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.maskColor, Colors.blue);
    });

    testWidgets('accepts custom background color', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(backgroundColor: Colors.white),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.backgroundColor, Colors.white);
    });

    testWidgets('zoomable defaults to true', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.zoomable, true);
    });

    testWidgets('pannable defaults to true', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.pannable, true);
    });

    testWidgets('can disable zooming', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(zoomable: false),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.zoomable, false);
    });

    testWidgets('can disable panning', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(pannable: false),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.pannable, false);
    });

    testWidgets('renders with CustomPaint', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      // MiniMap uses CustomPaint for the minimap painter
      // Container's BoxDecoration may also use CustomPaint internally
      expect(find.byType(CustomPaint), findsWidgets);
    });

    testWidgets('accepts custom node stroke width', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(nodeStrokeWidth: 4),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.nodeStrokeWidth, 4);
    });

    testWidgets('accepts custom node border radius', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(nodeBorderRadius: 10),
              ],
            ),
          ),
        ),
      );

      final minimap = tester.widget<MiniMap>(find.byType(MiniMap));
      expect(minimap.nodeBorderRadius, 10);
    });

    testWidgets('renders inside a Panel', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(Panel), findsOneWidget);
    });

    testWidgets('renders with box shadow', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      // MiniMap uses Container with BoxDecoration for shadow
      expect(find.byType(Container), findsWidgets);
    });

    testWidgets('renders with clip behavior', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(ClipRRect), findsOneWidget);
    });

    testWidgets('wraps content in GestureDetector', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                MiniMap(),
              ],
            ),
          ),
        ),
      );

      // MiniMap wraps its CustomPaint in a GestureDetector for pan handling
      expect(find.byType(GestureDetector), findsWidgets);
    });
  });
}
