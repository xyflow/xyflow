import {
  UPDATE_TRANSFORM, UPDATE_SIZE, INIT_D3,
  FIT_VIEW, ZOOM_IN, ZOOM_OUT
} from './index';

export const updateTransform = transform => ({
  type: UPDATE_TRANSFORM,
  payload: { transform: [transform.x, transform.y, transform.k] }
});

export const updateSize = size => ({
  type: UPDATE_SIZE,
  payload: size
});

export const initD3 = ({ zoom, selection }) => ({
  type: INIT_D3,
  payload: { d3Zoom: zoom, d3Selection: selection, d3Initialised: true }
});

export const fitView = ({ padding = 0 } = {}) => ({
  type: FIT_VIEW,
  payload: { padding }
});

export const zoomIn = () => ({
  type: ZOOM_IN
});

export const zoomOut = () => ({
  type: ZOOM_OUT
});
