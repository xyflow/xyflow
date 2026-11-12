import type {
  FitViewOptionsBase,
  GetViewport,
  Padding,
  Rect,
  SetCenter,
  SetViewport,
  ViewportHelperFunctionOptions,
  ZoomInOut,
  ZoomTo,
} from '@xyflow/system';
import type { Node } from './node';

/** vue-flow accepts the richer `Padding` here (system's `FitBoundsOptions` is `padding?: number`) */
export type FitBoundsOptions = ViewportHelperFunctionOptions & {
  padding?: Padding;
};

/** Fit the viewport around visible nodes */
export type FitView<NodeType extends Node = Node> = (fitViewOptions?: FitViewOptionsBase<NodeType>) => Promise<boolean>;

/** fit the viewport around bounds */
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => Promise<boolean>;

export interface ViewportFunctions<NodeType extends Node = Node> {
  /** Zooms viewport in by 1.2. */
  zoomIn: ZoomInOut;
  /** Zooms viewport out by 1 / 1.2. */
  zoomOut: ZoomInOut;
  /**
   * Zoom the viewport to a given zoom level. Passing in a `duration` will animate the viewport to the
   * new zoom level.
   */
  zoomTo: ZoomTo;
  /** Sets the current viewport. */
  setViewport: SetViewport;
  /** Returns the current viewport. */
  getViewport: GetViewport;
  /** Fits the view based on the passed params. By default it fits the view to all nodes. */
  fitView: FitView<NodeType>;
  /**
   * Center the viewport on a given position. Passing in a `duration` will animate the viewport to the
   * new position.
   */
  setCenter: SetCenter;
  /**
   * A low-level utility function to fit the viewport to a given rectangle. Passing in a `duration` will
   * animate the viewport from its current position to the new position.
   */
  fitBounds: FitBounds;
}
