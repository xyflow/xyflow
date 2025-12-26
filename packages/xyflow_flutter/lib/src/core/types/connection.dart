import 'package:flutter/foundation.dart';

import 'handle.dart';
import 'position.dart';

/// Represents a connection between two nodes.
///
/// A connection describes the relationship between nodes through their handles.
/// It can represent either an existing edge or a connection being made.
@immutable
class Connection {
  /// Creates a connection.
  const Connection({
    required this.source,
    required this.target,
    this.sourceHandle,
    this.targetHandle,
  });

  /// The ID of the source node.
  final String source;

  /// The ID of the target node.
  final String target;

  /// The ID of the source handle (optional).
  final String? sourceHandle;

  /// The ID of the target handle (optional).
  final String? targetHandle;

  /// Creates a copy with updated fields.
  Connection copyWith({
    String? source,
    String? target,
    String? sourceHandle,
    String? targetHandle,
  }) {
    return Connection(
      source: source ?? this.source,
      target: target ?? this.target,
      sourceHandle: sourceHandle ?? this.sourceHandle,
      targetHandle: targetHandle ?? this.targetHandle,
    );
  }

  /// Converts to JSON.
  Map<String, dynamic> toJson() => {
        'source': source,
        'target': target,
        if (sourceHandle != null) 'sourceHandle': sourceHandle,
        if (targetHandle != null) 'targetHandle': targetHandle,
      };

  /// Creates from JSON.
  factory Connection.fromJson(Map<String, dynamic> json) {
    return Connection(
      source: json['source'] as String,
      target: json['target'] as String,
      sourceHandle: json['sourceHandle'] as String?,
      targetHandle: json['targetHandle'] as String?,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Connection &&
        other.source == source &&
        other.target == target &&
        other.sourceHandle == sourceHandle &&
        other.targetHandle == targetHandle;
  }

  @override
  int get hashCode =>
      Object.hash(source, target, sourceHandle, targetHandle);

  @override
  String toString() =>
      'Connection(source: $source, target: $target, sourceHandle: $sourceHandle, targetHandle: $targetHandle)';
}

/// The mode for validating connections.
enum ConnectionMode {
  /// Strict mode: source handles can only connect to target handles.
  strict,

  /// Loose mode: any handle can connect to any handle.
  loose,
}

/// The type of connection line to display during connection creation.
enum ConnectionLineType {
  /// Bezier curve.
  bezier,

  /// Smooth step with rounded corners.
  smoothStep,

  /// Step with sharp corners.
  step,

  /// Straight line.
  straight,

  /// Simple bezier curve.
  simpleBezier,
}

/// Represents the current state of a connection being made.
@immutable
class ConnectionState {
  /// Creates a connection state.
  const ConnectionState({
    this.startNodeId,
    this.startHandleId,
    this.startHandleType,
    this.startPosition,
    this.endPosition,
    this.isValid,
  });

  /// Creates an empty (not connecting) state.
  const ConnectionState.empty()
      : startNodeId = null,
        startHandleId = null,
        startHandleType = null,
        startPosition = null,
        endPosition = null,
        isValid = null;

  /// The ID of the node where the connection started.
  final String? startNodeId;

  /// The ID of the handle where the connection started.
  final String? startHandleId;

  /// The type of the starting handle.
  final HandleType? startHandleType;

  /// The position (in canvas coordinates) where the connection started.
  final XYPosition? startPosition;

  /// The current end position of the connection line (in canvas coordinates).
  final XYPosition? endPosition;

  /// Whether the current connection would be valid if released.
  final bool? isValid;

  /// Returns true if a connection is currently being made.
  bool get isConnecting => startNodeId != null;

  /// Returns true if this is not an active connection.
  bool get isEmpty => startNodeId == null;

  /// Creates a copy with updated fields.
  ConnectionState copyWith({
    String? startNodeId,
    String? startHandleId,
    HandleType? startHandleType,
    XYPosition? startPosition,
    XYPosition? endPosition,
    bool? isValid,
  }) {
    return ConnectionState(
      startNodeId: startNodeId ?? this.startNodeId,
      startHandleId: startHandleId ?? this.startHandleId,
      startHandleType: startHandleType ?? this.startHandleType,
      startPosition: startPosition ?? this.startPosition,
      endPosition: endPosition ?? this.endPosition,
      isValid: isValid ?? this.isValid,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ConnectionState &&
        other.startNodeId == startNodeId &&
        other.startHandleId == startHandleId &&
        other.startHandleType == startHandleType &&
        other.startPosition == startPosition &&
        other.endPosition == endPosition &&
        other.isValid == isValid;
  }

  @override
  int get hashCode => Object.hash(
        startNodeId,
        startHandleId,
        startHandleType,
        startPosition,
        endPosition,
        isValid,
      );
}

/// Configuration for on-connect behavior.
@immutable
class OnConnectStartParams {
  /// Creates on-connect start params.
  const OnConnectStartParams({
    required this.nodeId,
    this.handleId,
    required this.handleType,
  });

  /// The node ID where connection started.
  final String nodeId;

  /// The handle ID (optional).
  final String? handleId;

  /// The type of handle.
  final HandleType handleType;
}

/// Configuration for on-connect end behavior.
@immutable
class OnConnectEndParams {
  /// Creates on-connect end params.
  const OnConnectEndParams({
    this.connection,
    this.isValid = false,
  });

  /// The resulting connection (if valid).
  final Connection? connection;

  /// Whether the connection was valid.
  final bool isValid;
}
