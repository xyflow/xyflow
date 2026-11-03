import { ConnectionLineComponentProps } from '@xyflow/react';

function ConnectionLine({ fromX, fromY, toX, toY, pointer }: ConnectionLineComponentProps) {
  console.log('pointer', pointer);
  return (
    <>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </>
  );
}

export default ConnectionLine;
