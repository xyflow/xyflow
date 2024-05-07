export function isFlowInitialized(
  numInitialNodes: number,
  numInitialEdges: number,
  nodesInitialized: boolean,
  edgesInitialized: boolean,
  viewportInitialized: boolean
): boolean {
  if (numInitialNodes === 0) {
    return viewportInitialized;
  } else if (numInitialEdges === 0) {
    return viewportInitialized && nodesInitialized;
  } else {
    return viewportInitialized && nodesInitialized && edgesInitialized;
  }
}
