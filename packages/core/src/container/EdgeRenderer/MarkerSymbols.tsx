import { useMemo } from 'react';

import { devWarn } from '../../utils';
import { MarkerType } from '../../types';
import type { EdgeMarker } from '../../types';

type SymbolProps = Omit<EdgeMarker, 'type'>;

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  );
};

const ArrowClosedSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

export const MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol,
};

export function useMarkerSymbol(type: MarkerType) {
  const symbol = useMemo(() => {
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);

    if (!symbolExists) {
      devWarn(`Marker type "${type}" doesn't exist. Help: https://reactflow.dev/error#900`);

      return null;
    }

    return MarkerSymbols[type];
  }, [type]);
  return symbol;
}

export default MarkerSymbols;
