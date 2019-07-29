import ReactGraph from './ReactGraph';
import _SourceHandle from './NodeRenderer/HandleTypes/SourceHandle';
import _TargetHandle from './NodeRenderer/HandleTypes/TargetHandle';

import {
  isNode as _isNode ,
  isEdge as _isEdge,
  removeElements as _removeElements,
  getOutgoers as _getOutgoers
} from './graph-utils';

export const isNode = _isNode;
export const isEdge = _isEdge;
export const removeElements = _removeElements;
export const getOutgoers = _getOutgoers;

export const SourceHandle = _SourceHandle;
export const TargetHandle = _TargetHandle;

export default ReactGraph;