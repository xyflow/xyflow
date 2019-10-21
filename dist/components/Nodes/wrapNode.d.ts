import React, { CSSProperties } from 'react';
import { Node, Transform, ElementId, NodeComponentProps } from '../../types';
interface WrapNodeProps {
    id: ElementId;
    type: string;
    data: any;
    selected: boolean;
    transform: Transform;
    xPos: number;
    yPos: number;
    onClick: (node: Node) => void | undefined;
    onNodeDragStop: (node: Node) => void;
    style?: CSSProperties;
}
declare const _default: (NodeComponent: React.ComponentType<NodeComponentProps>) => React.MemoExoticComponent<({ id, type, data, transform, xPos, yPos, selected, onClick, onNodeDragStop, style, }: WrapNodeProps) => JSX.Element>;
export default _default;
