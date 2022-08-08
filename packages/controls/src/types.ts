import { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { FitViewOptions, PanelPosition } from '@react-flow/core';

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  position?: PanelPosition;
}

export type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
