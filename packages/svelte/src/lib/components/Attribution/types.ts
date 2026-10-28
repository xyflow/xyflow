import type { OptionalOrUndefined, PanelPosition } from '@xyflow/system';

import type { ProOptions } from '$lib/types/general.js';

export type AttributionProps = OptionalOrUndefined<{
  proOptions?: ProOptions;
  position?: PanelPosition;
}>;
