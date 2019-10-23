import React from 'react';
import { ElementId, Edge, EdgeCompProps } from '../../types';
interface EdgeWrapperProps {
    id: ElementId;
    source: ElementId;
    target: ElementId;
    type: any;
    onClick: (edge: Edge) => void;
    animated: boolean;
    selected: boolean;
    isInteractive: boolean;
}
declare const _default: (EdgeComponent: React.ComponentType<EdgeCompProps>) => React.MemoExoticComponent<({ id, source, target, type, animated, selected, onClick, isInteractive, ...rest }: EdgeWrapperProps) => JSX.Element>;
export default _default;
