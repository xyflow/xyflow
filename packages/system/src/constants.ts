import { CoordinateExtent, HandleType } from './types';

// @todo: update URLs to xyflow
export const errorMessages = {
  error001: () =>
    '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001',
  error002: () =>
    "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (nodeType: string) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => 'The React Flow parent container needs a width and a height to render the graph.',
  error005: () => 'Only child nodes can use a parent extent.',
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id: string) => `The old edge with id=${id} does not exist.`,
  error009: (type: string) => `Marker type "${type}" doesn't exist.`,
  error008: (
    handleType: HandleType,
    { id, sourceHandle, targetHandle }: { id: string; sourceHandle: string | null; targetHandle: string | null }
  ) =>
    `Couldn't create edge for ${handleType} handle id: "${
      !sourceHandle ? sourceHandle : targetHandle
    }", edge id: ${id}.`,
  error010: () => 'Handle: No node id found. Make sure to only use a Handle inside a custom Node.',
  error011: (edgeType: string) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id: string) =>
    `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
};

export const internalsSymbol = Symbol.for('internals');

export const infiniteExtent: CoordinateExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

export const elementSelectionKeys = ['Enter', ' ', 'Escape'];
