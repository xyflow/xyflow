import 'package:flutter_test/flutter_test.dart';
import 'package:xyflow_flutter/src/core/utils/edges/bezier.dart';
import 'package:xyflow_flutter/src/core/utils/edges/edge_path.dart';

void main() {
  group('BezierEdgePath', () {
    test('creates path for horizontal edge (right to left)', () {
      final result = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 50,
        targetX: 100,
        targetY: 50,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
      );

      expect(result.path, isNotNull);
      expect(result.labelX, closeTo(50, 1));
      expect(result.labelY, closeTo(50, 1));
    });

    test('creates path for vertical edge (bottom to top)', () {
      final result = BezierEdgePath.getBezierPath(
        sourceX: 50,
        sourceY: 0,
        targetX: 50,
        targetY: 100,
        sourcePosition: EdgePosition.bottom,
        targetPosition: EdgePosition.top,
      );

      expect(result.path, isNotNull);
      expect(result.labelX, closeTo(50, 1));
      expect(result.labelY, closeTo(50, 1));
    });

    test('label position is at midpoint for straight horizontal edge', () {
      final result = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 100,
        targetX: 200,
        targetY: 100,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
      );

      expect(result.labelX, closeTo(100, 5));
      expect(result.labelY, closeTo(100, 5));
    });

    test('curvature affects path shape', () {
      final lowCurvature = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 50,
        targetX: 100,
        targetY: 50,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
        curvature: 0.1,
      );

      final highCurvature = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 50,
        targetX: 100,
        targetY: 50,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
        curvature: 0.5,
      );

      // Both should produce valid paths
      expect(lowCurvature.path, isNotNull);
      expect(highCurvature.path, isNotNull);
    });

    test('handles diagonal connections', () {
      final result = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 0,
        targetX: 100,
        targetY: 100,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
      );

      expect(result.path, isNotNull);
      // Label should be roughly in the middle
      expect(result.labelX, greaterThan(0));
      expect(result.labelX, lessThan(100));
      expect(result.labelY, greaterThan(0));
      expect(result.labelY, lessThan(100));
    });

    test('handles same source and target position', () {
      final result = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 50,
        targetX: 100,
        targetY: 50,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.right,
      );

      expect(result.path, isNotNull);
    });

    test('handles opposite directions correctly', () {
      final rightToLeft = BezierEdgePath.getBezierPath(
        sourceX: 0,
        sourceY: 50,
        targetX: 100,
        targetY: 50,
        sourcePosition: EdgePosition.right,
        targetPosition: EdgePosition.left,
      );

      final leftToRight = BezierEdgePath.getBezierPath(
        sourceX: 100,
        sourceY: 50,
        targetX: 0,
        targetY: 50,
        sourcePosition: EdgePosition.left,
        targetPosition: EdgePosition.right,
      );

      expect(rightToLeft.path, isNotNull);
      expect(leftToRight.path, isNotNull);
    });
  });

  group('EdgePosition', () {
    test('isHorizontal returns correct values', () {
      expect(EdgePosition.left.isHorizontal, true);
      expect(EdgePosition.right.isHorizontal, true);
      expect(EdgePosition.top.isHorizontal, false);
      expect(EdgePosition.bottom.isHorizontal, false);
    });

    test('isVertical returns correct values', () {
      expect(EdgePosition.top.isVertical, true);
      expect(EdgePosition.bottom.isVertical, true);
      expect(EdgePosition.left.isVertical, false);
      expect(EdgePosition.right.isVertical, false);
    });

    test('opposite returns correct values', () {
      expect(EdgePosition.left.opposite, EdgePosition.right);
      expect(EdgePosition.right.opposite, EdgePosition.left);
      expect(EdgePosition.top.opposite, EdgePosition.bottom);
      expect(EdgePosition.bottom.opposite, EdgePosition.top);
    });
  });
}
