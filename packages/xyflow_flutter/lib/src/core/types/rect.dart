import 'dart:ui';

import 'package:flutter/foundation.dart';

import 'position.dart';

/// Represents a rectangle with position and dimensions.
///
/// This is used for node bounds, selection rectangles, and viewport calculations.
@immutable
class XYRect {
  /// Creates a rectangle with the given position and dimensions.
  const XYRect({
    required this.x,
    required this.y,
    required this.width,
    required this.height,
  });

  /// Creates an empty rectangle at the origin.
  const XYRect.zero()
      : x = 0,
        y = 0,
        width = 0,
        height = 0;

  /// Creates a rectangle from a Flutter [Rect].
  factory XYRect.fromRect(Rect rect) {
    return XYRect(
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    );
  }

  /// Creates a rectangle from two positions (top-left and bottom-right).
  factory XYRect.fromPositions(XYPosition topLeft, XYPosition bottomRight) {
    return XYRect(
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    );
  }

  /// The x-coordinate of the top-left corner.
  final double x;

  /// The y-coordinate of the top-left corner.
  final double y;

  /// The width of the rectangle.
  final double width;

  /// The height of the rectangle.
  final double height;

  /// The left edge of the rectangle (same as x).
  double get left => x;

  /// The top edge of the rectangle (same as y).
  double get top => y;

  /// The right edge of the rectangle.
  double get right => x + width;

  /// The bottom edge of the rectangle.
  double get bottom => y + height;

  /// The center point of the rectangle.
  XYPosition get center => XYPosition(
        x: x + width / 2,
        y: y + height / 2,
      );

  /// The top-left corner of the rectangle.
  XYPosition get topLeft => XYPosition(x: x, y: y);

  /// The top-right corner of the rectangle.
  XYPosition get topRight => XYPosition(x: right, y: y);

  /// The bottom-left corner of the rectangle.
  XYPosition get bottomLeft => XYPosition(x: x, y: bottom);

  /// The bottom-right corner of the rectangle.
  XYPosition get bottomRight => XYPosition(x: right, y: bottom);

  /// Returns true if this rectangle is empty (has zero area).
  bool get isEmpty => width <= 0 || height <= 0;

  /// Creates a copy of this rectangle with the given fields replaced.
  XYRect copyWith({
    double? x,
    double? y,
    double? width,
    double? height,
  }) {
    return XYRect(
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
    );
  }

  /// Returns true if this rectangle contains the given point.
  bool containsPoint(XYPosition point) {
    return point.x >= x &&
        point.x <= right &&
        point.y >= y &&
        point.y <= bottom;
  }

  /// Returns true if this rectangle intersects with another.
  bool intersects(XYRect other) {
    return left < other.right &&
        right > other.left &&
        top < other.bottom &&
        bottom > other.top;
  }

  /// Returns true if this rectangle fully contains another.
  bool containsRect(XYRect other) {
    return x <= other.x &&
        y <= other.y &&
        right >= other.right &&
        bottom >= other.bottom;
  }

  /// Returns the intersection of this rectangle with another.
  ///
  /// Returns null if there is no intersection.
  XYRect? intersection(XYRect other) {
    final newLeft = x > other.x ? x : other.x;
    final newTop = y > other.y ? y : other.y;
    final newRight = right < other.right ? right : other.right;
    final newBottom = bottom < other.bottom ? bottom : other.bottom;

    if (newRight <= newLeft || newBottom <= newTop) {
      return null;
    }

    return XYRect(
      x: newLeft,
      y: newTop,
      width: newRight - newLeft,
      height: newBottom - newTop,
    );
  }

  /// Returns the union of this rectangle with another.
  XYRect union(XYRect other) {
    final newLeft = x < other.x ? x : other.x;
    final newTop = y < other.y ? y : other.y;
    final newRight = right > other.right ? right : other.right;
    final newBottom = bottom > other.bottom ? bottom : other.bottom;

    return XYRect(
      x: newLeft,
      y: newTop,
      width: newRight - newLeft,
      height: newBottom - newTop,
    );
  }

  /// Expands this rectangle by the given amount on all sides.
  XYRect expand(double amount) {
    return XYRect(
      x: x - amount,
      y: y - amount,
      width: width + amount * 2,
      height: height + amount * 2,
    );
  }

  /// Converts this to a Flutter [Rect].
  Rect toRect() => Rect.fromLTWH(x, y, width, height);

  /// Converts this rectangle to a JSON map.
  Map<String, dynamic> toJson() => {
        'x': x,
        'y': y,
        'width': width,
        'height': height,
      };

  /// Creates a rectangle from a JSON map.
  factory XYRect.fromJson(Map<String, dynamic> json) {
    return XYRect(
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      width: (json['width'] as num).toDouble(),
      height: (json['height'] as num).toDouble(),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is XYRect &&
        other.x == x &&
        other.y == y &&
        other.width == width &&
        other.height == height;
  }

  @override
  int get hashCode => Object.hash(x, y, width, height);

  @override
  String toString() => 'XYRect($x, $y, $width, $height)';
}
