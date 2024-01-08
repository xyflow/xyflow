import { isNumeric } from '@xyflow/system';
import cc from 'classcat';

import { EdgeText } from './EdgeText';
import type { BaseEdgeProps } from '../../types';

export function BaseEdge({
  id,
  path,
  labelX,
  labelY,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  style,
  markerEnd,
  markerStart,
  className,
  interactionWidth = 20,
}: BaseEdgeProps) {
  return (
    <>
      <path
        id={id}
        style={style}
        d={path}
        fill="none"
        className={cc(['react-flow__edge-path', className])}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {interactionWidth && (
        <path
          d={path}
          fill="none"
          strokeOpacity={0}
          strokeWidth={interactionWidth}
          className="react-flow__edge-interaction"
        />
      )}
      {label && isNumeric(labelX) && isNumeric(labelY) ? (
        <EdgeText
          x={labelX}
          y={labelY}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
        />
      ) : null}
    </>
  );
}
