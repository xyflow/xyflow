import 'dart:ui';

import 'package:flutter/foundation.dart';

/// Types of edge markers (arrows).
enum EdgeMarkerType {
  /// Simple arrow marker.
  arrow,

  /// Closed/filled arrow marker.
  arrowClosed,
}

/// Represents a marker (arrow) at the start or end of an edge.
@immutable
class EdgeMarker {
  /// Creates an edge marker.
  const EdgeMarker({
    this.type = EdgeMarkerType.arrowClosed,
    this.color,
    this.width,
    this.height,
    this.markerUnits,
    this.orient,
    this.strokeWidth,
  });

  /// Creates a default arrow marker.
  const EdgeMarker.arrow({
    this.color,
    this.width = 12.5,
    this.height = 12.5,
    this.strokeWidth = 1,
  })  : type = EdgeMarkerType.arrow,
        markerUnits = null,
        orient = null;

  /// Creates a closed/filled arrow marker.
  const EdgeMarker.arrowClosed({
    this.color,
    this.width = 12.5,
    this.height = 12.5,
  })  : type = EdgeMarkerType.arrowClosed,
        markerUnits = null,
        orient = null,
        strokeWidth = null;

  /// The type of marker.
  final EdgeMarkerType type;

  /// The color of the marker.
  final Color? color;

  /// The width of the marker.
  final double? width;

  /// The height of the marker.
  final double? height;

  /// SVG markerUnits attribute.
  final String? markerUnits;

  /// The orientation of the marker (in degrees).
  final double? orient;

  /// The stroke width for arrow type markers.
  final double? strokeWidth;

  /// Creates a copy with updated fields.
  EdgeMarker copyWith({
    EdgeMarkerType? type,
    Color? color,
    double? width,
    double? height,
    String? markerUnits,
    double? orient,
    double? strokeWidth,
  }) {
    return EdgeMarker(
      type: type ?? this.type,
      color: color ?? this.color,
      width: width ?? this.width,
      height: height ?? this.height,
      markerUnits: markerUnits ?? this.markerUnits,
      orient: orient ?? this.orient,
      strokeWidth: strokeWidth ?? this.strokeWidth,
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() => {
        'type': type.name,
        if (color != null) 'color': color!.value,
        if (width != null) 'width': width,
        if (height != null) 'height': height,
        if (markerUnits != null) 'markerUnits': markerUnits,
        if (orient != null) 'orient': orient,
        if (strokeWidth != null) 'strokeWidth': strokeWidth,
      };

  /// Creates from JSON.
  factory EdgeMarker.fromJson(Map<String, dynamic> json) {
    // Safely parse enum type with fallback for invalid values
    EdgeMarkerType parseType(String? typeName) {
      if (typeName == null) return EdgeMarkerType.arrowClosed;
      try {
        return EdgeMarkerType.values.byName(typeName);
      } catch (_) {
        return EdgeMarkerType.arrowClosed;
      }
    }

    return EdgeMarker(
      type: parseType(json['type'] as String?),
      color: json['color'] != null ? Color(json['color'] as int) : null,
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      markerUnits: json['markerUnits'] as String?,
      orient: (json['orient'] as num?)?.toDouble(),
      strokeWidth: (json['strokeWidth'] as num?)?.toDouble(),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EdgeMarker &&
        other.type == type &&
        other.color == color &&
        other.width == width &&
        other.height == height &&
        other.markerUnits == markerUnits &&
        other.orient == orient &&
        other.strokeWidth == strokeWidth;
  }

  @override
  int get hashCode => Object.hash(
        type,
        color,
        width,
        height,
        markerUnits,
        orient,
        strokeWidth,
      );

  @override
  String toString() => 'EdgeMarker(type: $type, color: $color)';
}
