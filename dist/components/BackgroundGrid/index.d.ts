import React, { HTMLAttributes } from 'react';
import { GridType } from '../../types';
interface GridProps extends HTMLAttributes<SVGElement> {
    backgroundType?: GridType;
    gap?: number;
    color?: string;
    size?: number;
}
declare const Grid: React.MemoExoticComponent<({ gap, color, size, style, className, backgroundType, }: GridProps) => JSX.Element>;
export default Grid;
