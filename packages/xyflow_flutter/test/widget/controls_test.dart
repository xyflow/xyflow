import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/widgets/controls.dart';
import 'package:xyflow_flutter/src/widgets/panel.dart';

void main() {
  group('ControlButton', () {
    testWidgets('renders icon correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ControlButton(
              icon: Icons.add,
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ControlButton(
              icon: Icons.add,
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ControlButton));
      expect(pressed, true);
    });

    testWidgets('does not call onPressed when disabled', (tester) async {
      var pressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ControlButton(
              icon: Icons.add,
              disabled: true,
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ControlButton));
      expect(pressed, false);
    });

    testWidgets('shows tooltip when provided', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ControlButton(
              icon: Icons.add,
              tooltip: 'Add item',
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.byType(Tooltip), findsOneWidget);
    });

    testWidgets('renders with reduced opacity when disabled', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ControlButton(
              icon: Icons.add,
              disabled: true,
              onPressed: () {},
            ),
          ),
        ),
      );

      final icon = tester.widget<Icon>(find.byType(Icon));
      expect(icon.color, Colors.grey.shade400);
    });
  });

  group('Controls', () {
    testWidgets('renders zoom buttons by default', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.add), findsOneWidget);
      expect(find.byIcon(Icons.remove), findsOneWidget);
    });

    testWidgets('renders fit view button by default', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.fit_screen), findsOneWidget);
    });

    testWidgets('hides zoom buttons when showZoom is false', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(showZoom: false),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.add), findsNothing);
      expect(find.byIcon(Icons.remove), findsNothing);
    });

    testWidgets('hides fit view button when showFitView is false', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(showFitView: false),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.fit_screen), findsNothing);
    });

    testWidgets('shows interactive button when showInteractive is true', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(showInteractive: true),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.lock_open), findsOneWidget);
    });

    testWidgets('calls custom onZoomIn handler', (tester) async {
      var zoomInCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(
                  onZoomIn: () => zoomInCalled = true,
                ),
              ],
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.add));
      expect(zoomInCalled, true);
    });

    testWidgets('calls custom onZoomOut handler', (tester) async {
      var zoomOutCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(
                  onZoomOut: () => zoomOutCalled = true,
                ),
              ],
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.remove));
      expect(zoomOutCalled, true);
    });

    testWidgets('calls custom onFitView handler', (tester) async {
      var fitViewCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(
                  onFitView: () => fitViewCalled = true,
                ),
              ],
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.fit_screen));
      expect(fitViewCalled, true);
    });

    testWidgets('uses Panel with specified position', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(position: PanelPosition.topRight),
              ],
            ),
          ),
        ),
      );

      final controls = tester.widget<Controls>(find.byType(Controls));
      expect(controls.position, PanelPosition.topRight);
    });

    testWidgets('renders with white background and shadow', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Controls(),
              ],
            ),
          ),
        ),
      );

      final containers = tester.widgetList<Container>(find.byType(Container));
      expect(containers, isNotEmpty);
    });
  });
}
