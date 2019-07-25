import ReactGraph from './ReactGraph';
import {
  isNode as _isNode ,
  isEdge as _isEdge,
  removeElements as _removeElements
} from './graph-utils';

export const isNode = _isNode;
export const isEdge = _isEdge;
export const removeElements = _removeElements;

export default ReactGraph;