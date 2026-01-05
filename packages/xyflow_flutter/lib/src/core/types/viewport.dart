import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:vector_math/vector_math_64.dart';

/// Represents the viewport state including pan offset and zoom level.
///
/// The viewport determines which portion of the infinite canvas is visible
/// and at what scale.
@immutable
class Viewport {
  /// Creates a viewport with the given [x], [y] offset and [zoom] level.
  const Viewport({
    this.x = 0,
    this.y = 0,
    this.zoom = 1,
  });

  /// Creates a default viewport centered at origin with zoom 1.
  const Viewport.initial()
      : x = 0,
        y = 0,
        zoom = 1;

  /// The x-coordinate of the viewport offset (translation).
  final double x;

  /// The y-coordinate of the viewport offset (translation).
  final double y;

  /// The zoom level of the viewport. 1.0 means no zoom.
  final double zoom;

  /// Creates a copy of this viewport with the given fields replaced.
  Viewport copyWith({
    double? x,
    double? y,
    double? zoom,
  }) {
    return Viewport(
      x: x ?? this.x,
      y: y ?? this.y,
      zoom: zoom ?? this.zoom,
    );
  }

  /// Converts this viewport to a transformation matrix.
  ///
  /// The matrix applies translation first, then scaling.
  Matrix4 toMatrix4() {
    return Matrix4.identity()
      ..translate(x, y)
      ..scale(zoom, zoom, 1.0);
  }

  /// Converts this viewport to a [Transform] tuple (x, y, zoom).
  Transform toTransform() => (x, y, zoom);

  /// Creates a viewport from a [Transform] tuple.
  factory Viewport.fromTransform(Transform transform) {
    return Viewport(
      x: transform.$1,
      y: transform.$2,
      zoom: transform.$3,
    );
  }

  /// Converts screen coordinates to canvas (flow) coordinates.
  ///
  /// This is the inverse of [canvasToScreen].
  Offset screenToCanvas(Offset screenPosition) {
    return Offset(
      (screenPosition.dx - x) / zoom,
      (screenPosition.dy - y) / zoom,
    );
  }

  /// Converts canvas (flow) coordinates to screen coordinates.
  ///
  /// This is the inverse of [screenToCanvas].
  Offset canvasToScreen(Offset canvasPosition) {
    return Offset(
      canvasPosition.dx * zoom + x,
      canvasPosition.dy * zoom + y,
    );
  }

  /// Converts this viewport to a JSON map.
  Map<String, dynamic> toJson() => {'x': x, 'y': y, 'zoom': zoom};

  /// Creates a viewport from a JSON map.
  factory Viewport.fromJson(Map<String, dynamic> json) {
    return Viewport(
      x: (json['x'] as num?)?.toDouble() ?? 0,
      y: (json['y'] as num?)?.toDouble() ?? 0,
      zoom: (json['zoom'] as num?)?.toDouble() ?? 1,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Viewport &&
        other.x == x &&
        other.y == y &&
        other.zoom == zoom;
  }

  @override
  int get hashCode => Object.hash(x, y, zoom);

  @override
  String toString() => 'Viewport(x: $x, y: $y, zoom: $zoom)';
}

/// A tuple representing a viewport transform as (x, y, zoom).
///
/// This matches the TypeScript Transform type: [number, number, number].
typedef Transform = (double x, double y, double zoom);

/// Extension methods for the [Transform] type.
extension TransformExtension on Transform {
  /// The x-coordinate of the transform.
  double get x => $1;

  /// The y-coordinate of the transform.
  double get y => $2;

  /// The zoom level of the transform.
  double get zoom => $3;

  /// Converts this transform to a [Viewport].
  Viewport toViewport() => Viewport(x: $1, y: $2, zoom: $3);

  /// Converts this transform to a transformation matrix.
  Matrix4 toMatrix4() {
    return Matrix4.identity()
      ..translate($1, $2)
      ..scale($3, $3, 1.0);
  }
}

/// Represents the extent (bounds) of coordinates.
///
/// Used for constraining pan/zoom and node positions.
@immutable
class CoordinateExtent {
  /// Creates a coordinate extent with the given min and max points.
  const CoordinateExtent({
    required this.min,
    required this.max,
  });

  /// Creates an infinite extent (no constraints).
  const CoordinateExtent.infinite()
      : min = const Offset(double.negativeInfinity, double.negativeInfinity),
        max = const Offset(double.infinity, double.infinity);

  /// The minimum (top-left) point of the extent.
  final Offset min;

  /// The maximum (bottom-right) point of the extent.
  final Offset max;

  /// The width of the extent.
  double get width => max.dx - min.dx;

  /// The height of the extent.
  double get height => max.dy - min.dy;

  /// Returns true if the given point is within this extent.
  bool contains(Offset point) {
    return point.dx >= min.dx &&
        point.dx <= max.dx &&
        point.dy >= min.dy &&
        point.dy <= max.dy;
  }

  /// Clamps the given point to be within this extent.
  Offset clamp(Offset point) {
    return Offset(
      point.dx.clamp(min.dx, max.dx),
      point.dy.clamp(min.dy, max.dy),
    );
  }

  /// Converts this extent to a JSON map.
  Map<String, dynamic> toJson() => {
        'min': {'x': min.dx, 'y': min.dy},
        'max': {'x': max.dx, 'y': max.dy},
      };

  /// Creates an extent from a JSON map.
  factory CoordinateExtent.fromJson(Map<String, dynamic> json) {
    final minJson = json['min'] as Map<String, dynamic>;
    final maxJson = json['max'] as Map<String, dynamic>;
    return CoordinateExtent(
      min: Offset(
        (minJson['x'] as num).toDouble(),
        (minJson['y'] as num).toDouble(),
      ),
      max: Offset(
        (maxJson['x'] as num).toDouble(),
        (maxJson['y'] as num).toDouble(),
      ),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CoordinateExtent && other.min == min && other.max == max;
  }

  @override
  int get hashCode => Object.hash(min, max);

  @override
  String toString() => 'CoordinateExtent(min: $min, max: $max)';
}
