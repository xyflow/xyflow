import type { PanelPosition } from '@xyflow/system';

export type ControlsProps = {
  /** position of the controls on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** show button for zoom in/out */
  showZoom?: boolean;
  /** show button for fit view */
  showFitView?: boolean;
  /** show button for toggling interactivity */
  showLock?: boolean;
  buttonBgColor?: string;
  buttonBgColorHover?: string;
  buttonColor?: string;
  buttonColorHover?: string;
  'aria-label'?: string;
};
