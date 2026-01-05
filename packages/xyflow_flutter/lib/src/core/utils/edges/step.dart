import 'edge_path.dart';
import 'smooth_step.dart';

/// Calculates step paths for edges.
///
/// Step edges are orthogonal paths with sharp corners (no rounding),
/// creating a grid-like appearance.
abstract class StepEdgePath {
  StepEdgePath._();

  /// Default offset from the handle.
  static const double defaultOffset = 20.0;

  /// Calculates a step edge path.
  ///
  /// This is similar to smooth step but with borderRadius = 0.
  static EdgePath getStepPath({
    required double sourceX,
    required double sourceY,
    required double targetX,
    required double targetY,
    required EdgePosition sourcePosition,
    required EdgePosition targetPosition,
    double offset = defaultOffset,
    bool centerStep = true,
  }) {
    // Reuse smooth step logic with zero border radius
    return SmoothStepEdgePath.getSmoothStepPath(
      sourceX: sourceX,
      sourceY: sourceY,
      targetX: targetX,
      targetY: targetY,
      sourcePosition: sourcePosition,
      targetPosition: targetPosition,
      borderRadius: 0,
      offset: offset,
      centerStep: centerStep,
    );
  }
}
