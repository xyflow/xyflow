import { memo, useState, useEffect, useRef } from 'react';
import cc from 'classcat';
import type { Rect } from '@xyflow/system';

import type { EdgeTextProps } from '../../types';

function EdgeTextComponent({
  x,
  y,
  label,
  labelStyle,
  labelShowBg = true,
  labelBgStyle,
  labelBgPadding = [2, 4],
  labelBgBorderRadius = 2,
  children,
  className,
  ...rest
}: EdgeTextProps) {
  const [edgeTextBbox, setEdgeTextBbox] = useState<Rect>({ x: 1, y: 0, width: 0, height: 0 });
  const edgeTextClasses = cc(['react-flow__edge-textwrapper', className]);
  const edgeTextRef = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    if (edgeTextRef.current) {
      const textBbox = edgeTextRef.current.getBBox();

      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height,
      });
    }
  }, [label]);

  if (!label) {
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
      <text
        className="react-flow__edge-text"
        y={edgeTextBbox.height / 2}
        dy="0.3em"
        ref={edgeTextRef}
        style={labelStyle}
      >
        {label}
      </text>
      {children}
    </g>
  );
}

EdgeTextComponent.displayName = 'EdgeText';

/**
 * You can use the `<EdgeText />` component as a helper component to display text
 * within your custom edges.
 *
 * @public
 *
 * @example
 * ```jsx
 * import { EdgeText } from '@xyflow/react';
 *
 * export function CustomEdgeLabel({ label }) {
 *   return (
 *     <EdgeText
 *       x={100}
 *       y={100}
 *       label={label}
 *       labelStyle={{ fill: 'white' }}
 *       labelShowBg
 *       labelBgStyle={{ fill: 'red' }}
 *       labelBgPadding={[2, 4]}
 *       labelBgBorderRadius={2}
 *     />
 *   );
 * }
 *```
 */
export const EdgeText = memo(EdgeTextComponent);
