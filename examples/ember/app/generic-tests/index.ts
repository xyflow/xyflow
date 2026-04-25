import backgroundGeneral from './background/general';
import controlsGeneral from './controls/general';
import edgeToolbarGeneral from './edge-toolbar/general';
import edgesDefaultOptions from './edges/default-options';
import edgesGeneral from './edges/general';
import eventsFocusableOptions from './events/focusable-options';
import eventsGeneral from './events/general';
import handlesGeneral from './handles/general';
import minimapGeneral from './minimap/general';
import nodeResizerGroup from './node-resizer/group';
import nodeResizerGeneral from './node-resizer/general';
import nodeResizerSnap from './node-resizer/snap';
import nodeToolbarGeneral from './node-toolbar/general';
import nodesConnectionAutopan from './nodes/connection-autopan';
import nodesConnectionLine from './nodes/connection-line';
import nodesCustomConnectionLine from './nodes/custom-connection-line';
import nodesGeneral from './nodes/general';
import nodesOnlyRenderVisible from './nodes/only-render-visible';
import paneGeneral from './pane/general';
import paneNonDefaults from './pane/non-defaults';
import paneSelectionOptions from './pane/selection-options';
import placementGeneral from './placement/general';
import type { FlowConfig } from './types';

export const genericTestConfigs: Record<string, FlowConfig> = {
  'background/general': backgroundGeneral,
  'controls/general': controlsGeneral,
  'edge-toolbar/general': edgeToolbarGeneral,
  'edges/default-options': edgesDefaultOptions,
  'edges/general': edgesGeneral,
  'events/focusable-options': eventsFocusableOptions,
  'events/general': eventsGeneral,
  'handles/general': handlesGeneral,
  'minimap/general': minimapGeneral,
  'node-resizer/group': nodeResizerGroup,
  'node-resizer/general': nodeResizerGeneral,
  'node-resizer/snap': nodeResizerSnap,
  'node-toolbar/general': nodeToolbarGeneral,
  'nodes/connection-autopan': nodesConnectionAutopan,
  'nodes/connection-line': nodesConnectionLine,
  'nodes/custom-connection-line': nodesCustomConnectionLine,
  'nodes/general': nodesGeneral,
  'nodes/only-render-visible': nodesOnlyRenderVisible,
  'pane/general': paneGeneral,
  'pane/non': paneNonDefaults,
  'pane/non-defaults': paneNonDefaults,
  'pane/selection-options': paneSelectionOptions,
  'placement/general': placementGeneral,
};
