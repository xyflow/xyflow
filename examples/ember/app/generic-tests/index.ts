import backgroundGeneral from './background/general';
import controlsGeneral from './controls/general';
import edgeToolbarGeneral from './edge-toolbar/general';
import edgesGeneral from './edges/general';
import eventsGeneral from './events/general';
import handlesGeneral from './handles/general';
import minimapGeneral from './minimap/general';
import nodeResizerGeneral from './node-resizer/general';
import nodeToolbarGeneral from './node-toolbar/general';
import nodesGeneral from './nodes/general';
import paneGeneral from './pane/general';
import paneNonDefaults from './pane/non-defaults';
import placementGeneral from './placement/general';
import type { FlowConfig } from './types';

export const genericTestConfigs: Record<string, FlowConfig> = {
  'background/general': backgroundGeneral,
  'controls/general': controlsGeneral,
  'edge-toolbar/general': edgeToolbarGeneral,
  'edges/general': edgesGeneral,
  'events/general': eventsGeneral,
  'handles/general': handlesGeneral,
  'minimap/general': minimapGeneral,
  'node-resizer/general': nodeResizerGeneral,
  'node-toolbar/general': nodeToolbarGeneral,
  'nodes/general': nodesGeneral,
  'pane/general': paneGeneral,
  'pane/non': paneNonDefaults,
  'pane/non-defaults': paneNonDefaults,
  'placement/general': placementGeneral,
};
