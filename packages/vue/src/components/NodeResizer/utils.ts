import type { ControlPosition } from './types';
import { ResizeControlVariant } from './types';

export const DefaultPositions: Record<ResizeControlVariant, ControlPosition> = {
  [ResizeControlVariant.Line]: 'right',
  [ResizeControlVariant.Handle]: 'bottom-right',
};

export const StylingProperty = {
  [ResizeControlVariant.Line]: 'borderColor',
  [ResizeControlVariant.Handle]: 'backgroundColor',
};
