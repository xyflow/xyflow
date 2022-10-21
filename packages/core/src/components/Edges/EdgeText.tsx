import { memo, useRef, useState, useEffect } from 'react';
import type { FC, PropsWithChildren } from 'react';
import cc from 'classcat';

import { EdgeTextProps, Rect } from '../../types';

const EdgeText: FC<PropsWithChildren<EdgeTextProps>> = ({
  x,
  y,
  label,
  labelStyle = {},
  labelShowBg = true,
  labelBgStyle = {},
  labelBgPadding = [2, 4],
  labelBgBorderRadius = 2,
  children,
  className,
  ...rest
}) => {
  const edgeRef = useRef<SVGTextElement>(null);
  const [edgeTextBbox, setEdgeTextBbox] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const edgeTextClasses = cc(['react-flow__edge-textwrapper', className]);

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
  }, [label]);

  if (typeof label === 'undefined' || !label) {
    return null;
  }

  return (
    <g
      transform={`translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`}
      className={edgeTextClasses}
      visibility={edgeTextBbox.width ? 'visible' : 'hidden'}
      {...rest}
    >
      {labelShowBg && (
        <rect
          width={edgeTextBbox.width + 2 * labelBgPadding[0]}
          x={-labelBgPadding[0]}
          y={-labelBgPadding[1]}
          height={edgeTextBbox.height + 2 * labelBgPadding[1]}
          className="react-flow__edge-textbg"
          style={labelBgStyle}
          rx={labelBgBorderRadius}
          ry={labelBgBorderRadius}
        />
      )}
      <text className="react-flow__edge-text" y={edgeTextBbox.height / 2} dy="0.3em" ref={edgeRef} style={labelStyle}>
        {label}
      </text>
      {children}
    </g>
  );
};
export default memo(EdgeText);
