import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { PanelPosition } from '@xyflow/system';

import type { FitViewOptions } from '../../types';

export type ControlProps = {
  /** show button for zoom in/out */
  showZoom?: boolean;
  /** show button for fit view */
  showFitView?: boolean;
  /** show button for toggling interactivity */
  showInteractive?: boolean;
  /** options being used when fit view button is clicked */
  fitViewOptions?: FitViewOptions;
  /** callback when zoom in button is clicked */
  onZoomIn?: () => void;
  /** callback when zoom out button is clicked */
  onZoomOut?: () => void;
  /** callback when fit view button is clicked */
  onFitView?: () => void;
  /** callback when interactivity is toggled */
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  /** position of the controls on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  children?: ReactNode;
  /** style applied to container */
  style?: React.CSSProperties;
  /**className applied to container */
  className?: string;
  'aria-label'?: string;
};

export type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
