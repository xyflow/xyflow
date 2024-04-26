// import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { PanelPosition } from '@xyflow/system';

import { JSX } from 'solid-js';
import type { FitViewOptions } from '../../types';

export type ControlProps = {
  /** Show button for zoom in/out */
  showZoom?: boolean;
  /** Show button for fit view */
  showFitView?: boolean;
  /** Show button for toggling interactivity */
  showInteractive?: boolean;
  /** Options being used when fit view button is clicked */
  fitViewOptions?: FitViewOptions;
  /** Callback when zoom in button is clicked */
  onZoomIn?: () => void;
  /** Callback when zoom out button is clicked */
  onZoomOut?: () => void;
  /** Callback when fit view button is clicked */
  onFitView?: () => void;
  /** Callback when interactivity is toggled */
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  /** Position of the controls on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  children?: JSX.Element;
  /** Style applied to container */
  style?: JSX.CSSProperties;
  /** ClassName applied to container */
  className?: string;
  'aria-label'?: string;
  orientation?: 'horizontal' | 'vertical';
};

export type ControlButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
