import React, { CSSProperties } from 'react';
import { ElementId, Edge, EdgeCompProps } from '../../types';
interface EdgeWrapperProps {
    id: ElementId;
    source: ElementId;
    target: ElementId;
    type: any;
    label?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle: CSSProperties;
    onClick: (edge: Edge) => void;
    animated: boolean;
    selected: boolean;
    isInteractive: boolean;
}
declare const _default: (EdgeComponent: React.ComponentType<EdgeCompProps>) => React.MemoExoticComponent<({ id, source, target, type, animated, selected, onClick, isInteractive, label, labelStyle, labelShowBg, labelBgStyle, ...rest }: EdgeWrapperProps) => JSX.Element>;
export default _default;
