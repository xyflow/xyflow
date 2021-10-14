import { Position, ArrowHeadType, Node } from 'react-flow-renderer';

function getNodeIntersection(source: Node, target: Node) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const { width: sourceWidth, height: sourceHeight, position: sourcePosition } = source.__rf;
  const targetPosition = target.__rf.position;

  const w = sourceWidth / 2;
  const h = sourceHeight / 2;

  const x2 = sourcePosition.x + w;
  const y2 = sourcePosition.y + h;
  const x1 = targetPosition.x;
  const y1 = targetPosition.y;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return [x, y];
}

function getEdgePosition(node: Node, x: number, y: number) {
  const n = { ...node.__rf.position, ...node.__rf };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(x);
  const py = Math.round(y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

export function getArrow(source: any, target: any) {
  const [sx, sy] = getNodeIntersection(source, target);
  const [tx, ty] = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sx, sy);
  const targetPos = getEdgePosition(target, tx, ty);

  return {
    sx,
    sy,
    tx,
    ty,
    label: null,
    sourcePos,
    targetPos,
  };
}

export function createElements() {
  const elements = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  elements.push({ id: 'source', data: { label: 'Source', isTarget: false }, position: center });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    elements.push({ id: `${i}`, data: { label: 'Target', isTarget: true }, position: { x, y } });

    if (i % 2 === 0) {
      elements.push({
        id: `source-${i}`,
        source: 'source',
        target: `${i}`,
        type: 'floating',
        arrowHeadType: ArrowHeadType.Arrow,
      });
    }
  }

  return elements;
}
