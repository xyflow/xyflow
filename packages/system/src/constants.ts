import { BaseEdge, HandleElement } from './types';

export const errorMessages = {
  '001': () =>
    '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001',
  '002': () =>
    "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  '003': (nodeType: string) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  '004': () => 'The React Flow parent container needs a width and a height to render the graph.',
  '005': () => 'Only child nodes can use a parent extent.',
  '006': () => "Can't create edge. An edge needs a source and a target.",
  '007': (id: string) => `The old edge with id=${id} does not exist.`,
  '009': (type: string) => `Marker type "${type}" doesn't exist.`,
  '008': (sourceHandle: HandleElement | null, edge: BaseEdge) =>
    `Couldn't create edge for ${!sourceHandle ? 'source' : 'target'} handle id: "${
      !sourceHandle ? edge.sourceHandle : edge.targetHandle
    }", edge id: ${edge.id}.`,
  '010': () => 'Handle: No node id found. Make sure to only use a Handle inside a custom Node.',
  '011': (edgeType: string) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
};
