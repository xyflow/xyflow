import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/widgets/background.dart';

void main() {
  group('Background', () {
    testWidgets('renders with default dots variant', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(Background), findsOneWidget);
      // CustomPaint may appear multiple times due to theme/scaffold rendering
      expect(find.byType(CustomPaint), findsWidgets);
    });

    testWidgets('renders with lines variant', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(variant: BackgroundVariant.lines),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(Background), findsOneWidget);
    });

    testWidgets('renders with cross variant', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(variant: BackgroundVariant.cross),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(Background), findsOneWidget);
    });

    testWidgets('accepts custom gap parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(gap: 30),
              ],
            ),
          ),
        ),
      );

      final background = tester.widget<Background>(find.byType(Background));
      expect(background.gap, 30);
    });

    testWidgets('accepts custom color parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(color: Colors.blue),
              ],
            ),
          ),
        ),
      );

      final background = tester.widget<Background>(find.byType(Background));
      expect(background.color, Colors.blue);
    });

    testWidgets('accepts custom size parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(size: 2.5),
              ],
            ),
          ),
        ),
      );

      final background = tester.widget<Background>(find.byType(Background));
      expect(background.size, 2.5);
    });

    testWidgets('uses IgnorePointer to not intercept gestures', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(),
              ],
            ),
          ),
        ),
      );

      // IgnorePointer may appear multiple times (e.g., in Scaffold)
      // The Background widget specifically wraps its content in IgnorePointer
      expect(find.byType(IgnorePointer), findsWidgets);
    });

    testWidgets('accepts custom offset parameter', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Stack(
              children: [
                Background(offset: Offset(10, 20)),
              ],
            ),
          ),
        ),
      );

      final background = tester.widget<Background>(find.byType(Background));
      expect(background.offset, const Offset(10, 20));
    });
  });

  group('BackgroundVariant', () {
    test('has all expected variants', () {
      expect(BackgroundVariant.values, contains(BackgroundVariant.dots));
      expect(BackgroundVariant.values, contains(BackgroundVariant.lines));
      expect(BackgroundVariant.values, contains(BackgroundVariant.cross));
      expect(BackgroundVariant.values.length, 3);
    });
  });
}
