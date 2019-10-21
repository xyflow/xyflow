import React from 'react';
import { GridType } from '../../types';
interface GridProps {
    backgroundType?: GridType;
    gap?: number;
    color?: string;
    size?: number;
    style?: React.CSSProperties;
    className?: string | null;
}
declare const Grid: React.MemoExoticComponent<({ gap, color, size, style, className, backgroundType }: GridProps) => JSX.Element>;
export default Grid;
