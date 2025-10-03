import type { Position } from '@xyflow/system';

// Edge component props interfaces

export interface EdgeLabelOptions {
  /**
   * The label or custom element to render along the edge. This is commonly a text label.
   */
  label?: string;
  /**
   * Custom styles to apply to the label.
   */
  labelStyle?: { [key: string]: any };
  labelShowBg?: boolean;
  labelBgStyle?: { [key: string]: any };
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

export interface EdgePosition {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export interface BaseEdgeProps extends EdgeLabelOptions {
  /** The SVG path string for the edge */
  path: string;
  /**
   * The width of the invisible area around the edge that the user can interact with.
   * This is useful for making the edge easier to click or hover over.
   * @default 20
   */
  interactionWidth?: number;
  /** The x position of edge label */
  labelX?: number;
  /** The y position of edge label */
  labelY?: number;
  /** SVG path element attributes */
  id?: string;
  className?: string;
  style?: { [key: string]: any };
  markerStart?: string;
  markerEnd?: string;
}

export interface EdgeComponentProps extends EdgePosition, EdgeLabelOptions {
  id?: string;
  markerStart?: string;
  markerEnd?: string;
  interactionWidth?: number;
  style?: { [key: string]: any };
}

export interface BezierEdgeProps extends EdgeComponentProps {
  pathOptions?: {
    curvature?: number;
  };
}

export interface SmoothStepEdgeProps extends EdgeComponentProps {
  pathOptions?: {
    offset?: number;
    borderRadius?: number;
    stepPosition?: number;
  };
}

export interface StepEdgeProps extends EdgeComponentProps {
  pathOptions?: {
    offset?: number;
  };
}

export interface StraightEdgeProps extends Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'> {}

export interface SimpleBezierEdgeProps extends EdgeComponentProps {
  // Simple bezier edges don't have additional path options
}

export interface EdgeTextProps extends EdgeLabelOptions {
  /** The x position where the label should be rendered. */
  x: number;
  /** The y position where the label should be rendered. */
  y: number;
  className?: string;
  style?: { [key: string]: any };
}
