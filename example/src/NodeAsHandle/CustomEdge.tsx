import { FC, useMemo } from 'react';
import cc from 'classcat';
import {
  EdgeProps,
  getMarkerEnd,
  useStoreState,
  Position,
  getBezierPath,
  ConnectionLineComponentProps,
} from 'react-flow-renderer';

function getNodeIntersection(source: any, target: any) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const w = source.__rf.width / 2;
  const h = source.__rf.height / 2;

  const x2 = source.__rf.position.x + w;
  const y2 = source.__rf.position.y + h;
  const x1 = target.__rf.position.x;
  const y1 = target.__rf.position.y;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return [x, y];
}

function getEdgePosition(node: any, x: number, y: number) {
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

function getArrow(source: any, target: any) {
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

const CustomEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  arrowHeadType,
  markerEndId,
  style,
}) => {
  const nodes = useStoreState((state) => state.nodes);
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const sourceNode = useMemo(() => nodes.find((n) => n.id === source), [source, nodes]);
  const targetNode = useMemo(() => nodes.find((n) => n.id === target), [target, nodes]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, label, sourcePos, targetPos } = getArrow(sourceNode, targetNode);

  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <g className="react-flow__connection">
        <path
          id={id}
          className={cc(['react-flow__edge-path'])}
          d={d}
          markerEnd={markerEnd}
          // opacity={style?.opacity}
          style={style}
        />
      </g>
      {label && (
        <text>
          <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      )}
    </>
  );
};

export const ConnectionLine: FC<ConnectionLineComponentProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceNode,
}) => {
  if (!sourceNode) {
    return null;
  }

  const targetNode = { __rf: { width: 100, height: 100, position: { x: targetX, y: targetY - 50 } } };
  const { sx, sy, tx, ty, label, sourcePos, targetPos } = getArrow(sourceNode, targetNode);
  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g>
      <path fill="none" stroke="#222" strokeWidth={1.5} className="animated" d={d} />
      <circle cx={targetX} cy={targetY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
};

export default CustomEdge;
