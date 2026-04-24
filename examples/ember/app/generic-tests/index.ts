import backgroundGeneral from './background/general';
import controlsGeneral from './controls/general';
import edgesGeneral from './edges/general';
import nodeToolbarGeneral from './node-toolbar/general';
import nodesGeneral from './nodes/general';
import paneGeneral from './pane/general';
import paneNonDefaults from './pane/non-defaults';
import type { FlowConfig } from './types';

export const genericTestConfigs: Record<string, FlowConfig> = {
  'background/general': backgroundGeneral,
  'controls/general': controlsGeneral,
  'edges/general': edgesGeneral,
  'node-toolbar/general': nodeToolbarGeneral,
  'nodes/general': nodesGeneral,
  'pane/general': paneGeneral,
  'pane/non': paneNonDefaults,
  'pane/non-defaults': paneNonDefaults,
};
