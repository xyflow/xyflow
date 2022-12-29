import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Dimensions, Node, XYPosition, CoordinateExtent, Box, Rect } from '../types';
export declare const getDimensions: (node: HTMLDivElement) => Dimensions;
export declare const clamp: (val: number, min?: number, max?: number) => number;
export declare const clampPosition: (position: XYPosition | undefined, extent: CoordinateExtent) => {
    x: number;
    y: number;
};
export declare const getHostForElement: (element: HTMLElement) => Document | ShadowRoot;
export declare const getBoundsOfBoxes: (box1: Box, box2: Box) => Box;
export declare const rectToBox: ({ x, y, width, height }: Rect) => Box;
export declare const boxToRect: ({ x, y, x2, y2 }: Box) => Rect;
export declare const nodeToRect: (node: Node) => Rect;
export declare const getBoundsOfRects: (rect1: Rect, rect2: Rect) => Rect;
export declare const getOverlappingArea: (rectA: Rect, rectB: Rect) => number;
export declare const isRectObject: (obj: any) => obj is Rect;
export declare const isNumeric: (n: any) => n is number;
export declare const internalsSymbol: unique symbol;
export declare const elementSelectionKeys: string[];
export declare const devWarn: (message: string) => void;
export declare function isInputDOMNode(event: KeyboardEvent | ReactKeyboardEvent): boolean;
//# sourceMappingURL=index.d.ts.map