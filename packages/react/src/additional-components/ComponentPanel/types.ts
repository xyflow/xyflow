import type { CSSProperties, DragEvent } from 'react';
import type { PanelPosition } from '../../types';

export type ComponentDefinition = {
  type: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  category?: string;
};

export type ComponentPanelProps = {
  components?: ComponentDefinition[];
  style?: CSSProperties;
  className?: string;
  position?: PanelPosition;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onComponentDragStart?: (event: DragEvent, component: ComponentDefinition) => void;
};
