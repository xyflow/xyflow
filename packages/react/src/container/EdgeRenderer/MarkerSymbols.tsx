import { useMemo } from 'react';
import { MarkerType, type EdgeMarker, XYError, XYErrorCode } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { reportError } from '../../errors';

type SymbolProps = Omit<EdgeMarker, 'type'>;

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  const style = {
    strokeWidth,
    ...(color && { stroke: color }),
  };

  return (
    <polyline
      className="arrow"
      style={style}
      strokeLinecap="round"
      fill="none"
      strokeLinejoin="round"
      points="-5,-4 0,0 -5,4"
    />
  );
};

const ArrowClosedSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  const style = {
    strokeWidth,
    ...(color && { stroke: color, fill: color }),
  };

  return (
    <polyline
      className="arrowclosed"
      style={style}
      strokeLinecap="round"
      strokeLinejoin="round"
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

export const MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol,
};

export function useMarkerSymbol(type: MarkerType | `${MarkerType}`) {
  const store = useStoreApi();

  const symbol = useMemo(() => {
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);

    if (!symbolExists) {
      const error = new XYError(XYErrorCode.MARKER_TYPE_NOT_FOUND, type);
      reportError(store.getState().onError, error);

      return null;
    }

    return MarkerSymbols[type];
  }, [type]);

  return symbol;
}
