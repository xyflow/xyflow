import type { FitViewOptionsBase, PanelPosition } from '@xyflow/system';
import type { Node } from '../../types';

export interface ControlProps {
  /**
   * Show the zoom control buttons (zoom-in and zoom-out)
   *
   * @default true
   */
  showZoom?: boolean;
  /**
   * Show the fit view control button
   *
   * @default true
   */
  showFitView?: boolean;
  /**
   * Show the interactivity toggle control button
   *
   * @default true
   */
  showInteractive?: boolean;
  /**
   * {@link FitViewOptionsBase Parameters} to use when the fit view control button is pressed
   *
   * @default undefined
   */
  fitViewParams?: FitViewOptionsBase<Node>;
  /**
   * The {@link PanelPosition position} of the `<Controls>` panel
   *
   * @default 'bottom-left'
   */
  position?: PanelPosition;
  /**
   * Accessible label for the controls panel; falls back to `ariaLabelConfig['controls.ariaLabel']`.
   *
   * @default 'Control Panel'
   */
  ariaLabel?: string | null;
}

export interface ControlEmits {
  zoomIn: [];
  zoomOut: [];
  fitView: [];
  interactionChange: [isInteractive: boolean];
}
