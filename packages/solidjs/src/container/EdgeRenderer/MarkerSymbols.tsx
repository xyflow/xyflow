// import { useMemo } from 'react';
import { errorMessages, MarkerType, type EdgeMarker } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { mergeProps } from 'solid-js';

type SymbolProps = Omit<EdgeMarker, 'type'>;

const ArrowSymbol = (_p: SymbolProps) => {
  
  // { color = 'none', strokeWidth = 1 }: SymbolProps) => {
    const p = mergeProps({ color: 'none', strokeWidth: 1 }, _p);

  return (
    <polyline
      style={{
        stroke: p.color,
        "stroke-width": p.strokeWidth  ? p.strokeWidth + "px" : undefined,
      }}
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  );
};

const ArrowClosedSymbol = (_p: SymbolProps) => {
  // { color = 'none', strokeWidth = 1 }: SymbolProps) => {
    const p = mergeProps({ color: 'none', strokeWidth: 1 }, _p);

  return (
    <polyline
      style={{
        stroke: p.color,
        fill: p.color,
        "stroke-width": p.strokeWidth ? p.strokeWidth + "px" : undefined,
      }}
      stroke-linecap="round"
      stroke-linejoin="round"
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

export const MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol,
};

export function useMarkerSymbol(type: () => MarkerType) {
  const store = useStoreApi();

  const symbol = () => {
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type());

    if (!symbolExists) {
      store.onError.get()?.('009', errorMessages['error009'](type()));

      return null;
    }

    return MarkerSymbols[type()];
  };

  return symbol;
}
