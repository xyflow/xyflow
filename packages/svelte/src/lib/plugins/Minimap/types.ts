import type { PanelPosition } from '@xyflow/system';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';
import type { Component } from 'svelte';
import type { Node } from '$lib/types';

export type GetMiniMapNodeAttribute = (node: Node) => string;

/**
 * The props that are passed to the MiniMapNode component
 *
 * @public
 */
export type MiniMapNodeProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  class?: ClassValue;
  color?: string;
  shapeRendering?: string;
  strokeColor?: string;
  strokeWidth?: number;
  selected?: boolean;
};

export type MiniMapProps = {
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
  /** A custom component to render the nodes in the minimap. This component must render an SVG element! */
  nodeComponent?: Component<MiniMapNodeProps>;
  /** Color of the mask representing viewport */
  maskColor?: string;
  /** Stroke color of the mask representing viewport */
  maskStrokeColor?: string;
  /** Stroke width of the mask representing viewport */
  maskStrokeWidth?: number;
  /** Position of the minimap on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** Class applied to container */
  class?: ClassValue;
  /** Style applied to container */
  style?: string;
  /** The aria-label applied to container */
  ariaLabel?: string | null;
  /** Width of minimap */
  width?: number;
  /** Height of minimap */
  height?: number;
  // onClick?: (event: MouseEvent, position: XYPosition) => void;
  // onNodeClick?: (event: MouseEvent, node: Node) => void;
  pannable?: boolean;
  zoomable?: boolean;
  /** Invert the direction when panning the minimap viewport */
  inversePan?: boolean;
  /** Step size for zooming in/out */
  zoomStep?: number;
} & HTMLAttributes<HTMLDivElement>;
