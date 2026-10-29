import type { PanelPosition } from '@xyflow/system';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  'data-testid'?: string;
  'data-message'?: string;
  /** Set position of the panel
   * @example 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   */
  position?: PanelPosition;
  style?: string;
  class?: ClassValue;
};
