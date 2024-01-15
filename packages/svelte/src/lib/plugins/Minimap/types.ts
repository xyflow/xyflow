import type { PanelPosition } from '@xyflow/system';

import type { Node } from '$lib/types';

export type GetMiniMapNodeAttribute = (node: Node) => string;

export type MiniMapProps = {
  /** background color of minimap */
  bgColor?: string;
  /** color of nodes on the minimap */
  nodeColor?: string | GetMiniMapNodeAttribute;
  /** stroke color of nodes on the minimap */
  nodeStrokeColor?: string | GetMiniMapNodeAttribute;
  /** class applied to nodes on the minimap */
  nodeClass?: string | GetMiniMapNodeAttribute;
  /** border radius of nodes on the minimap */
  nodeBorderRadius?: number;
  /** stroke width of nodes on the minimap */
  nodeStrokeWidth?: number;
  /** color of the mask representing viewport */
  maskColor?: string;
  /** stroke color of the mask representing viewport */
  maskStrokeColor?: string;
  /** stroke width of the mask representing viewport */
  maskStrokeWidth?: number;
  /** position of the minimap on the pane
   * @example PanelPosition.TopLeft, PanelPosition.TopRight,
   * PanelPosition.BottomLeft, PanelPosition.BottomRight
   */
  position?: PanelPosition;
  /** class applied to container */
  class?: string;
  /** style applied to container */
  style?: string;
  /** aria-label applied to container */
  ariaLabel?: string | null;
  /** width of minimap */
  width?: number;
  /** height of minimap */
  height?: number;
  // onClick?: (event: MouseEvent, position: XYPosition) => void;
  // onNodeClick?: (event: MouseEvent, node: Node) => void;
  pannable?: boolean;
  zoomable?: boolean;
  /** invert the direction when panning the minimap viewport */
  inversePan?: boolean;
  /** step size for zooming in/out */
  zoomStep?: number;
};
