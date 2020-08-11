import React, { memo, useRef, useState, useEffect } from 'react';

import { EdgeTextProps, Rect } from '../../types';

const textBgPadding = 2;

export default memo(({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {} }: EdgeTextProps) => {
  const edgeRef = useRef<SVGTextElement>(null);
  const [edgeTextBbox, setEdgeTextBbox] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (edgeRef.current) {
      const textBbox = edgeRef.current.getBBox();

      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height,
      });
    }
  }, []);

  if (typeof label === 'undefined' || !label) {
    return null;
  }

  return (
    <g transform={`translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`}>
      {labelShowBg && (
        <rect
          width={edgeTextBbox.width + 2 * textBgPadding}
          x={-textBgPadding}
          y={-textBgPadding}
          height={edgeTextBbox.height + 2 * textBgPadding}
          className="react-flow__edge-textbg"
          style={labelBgStyle}
        />
      )}
      <text className="react-flow__edge-text" y={edgeTextBbox.height / 2} dy="0.3em" ref={edgeRef} style={labelStyle}>
        {label}
      </text>
    </g>
  );
});
