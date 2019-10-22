import React, { SVGAttributes } from 'react';
import { Elements, NodeTypesType, EdgeTypesType, GridType, OnLoadFunc } from '../../types';
export interface GraphViewProps {
    elements: Elements;
    onElementClick: () => void;
    onElementsRemove: (elements: Elements) => void;
    onNodeDragStop: () => void;
    onConnect: () => void;
    onLoad: OnLoadFunc;
    onMove: () => void;
    selectionKeyCode: number;
    nodeTypes: NodeTypesType;
    edgeTypes: EdgeTypesType;
    connectionLineType: string;
    connectionLineStyle: SVGAttributes<{}>;
    deleteKeyCode: number;
    showBackground: boolean;
    backgroundGap: number;
    backgroundColor: string;
    backgroundType: GridType;
    snapToGrid: boolean;
    snapGrid: [number, number];
    onlyRenderVisibleNodes: boolean;
}
declare const GraphView: React.MemoExoticComponent<({ nodeTypes, edgeTypes, onMove, onLoad, onElementClick, onNodeDragStop, connectionLineType, connectionLineStyle, selectionKeyCode, onElementsRemove, deleteKeyCode, elements, showBackground, backgroundGap, backgroundColor, backgroundType, onConnect, snapToGrid, snapGrid, onlyRenderVisibleNodes }: GraphViewProps) => JSX.Element>;
export default GraphView;
