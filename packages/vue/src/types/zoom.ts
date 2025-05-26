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
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  zoomTo: ZoomTo;
  setViewport: SetViewport;
  getViewport: GetViewport;
  fitView: FitView<NodeType>;
  setCenter: SetCenter;
  fitBounds: FitBounds;
}
