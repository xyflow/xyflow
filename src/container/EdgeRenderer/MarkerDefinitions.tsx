import React, { Fragment, ReactNode } from 'react';
import { ArrowHeadType } from '../..';
import { getMarkerId } from '../../components/Edges/utils';
interface MarkerProps {
  id: string;
  children: ReactNode;
}

const Marker = ({ id, children }: MarkerProps) => (
  <marker
    className="react-flow__arrowhead"
    id={id}
    markerWidth="12.5"
    markerHeight="12.5"
    viewBox="-10 -10 20 20"
    orient="auto"
    refX="0"
    refY="0"
  >
    {children}
  </marker>
);

interface MarkerDefinitionsProps {
  defaultColor: string;
  colors: string[];
}

interface ArrowMarkerProps {
  id?: string;
  color: string;
}

const ArrowClosedMarker = ({ id, color }: ArrowMarkerProps) => (
  <Marker id={id || getMarkerId(ArrowHeadType.ArrowClosed, color)}>
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  </Marker>
);

const ArrowMarker = ({ id, color }: ArrowMarkerProps) => (
  <Marker id={id || getMarkerId(ArrowHeadType.Arrow, color)}>
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  </Marker>
);

const MarkerDefinitions = ({ defaultColor, colors }: MarkerDefinitionsProps) => {
  return (
    <defs>
      <ArrowMarker id={getMarkerId(ArrowHeadType.Arrow)} color={defaultColor} />
      <ArrowClosedMarker id={getMarkerId(ArrowHeadType.ArrowClosed)} color={defaultColor} />
      {colors.map((color) => (
        <Fragment key={color}>
          <ArrowMarker color={color} />
          <ArrowClosedMarker color={color} />
        </Fragment>
      ))}
    </defs>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default MarkerDefinitions;
