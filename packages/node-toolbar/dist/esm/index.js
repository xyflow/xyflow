import { jsx } from 'react/jsx-runtime';
import { useCallback } from 'react';
import { useStore, useNodeId, getRectOfNodes, internalsSymbol, Position } from '@reactflow/core';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import { createPortal } from 'react-dom';

const selector = (state) => state.domNode?.querySelector('.react-flow__renderer');
function NodeToolbarPortal({ children }) {
    const wrapperRef = useStore(selector);
    if (!wrapperRef) {
        return null;
    }
    return createPortal(children, wrapperRef);
}

const nodeEqualityFn = (a, b) => a?.positionAbsolute?.x === b?.positionAbsolute?.x &&
    a?.positionAbsolute?.y === b?.positionAbsolute?.y &&
    a?.width === b?.width &&
    a?.height === b?.height &&
    a?.selected === b?.selected &&
    a?.[internalsSymbol]?.z === b?.[internalsSymbol]?.z;
const nodesEqualityFn = (a, b) => {
    return a.length === b.length && a.every((node, i) => nodeEqualityFn(node, b[i]));
};
const storeSelector = (state) => ({
    transform: state.transform,
    nodeOrigin: state.nodeOrigin,
    selectedNodesCount: state.getNodes().filter((node) => node.selected).length,
});
function getTransform(nodeRect, transform, position, offset) {
    // position === Position.Top
    let xPos = (nodeRect.x + nodeRect.width / 2) * transform[2] + transform[0];
    let yPos = nodeRect.y * transform[2] + transform[1] - offset;
    let xShift = -50;
    let yShift = -100;
    switch (position) {
        case Position.Right:
            xPos = (nodeRect.x + nodeRect.width) * transform[2] + transform[0] + offset;
            yPos = (nodeRect.y + nodeRect.height / 2) * transform[2] + transform[1];
            xShift = 0;
            yShift = -50;
            break;
        case Position.Bottom:
            yPos = (nodeRect.y + nodeRect.height) * transform[2] + transform[1] + offset;
            yShift = 0;
            break;
        case Position.Left:
            xPos = nodeRect.x * transform[2] + transform[0] - offset;
            yPos = (nodeRect.y + nodeRect.height / 2) * transform[2] + transform[1];
            xShift = -100;
            yShift = -50;
            break;
    }
    return `translate(${xPos}px, ${yPos}px) translate(${xShift}%, ${yShift}%)`;
}
function NodeToolbar({ nodeId, children, className, style, isVisible, position = Position.Top, offset = 10, ...rest }) {
    const contextNodeId = useNodeId();
    const nodesSelector = useCallback((state) => {
        const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId || ''];
        return nodeIds.reduce((acc, id) => {
            const node = state.nodeInternals.get(id);
            if (node) {
                acc.push(node);
            }
            return acc;
        }, []);
    }, [nodeId, contextNodeId]);
    const nodes = useStore(nodesSelector, nodesEqualityFn);
    const { transform, nodeOrigin, selectedNodesCount } = useStore(storeSelector, shallow);
    const isActive = typeof isVisible === 'boolean' ? isVisible : nodes.length === 1 && nodes[0].selected && selectedNodesCount === 1;
    if (!isActive || !nodes.length) {
        return null;
    }
    const nodeRect = getRectOfNodes(nodes, nodeOrigin);
    const zIndex = Math.max(...nodes.map((node) => (node[internalsSymbol]?.z || 1) + 1));
    const wrapperStyle = {
        position: 'absolute',
        transform: getTransform(nodeRect, transform, position, offset),
        zIndex,
        ...style,
    };
    return (jsx(NodeToolbarPortal, { children: jsx("div", { style: wrapperStyle, className: cc(['react-flow__node-toolbar', className]), ...rest, children: children }) }));
}

export { NodeToolbar };
