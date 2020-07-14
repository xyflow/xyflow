import { ArrowHeadType } from '../../types';

export const getMarkerEnd = (arrowHeadType?: ArrowHeadType, markerEndId?: string): string => {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return `url(#${markerEndId})`;
  }

  return typeof arrowHeadType !== 'undefined' ? `url(#react-flow__${arrowHeadType})` : 'none';
};
