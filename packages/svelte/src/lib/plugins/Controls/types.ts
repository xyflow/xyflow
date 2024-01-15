import type { HTMLButtonAttributes } from 'svelte/elements';
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
  'aria-label'?: string;
};

export type ControlButtonProps = HTMLButtonAttributes & {
  class?: string;
  bgColor?: string;
  bgColorHover?: string;
  color?: string;
  colorHover?: string;
  borderColor?: string;
};
