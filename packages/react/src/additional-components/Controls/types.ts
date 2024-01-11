import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { PanelPosition } from '@xyflow/system';

import type { FitViewOptions } from '../../types';

export type ControlProps = {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  position?: PanelPosition;
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  'aria-label'?: string;
};

export type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
