import React from 'react';
import { NodeTypesType } from '../../types';
interface NodeRendererProps {
    nodeTypes: NodeTypesType;
    onElementClick: () => void;
    onNodeDragStop: () => void;
    onlyRenderVisibleNodes?: boolean;
}
declare const NodeRenderer: React.MemoExoticComponent<({ onlyRenderVisibleNodes, ...props }: NodeRendererProps) => JSX.Element>;
export default NodeRenderer;
