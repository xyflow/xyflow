import { CSSProperties } from 'react';
export declare enum BackgroundVariant {
    Lines = "lines",
    Dots = "dots",
    Cross = "cross"
}
export declare type BackgroundProps = {
    color?: string;
    className?: string;
    gap?: number | [number, number];
    size?: number;
    lineWidth?: number;
    variant?: BackgroundVariant;
    style?: CSSProperties;
};
//# sourceMappingURL=types.d.ts.map