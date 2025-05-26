import type { PanelPosition } from '@xyflow/system';

export interface PanelProps {
  position: PanelPosition;
  /** accessible label for the panel container, applied as `aria-label` (used by `<Controls>`) */
  label?: string | null;
}
