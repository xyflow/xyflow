import ReactGraph from './ReactGraph';

export default ReactGraph;

export { default as SourceHandle } from './NodeRenderer/HandleTypes/SourceHandle';
export { default as TargetHandle } from './NodeRenderer/HandleTypes/TargetHandle';

export {
  isNode,
  isEdge,
  removeElements,
  getOutgoers
} from './graph-utils';
