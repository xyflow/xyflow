import 'dart:ui';

import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/viewport.dart';

void main() {
  group('Viewport', () {
    test('creates with default values', () {
      const viewport = Viewport();
      expect(viewport.x, 0);
      expect(viewport.y, 0);
      expect(viewport.zoom, 1);
    });

    test('creates initial viewport', () {
      const viewport = Viewport.initial();
      expect(viewport.x, 0);
      expect(viewport.y, 0);
      expect(viewport.zoom, 1);
    });

    test('equality works correctly', () {
      const v1 = Viewport(x: 10, y: 20, zoom: 1.5);
      const v2 = Viewport(x: 10, y: 20, zoom: 1.5);
      const v3 = Viewport(x: 10, y: 20, zoom: 2.0);

      expect(v1, equals(v2));
      expect(v1, isNot(equals(v3)));
    });

    test('copyWith creates new instance', () {
      const original = Viewport(x: 10, y: 20, zoom: 1.5);
      final copied = original.copyWith(zoom: 2.0);

      expect(copied.x, 10);
      expect(copied.y, 20);
      expect(copied.zoom, 2.0);
      expect(original.zoom, 1.5);
    });

    test('screenToCanvas transforms correctly at zoom 1', () {
      const viewport = Viewport(x: 100, y: 50, zoom: 1);
      final result = viewport.screenToCanvas(const Offset(200, 150));

      expect(result.dx, 100); // (200 - 100) / 1
      expect(result.dy, 100); // (150 - 50) / 1
    });

    test('screenToCanvas transforms correctly at zoom 2', () {
      const viewport = Viewport(x: 100, y: 50, zoom: 2);
      final result = viewport.screenToCanvas(const Offset(200, 150));

      expect(result.dx, 50); // (200 - 100) / 2
      expect(result.dy, 50); // (150 - 50) / 2
    });

    test('canvasToScreen transforms correctly', () {
      const viewport = Viewport(x: 100, y: 50, zoom: 2);
      final result = viewport.canvasToScreen(const Offset(50, 50));

      expect(result.dx, 200); // 50 * 2 + 100
      expect(result.dy, 150); // 50 * 2 + 50
    });

    test('screenToCanvas and canvasToScreen are inverse operations', () {
      const viewport = Viewport(x: 100, y: 50, zoom: 1.5);
      const original = Offset(150, 200);

      final canvas = viewport.screenToCanvas(original);
      final backToScreen = viewport.canvasToScreen(canvas);

      expect(backToScreen.dx, closeTo(original.dx, 0.001));
      expect(backToScreen.dy, closeTo(original.dy, 0.001));
    });

    test('toJson serializes correctly', () {
      const viewport = Viewport(x: 10, y: 20, zoom: 1.5);
      final json = viewport.toJson();

      expect(json['x'], 10);
      expect(json['y'], 20);
      expect(json['zoom'], 1.5);
    });

    test('fromJson deserializes correctly', () {
      final json = {'x': 10.0, 'y': 20.0, 'zoom': 1.5};
      final viewport = Viewport.fromJson(json);

      expect(viewport.x, 10);
      expect(viewport.y, 20);
      expect(viewport.zoom, 1.5);
    });

    test('toTransform returns correct tuple', () {
      const viewport = Viewport(x: 10, y: 20, zoom: 1.5);
      final transform = viewport.toTransform();

      expect(transform.$1, 10);
      expect(transform.$2, 20);
      expect(transform.$3, 1.5);
    });

    test('fromTransform creates viewport from tuple', () {
      const transform = (10.0, 20.0, 1.5);
      final viewport = Viewport.fromTransform(transform);

      expect(viewport.x, 10);
      expect(viewport.y, 20);
      expect(viewport.zoom, 1.5);
    });
  });

  group('CoordinateExtent', () {
    test('creates with min and max', () {
      const extent = CoordinateExtent(
        min: Offset(-100, -100),
        max: Offset(100, 100),
      );

      expect(extent.min, const Offset(-100, -100));
      expect(extent.max, const Offset(100, 100));
    });

    test('infinite extent has infinite bounds', () {
      const extent = CoordinateExtent.infinite();

      expect(extent.min.dx, double.negativeInfinity);
      expect(extent.min.dy, double.negativeInfinity);
      expect(extent.max.dx, double.infinity);
      expect(extent.max.dy, double.infinity);
    });

    test('width calculates correctly', () {
      const extent = CoordinateExtent(
        min: Offset(-50, -100),
        max: Offset(50, 100),
      );

      expect(extent.width, 100);
    });

    test('height calculates correctly', () {
      const extent = CoordinateExtent(
        min: Offset(-50, -100),
        max: Offset(50, 100),
      );

      expect(extent.height, 200);
    });

    test('contains returns true for point inside', () {
      const extent = CoordinateExtent(
        min: Offset(-100, -100),
        max: Offset(100, 100),
      );

      expect(extent.contains(const Offset(0, 0)), true);
      expect(extent.contains(const Offset(50, 50)), true);
    });

    test('contains returns false for point outside', () {
      const extent = CoordinateExtent(
        min: Offset(-100, -100),
        max: Offset(100, 100),
      );

      expect(extent.contains(const Offset(150, 0)), false);
      expect(extent.contains(const Offset(0, 150)), false);
    });

    test('clamp constrains point to extent', () {
      const extent = CoordinateExtent(
        min: Offset(-100, -100),
        max: Offset(100, 100),
      );

      expect(extent.clamp(const Offset(150, 150)), const Offset(100, 100));
      expect(extent.clamp(const Offset(-150, -150)), const Offset(-100, -100));
      expect(extent.clamp(const Offset(50, 50)), const Offset(50, 50));
    });
  });
}
