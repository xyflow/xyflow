import { MarkerType, type EdgeMarker } from '@xyflow/system';

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

export const arrowSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol,
} as const;
