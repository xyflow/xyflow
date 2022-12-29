/// <reference types="react" />
declare type LinePatternProps = {
    dimensions: [number, number];
    lineWidth?: number;
    color: string;
};
export declare function LinePattern({ color, dimensions, lineWidth, }: LinePatternProps): JSX.Element;
declare type DotPatternProps = {
    radius: number;
    color: string;
};
export declare function DotPattern({ color, radius }: DotPatternProps): JSX.Element;
export {};
//# sourceMappingURL=Patterns.d.ts.map