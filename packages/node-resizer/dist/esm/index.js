import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { memo, useRef, useEffect } from 'react';
import cc from 'classcat';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { useNodeId, useStoreApi, useGetPointerPosition } from '@reactflow/core';

var ResizeControlVariant;
(function (ResizeControlVariant) {
    ResizeControlVariant["Line"] = "line";
    ResizeControlVariant["Handle"] = "handle";
})(ResizeControlVariant || (ResizeControlVariant = {}));

const initPrevValues = { width: 0, height: 0, x: 0, y: 0 };
const initStartValues = {
    ...initPrevValues,
    pointerX: 0,
    pointerY: 0,
};
function ResizeControl({ nodeId, position, variant = ResizeControlVariant.Handle, className, style = {}, children, color, minWidth = 10, minHeight = 10, onResizeStart, onResize, onResizeEnd, }) {
    const contextNodeId = useNodeId();
    const id = typeof nodeId === 'string' ? nodeId : contextNodeId;
    const store = useStoreApi();
    const resizeControlRef = useRef(null);
    const startValues = useRef(initStartValues);
    const prevValues = useRef(initPrevValues);
    const getPointerPosition = useGetPointerPosition();
    const defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
    const controlPosition = position ?? defaultPosition;
    useEffect(() => {
        if (!resizeControlRef.current || !id) {
            return;
        }
        const selection = select(resizeControlRef.current);
        const dragHandler = drag()
            .on('start', (event) => {
            const node = store.getState().nodeInternals.get(id);
            const { xSnapped, ySnapped } = getPointerPosition(event);
            prevValues.current = {
                width: node?.width ?? 0,
                height: node?.height ?? 0,
                x: node?.position.x ?? 0,
                y: node?.position.y ?? 0,
            };
            startValues.current = {
                ...prevValues.current,
                pointerX: xSnapped,
                pointerY: ySnapped,
            };
            onResizeStart?.(event, { ...prevValues.current });
        })
            .on('drag', (event) => {
            const { nodeInternals, triggerNodeChanges } = store.getState();
            const { xSnapped, ySnapped } = getPointerPosition(event);
            const node = nodeInternals.get(id);
            const enableX = controlPosition.includes('right') || controlPosition.includes('left');
            const enableY = controlPosition.includes('bottom') || controlPosition.includes('top');
            const invertX = controlPosition.includes('left');
            const invertY = controlPosition.includes('top');
            if (node) {
                const changes = [];
                const { pointerX: startX, pointerY: startY, width: startWidth, height: startHeight, x: startNodeX, y: startNodeY, } = startValues.current;
                const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues.current;
                const distX = Math.floor(enableX ? xSnapped - startX : 0);
                const distY = Math.floor(enableY ? ySnapped - startY : 0);
                const width = Math.max(startWidth + (invertX ? -distX : distX), minWidth);
                const height = Math.max(startHeight + (invertY ? -distY : distY), minHeight);
                const isWidthChange = width !== prevWidth;
                const isHeightChange = height !== prevHeight;
                if (invertX || invertY) {
                    const x = invertX ? startNodeX - (width - startWidth) : startNodeX;
                    const y = invertY ? startNodeY - (height - startHeight) : startNodeY;
                    // only transform the node if the width or height changes
                    const isXPosChange = x !== prevX && isWidthChange;
                    const isYPosChange = y !== prevY && isHeightChange;
                    if (isXPosChange || isYPosChange) {
                        const positionChange = {
                            id: node.id,
                            type: 'position',
                            position: {
                                x: isXPosChange ? x : prevX,
                                y: isYPosChange ? y : prevY,
                            },
                        };
                        changes.push(positionChange);
                        prevValues.current.x = positionChange.position.x;
                        prevValues.current.y = positionChange.position.y;
                    }
                }
                if (isWidthChange || isHeightChange) {
                    const dimensionChange = {
                        id: id,
                        type: 'dimensions',
                        updateStyle: true,
                        resizing: true,
                        dimensions: {
                            width: width,
                            height: height,
                        },
                    };
                    changes.push(dimensionChange);
                    prevValues.current.width = width;
                    prevValues.current.height = height;
                }
                onResize?.(event, { ...prevValues.current });
                triggerNodeChanges(changes);
            }
        })
            .on('end', (event) => {
            const dimensionChange = {
                id: id,
                type: 'dimensions',
                resizing: false,
            };
            onResizeEnd?.(event, { ...prevValues.current });
            store.getState().triggerNodeChanges([dimensionChange]);
        });
        selection.call(dragHandler);
        return () => {
            selection.on('.drag', null);
        };
    }, [id, controlPosition, minWidth, minHeight, getPointerPosition]);
    const positionClassNames = controlPosition.split('-');
    const colorStyleProp = variant === ResizeControlVariant.Line ? 'borderColor' : 'backgroundColor';
    const controlStyle = color ? { ...style, [colorStyleProp]: color } : style;
    return (jsx("div", { className: cc(['react-flow__resize-control', 'nodrag', ...positionClassNames, variant, className]), ref: resizeControlRef, style: controlStyle, children: children }));
}
var ResizeControl$1 = memo(ResizeControl);

const handleControls = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const lineControls = ['top', 'right', 'bottom', 'left'];
function NodeResizer({ nodeId, isVisible = true, handleClassName, handleStyle, lineClassName, lineStyle, color, minWidth = 10, minHeight = 10, onResizeStart, onResize, onResizeEnd, }) {
    if (!isVisible) {
        return null;
    }
    return (jsxs(Fragment, { children: [lineControls.map((c) => (jsx(ResizeControl$1, { className: lineClassName, style: lineStyle, nodeId: nodeId, position: c, variant: ResizeControlVariant.Line, color: color, minWidth: minWidth, minHeight: minHeight, onResizeStart: onResizeStart, onResize: onResize, onResizeEnd: onResizeEnd }, c))), handleControls.map((c) => (jsx(ResizeControl$1, { className: handleClassName, style: handleStyle, nodeId: nodeId, position: c, color: color, minWidth: minWidth, minHeight: minHeight, onResizeStart: onResizeStart, onResize: onResize, onResizeEnd: onResizeEnd }, c)))] }));
}

export { ResizeControl$1 as NodeResizeControl, NodeResizer, ResizeControlVariant };
