import { MouseEvent as ReactMouseEvent } from 'react';
export declare const isInputDOMNode: (e: MouseEvent | ReactMouseEvent<Element, MouseEvent> | ReactMouseEvent<HTMLElement | SVGElement, MouseEvent> | import("react").TouchEvent<HTMLElement | SVGElement> | TouchEvent | KeyboardEvent) => boolean;
export declare const getDimensions: (node: HTMLDivElement) => {
    width: number;
    height: number;
};
