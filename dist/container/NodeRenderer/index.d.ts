import React from 'react';
import { NodeTypesType } from '../../types';
interface NodeRendererProps {
    nodeTypes: NodeTypesType;
    onElementClick: () => void;
    onNodeDragStop: () => void;
}
declare const NodeRenderer: React.MemoExoticComponent<(props: NodeRendererProps) => JSX.Element>;
export default NodeRenderer;
