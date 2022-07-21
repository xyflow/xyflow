import { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { FitViewOptions } from '@react-flow/core';

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

export interface ControlButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}
