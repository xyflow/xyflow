/// A highly customizable Flutter library for building node-based editors,
/// interactive diagrams, and workflow visualizations.
///
/// This is a complete Dart/Flutter port of the xyflow library.
library xyflow_flutter;

// Core types
export 'src/core/types/position.dart';
export 'src/core/types/viewport.dart';
export 'src/core/types/rect.dart';
export 'src/core/types/node.dart';
export 'src/core/types/edge.dart';
export 'src/core/types/handle.dart';
export 'src/core/types/connection.dart';
export 'src/core/types/changes.dart';
export 'src/core/types/marker.dart';

// Core utilities
export 'src/core/utils/edges/bezier.dart';
export 'src/core/utils/edges/smooth_step.dart';
export 'src/core/utils/edges/step.dart';
export 'src/core/utils/edges/straight.dart';
export 'src/core/utils/edges/simple_bezier.dart';
export 'src/core/utils/edges/edge_path.dart';

// State management
export 'src/state/xyflow_state.dart';
export 'src/state/xyflow_controller.dart';
export 'src/state/xyflow_provider.dart';

// Widgets
export 'src/widgets/xyflow.dart';
export 'src/widgets/handle.dart';
export 'src/widgets/background.dart';
export 'src/widgets/controls.dart';
export 'src/widgets/minimap.dart';
export 'src/widgets/panel.dart';
export 'src/widgets/node_toolbar.dart';
export 'src/widgets/node_resizer.dart';
export 'src/widgets/connection_line.dart';
export 'src/widgets/selection_rect.dart';

// Node widgets
export 'src/widgets/nodes/default_node.dart';
export 'src/widgets/nodes/input_node.dart';
export 'src/widgets/nodes/output_node.dart';
export 'src/widgets/nodes/group_node.dart';

// Edge widgets
export 'src/widgets/edges/base_edge.dart';
export 'src/widgets/edges/bezier_edge.dart';
export 'src/widgets/edges/smooth_step_edge.dart';
export 'src/widgets/edges/step_edge.dart';
export 'src/widgets/edges/straight_edge.dart';
