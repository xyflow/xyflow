import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { PanelPosition } from '@xyflow/system';

import type { FitViewOptions } from '../../types';

export type ControlProps = HTMLAttributes<HTMLDivElement> & {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
  position?: PanelPosition;
};

export type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
