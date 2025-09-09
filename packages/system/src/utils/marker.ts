import type { EdgeBase, EdgeMarker, EdgeMarkerType, MarkerProps } from '../types';

export function getMarkerId(marker: EdgeMarkerType | undefined, id?: string | null, selected?: boolean): string {
  if (!marker) {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  const idPrefix = id ? `${id}__${selected ? 'selected__' : ''}` : '';

  return `${idPrefix}${Object.keys(marker)
    .sort()
    .map((key) => `${key}=${marker[key as keyof EdgeMarker]}`)
    .join('&')}`;
}

export function createMarkerIds(
  edges: EdgeBase[],
  {
    id,
    defaultColor,
    defaultMarkerStart,
    defaultMarkerEnd,
  }: {
    id?: string | null;
    defaultColor?: string | null;
    defaultMarkerStart?: EdgeMarkerType;
    defaultMarkerEnd?: EdgeMarkerType;
  }
) {
  const ids = new Set<string>();

  return edges
    .reduce<MarkerProps[]>((markers, edge) => {
      [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
        if (marker && typeof marker === 'object') {
          // Generate both selected and unselected marker ids
          for (const selected of [true, false]) {
            const markerId = getMarkerId(marker, id, selected);

            console.log(selected, markerId);
            if (!ids.has(markerId)) {
              markers.push({ id: markerId, color: marker.color || defaultColor, selected, ...marker });
              ids.add(markerId);
            }
          }
        }
      });

      return markers;
    }, [])
    .sort((a, b) => a.id.localeCompare(b.id));
}
