import { PanelPosition } from '@xyflow/system';
import type { Node } from '../../types/general';

export type GetMiniMapNodeAttribute = (node: Node) => string;

/**
 * Props for the MiniMapNode component
 */
export interface MiniMapNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  className?: string;
  color?: string;
  shapeRendering?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selected?: boolean;
}

/**
 * Configuration options for the MiniMap component.
 * Provides overview navigation and viewport visualization.
 */
export interface MiniMapProps {
  /** Background color of minimap */
  bgColor?: string;
  
  /** Color of nodes on the minimap */
  nodeColor?: string | GetMiniMapNodeAttribute;
  
  /** Stroke color of nodes on the minimap */
  nodeStrokeColor?: string | GetMiniMapNodeAttribute;
  
  /** Class applied to nodes on the minimap */
  nodeClass?: string | GetMiniMapNodeAttribute;
  
  /** Border radius of nodes on the minimap */
  nodeBorderRadius?: number;
  
  /** Stroke width of nodes on the minimap */
  nodeStrokeWidth?: number;
  
  /** Color of the mask representing viewport */
  maskColor?: string;
  
  /** Stroke color of the mask representing viewport */
  maskStrokeColor?: string;
  
  /** Stroke width of the mask representing viewport */
  maskStrokeWidth?: number;
  
  /**
   * Position of the minimap on the pane
   * @default PanelPosition.BottomRight
   */
  position?: PanelPosition;
  
  /** CSS class applied to container */
  className?: string;
  
  /** CSS styles for the container */
  style?: { [key: string]: string | number };
  
  /** Accessible label for the minimap */
  ariaLabel?: string | null;
  
  /** Width of minimap */
  width?: number;
  
  /** Height of minimap */
  height?: number;
  
  /**
   * Determines whether you can pan the viewport by dragging inside the minimap.
   * @default false
   */
  pannable?: boolean;
  
  /**
   * Determines whether you can zoom the viewport by scrolling inside the minimap.
   * @default false
   */
  zoomable?: boolean;
  
  /** Invert the direction when panning the minimap viewport */
  inversePan?: boolean;
  
  /** Step size for zooming in/out */
  zoomStep?: number;
  
  /** Offset the viewport on the minimap, acts like padding */
  offsetScale?: number;
}