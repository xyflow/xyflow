/// <reference types="react" />
import { MarkerType } from '../../types';
import type { EdgeMarker } from '../../types';
declare type SymbolProps = Omit<EdgeMarker, 'type'>;
export declare const MarkerSymbols: {
    arrow: ({ color, strokeWidth }: SymbolProps) => JSX.Element;
    arrowclosed: ({ color, strokeWidth }: SymbolProps) => JSX.Element;
};
export declare function useMarkerSymbol(type: MarkerType): (({ color, strokeWidth }: SymbolProps) => JSX.Element) | null;
export default MarkerSymbols;
//# sourceMappingURL=MarkerSymbols.d.ts.map