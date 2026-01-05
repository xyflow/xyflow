import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/types/position.dart';

void main() {
  group('XYPosition', () {
    test('creates with x and y coordinates', () {
      const pos = XYPosition(x: 10, y: 20);
      expect(pos.x, 10);
      expect(pos.y, 20);
    });

    test('XYPosition.zero creates position at origin', () {
      const pos = XYPosition.zero();
      expect(pos.x, 0);
      expect(pos.y, 0);
    });

    test('equality works correctly', () {
      const pos1 = XYPosition(x: 10, y: 20);
      const pos2 = XYPosition(x: 10, y: 20);
      const pos3 = XYPosition(x: 10, y: 30);

      expect(pos1, equals(pos2));
      expect(pos1, isNot(equals(pos3)));
    });

    test('hashCode is consistent for equal positions', () {
      const pos1 = XYPosition(x: 10, y: 20);
      const pos2 = XYPosition(x: 10, y: 20);

      expect(pos1.hashCode, equals(pos2.hashCode));
    });

    test('copyWith creates new instance with updated values', () {
      const original = XYPosition(x: 10, y: 20);
      final copied = original.copyWith(x: 30);

      expect(copied.x, 30);
      expect(copied.y, 20);
      expect(original.x, 10); // Original unchanged
    });

    test('addition operator works correctly', () {
      const pos1 = XYPosition(x: 10, y: 20);
      const pos2 = XYPosition(x: 5, y: 15);
      final result = pos1 + pos2;

      expect(result.x, 15);
      expect(result.y, 35);
    });

    test('subtraction operator works correctly', () {
      const pos1 = XYPosition(x: 10, y: 20);
      const pos2 = XYPosition(x: 5, y: 15);
      final result = pos1 - pos2;

      expect(result.x, 5);
      expect(result.y, 5);
    });

    test('multiplication operator works correctly', () {
      const pos = XYPosition(x: 10, y: 20);
      final result = pos * 2;

      expect(result.x, 20);
      expect(result.y, 40);
    });

    test('division operator works correctly', () {
      const pos = XYPosition(x: 10, y: 20);
      final result = pos / 2;

      expect(result.x, 5);
      expect(result.y, 10);
    });

    test('distanceTo calculates distance correctly', () {
      const pos1 = XYPosition(x: 0, y: 0);
      const pos2 = XYPosition(x: 3, y: 4);

      // Distance should be 5 (3-4-5 triangle)
      expect(pos1.distanceTo(pos2), closeTo(25, 0.001)); // Returns squared distance
    });

    test('toJson serializes correctly', () {
      const pos = XYPosition(x: 10, y: 20);
      final json = pos.toJson();

      expect(json['x'], 10);
      expect(json['y'], 20);
    });

    test('fromJson deserializes correctly', () {
      final json = {'x': 10.0, 'y': 20.0};
      final pos = XYPosition.fromJson(json);

      expect(pos.x, 10);
      expect(pos.y, 20);
    });
  });

  group('Position enum', () {
    test('opposite returns correct value for left', () {
      expect(Position.left.opposite, Position.right);
    });

    test('opposite returns correct value for right', () {
      expect(Position.right.opposite, Position.left);
    });

    test('opposite returns correct value for top', () {
      expect(Position.top.opposite, Position.bottom);
    });

    test('opposite returns correct value for bottom', () {
      expect(Position.bottom.opposite, Position.top);
    });

    test('isHorizontal returns true for left and right', () {
      expect(Position.left.isHorizontal, true);
      expect(Position.right.isHorizontal, true);
      expect(Position.top.isHorizontal, false);
      expect(Position.bottom.isHorizontal, false);
    });

    test('isVertical returns true for top and bottom', () {
      expect(Position.top.isVertical, true);
      expect(Position.bottom.isVertical, true);
      expect(Position.left.isVertical, false);
      expect(Position.right.isVertical, false);
    });
  });
}
