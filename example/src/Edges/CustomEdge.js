import React from 'react';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style = {}, data }) {
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
      />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data.text}
        </textPath>
      </text>
    </>
  );
}
