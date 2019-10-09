import ReactFlow from './container/ReactFlow';

export default ReactFlow;

export { default as Handle } from './components/Handle';
export { MiniMap, Controls } from './plugins';

export {
  isNode,
  isEdge,
  removeElements,
  addEdge,
  getOutgoers
} from './utils/graph';
