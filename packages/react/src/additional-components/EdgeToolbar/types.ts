import type { HTMLAttributes, ReactNode } from 'react';
import type { EdgeToolbarBaseProps } from '@xyflow/system';

/**
 * @inline
 */
export type EdgeToolbarProps = EdgeToolbarBaseProps &
  HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
  };
