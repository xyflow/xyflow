import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { PanelPosition } from '@xyflow/system';

import type { FitViewOptions } from '$lib/types';

export type ControlsProps = {
  /** Position of the controls on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** Show button for zoom in/out */
  showZoom?: boolean;
  /** Show button for fit view */
  showFitView?: boolean;
  /** Show button for toggling interactivity */
  showLock?: boolean;
  buttonBgColor?: string;
  buttonBgColorHover?: string;
  buttonColor?: string;
  buttonColorHover?: string;
  buttonBorderColor?: string;
  'aria-label'?: string;
  style?: string;
  class?: ClassValue;
  orientation?: 'horizontal' | 'vertical';
  children?: Snippet;
  before?: Snippet;
  after?: Snippet;
  fitViewOptions?: FitViewOptions;
} & HTMLAttributes<HTMLDivElement>;

export type ControlButtonProps = HTMLButtonAttributes & {
  class?: ClassValue;
  bgColor?: string;
  bgColorHover?: string;
  color?: string;
  colorHover?: string;
  borderColor?: string;
  children?: Snippet;
};
