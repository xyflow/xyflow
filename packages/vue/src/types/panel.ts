import type { PanelPosition } from '@xyflow/system';

export interface PanelProps {
  /**
   * The position of the panel.
   * @default "top-left"
   */
  position?: PanelPosition;
  /** accessible label for the panel container, applied as `aria-label` (used by `<Controls>`) */
  label?: string | null;
}
