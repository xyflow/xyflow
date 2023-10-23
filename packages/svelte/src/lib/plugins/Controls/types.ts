import type { PanelPosition } from '@xyflow/system';

export type ControlsProps = {
  position?: PanelPosition;
  showZoom?: boolean;
  showFitView?: boolean;
  showLock?: boolean;
  buttonBgColor?: string;
  buttonBgColorHover?: string;
  buttonColor?: string;
  buttonColorHover?: string;
};
