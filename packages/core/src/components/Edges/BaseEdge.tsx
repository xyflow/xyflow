import EdgeText from './EdgeText';
import { BaseEdgeProps } from '../../types';

const BaseEdge = ({
  path,
  centerX,
  centerY,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  style,
  markerEnd,
  markerStart,
  interactionWidth = 20,
}: BaseEdgeProps) => {
  return (
    <>
      <path
        style={style}
        d={path}
        fill="none"
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {interactionWidth && <path d={path} fill="none" strokeOpacity={0} strokeWidth={interactionWidth} />}
      {label ? (
        <EdgeText
          x={centerX}
          y={centerY}
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
};

BaseEdge.displayName = 'BaseEdge';

export default BaseEdge;
