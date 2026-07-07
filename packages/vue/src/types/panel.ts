import type { PanelPosition } from '@xyflow/system';

export interface PanelProps {
  /** the position of the panel; defaults to `top-left` (mirrors xyflow/react) */
  position?: PanelPosition;
  /** accessible label for the panel container, applied as `aria-label` (used by `<Controls>`) */
  label?: string | null;
}
