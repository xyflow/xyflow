import { memo, useMemo } from 'react';
import { type MarkerProps, createMarkerIds } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import { useMarkerSymbol } from './MarkerSymbols';

type MarkerDefinitionsProps = {
  defaultColor: string | null;
  rfId?: string;
};

const Marker = ({
  id,
  type,
  color,
  width = 12.5,
  height = 12.5,
  markerUnits = 'strokeWidth',
  strokeWidth,
  orient = 'auto-start-reverse',
}: MarkerProps) => {
  const Symbol = useMarkerSymbol(type);

  if (!Symbol) {
    return null;
  }

  return (
    <marker
      className="react-flow__arrowhead"
      id={id}
      markerWidth={`${width}`}
      markerHeight={`${height}`}
      viewBox="-10 -10 20 20"
      markerUnits={markerUnits}
      orient={orient}
      refX="0"
      refY="0"
    >
      <Symbol color={color} strokeWidth={strokeWidth} />
    </marker>
  );
};

/*
 * when you have multiple flows on a page and you hide the first one, the other ones have no markers anymore
 * when they do have markers with the same ids. To prevent this the user can pass a unique id to the react flow wrapper
 * that we can then use for creating our unique marker ids
 */
const MarkerDefinitions = ({ defaultColor, rfId }: MarkerDefinitionsProps) => {
  const edges = useStore((s) => s.edges);
  const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);

  const markers = useMemo(() => {
    const markers = createMarkerIds(edges, {
      id: rfId,
      defaultColor,
      defaultMarkerStart: defaultEdgeOptions?.markerStart,
      defaultMarkerEnd: defaultEdgeOptions?.markerEnd,
    });

    return markers;
  }, [edges, defaultEdgeOptions, rfId, defaultColor]);

  if (!markers.length) {
    return null;
  }

  return (
    <svg className="react-flow__marker" aria-hidden="true">
      <defs>
        {markers.map((marker: MarkerProps) => (
          <Marker
            id={marker.id}
            key={marker.id}
            type={marker.type}
            color={marker.color}
            width={marker.width}
            height={marker.height}
            markerUnits={marker.markerUnits}
            strokeWidth={marker.strokeWidth}
            orient={marker.orient}
          />
        ))}
      </defs>
    </svg>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default memo(MarkerDefinitions);
