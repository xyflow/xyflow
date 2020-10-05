export function getElements(xElements = 10, yElements = 10) {
  const initialElements = [];
  let nodeId = 1;
  let recentNodeId = null;

  for (let y = 0; y < yElements; y++) {
    for (let x = 0; x < xElements; x++) {
      const position = { x: x * 100, y: y * 50 };
      const data = { label: `Node ${nodeId}` };
      const node = {
        id: nodeId.toString(),
        style: { width: 50, fontSize: 11 },
        data,
        position,
      };
      initialElements.push(node);

      if (recentNodeId && nodeId <= (xElements * yElements)) {
        initialElements.push({ id: `${x}-${y}`, source: recentNodeId.toString(), target: nodeId.toString() });
      }

      recentNodeId = nodeId;
      nodeId++;
    }
  }

  return initialElements;
}
