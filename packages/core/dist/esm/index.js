import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createContext, useContext, useMemo, memo, useRef, useState, useEffect, forwardRef, useCallback } from 'react';
import cc from 'classcat';
import { useStore as useStore$1, createStore } from 'zustand';
import shallow from 'zustand/shallow';
import { drag } from 'd3-drag';
import { select, pointer } from 'd3-selection';
import { zoomIdentity, zoom } from 'd3-zoom';
import { createPortal } from 'react-dom';

const StoreContext = createContext(null);
const Provider$1 = StoreContext.Provider;

const errorMessage = '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#100';
function useStore(selector, equalityFn) {
    const store = useContext(StoreContext);
    if (store === null) {
        throw new Error(errorMessage);
    }
    return useStore$1(store, selector, equalityFn);
}
const useStoreApi = () => {
    const store = useContext(StoreContext);
    if (store === null) {
        throw new Error(errorMessage);
    }
    return useMemo(() => ({
        getState: store.getState,
        setState: store.setState,
        subscribe: store.subscribe,
        destroy: store.destroy,
    }), [store]);
};

const selector$f = (s) => (s.userSelectionActive ? 'none' : 'all');
function Panel({ position, children, className, style, ...rest }) {
    const pointerEvents = useStore(selector$f);
    const positionClasses = `${position}`.split('-');
    return (jsx("div", { className: cc(['react-flow__panel', className, ...positionClasses]), style: { ...style, pointerEvents }, ...rest, children: children }));
}

function Attribution({ proOptions, position = 'bottom-right' }) {
    if (proOptions?.hideAttribution) {
        return null;
    }
    return (jsx(Panel, { position: position, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) }));
}

const EdgeText = ({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children, className, ...rest }) => {
    const edgeRef = useRef(null);
    const [edgeTextBbox, setEdgeTextBbox] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const edgeTextClasses = cc(['react-flow__edge-textwrapper', className]);
    useEffect(() => {
        if (edgeRef.current) {
            const textBbox = edgeRef.current.getBBox();
            setEdgeTextBbox({
                x: textBbox.x,
                y: textBbox.y,
                width: textBbox.width,
                height: textBbox.height,
            });
        }
    }, [label]);
    if (typeof label === 'undefined' || !label) {
        return null;
    }
    return (jsxs("g", { transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? 'visible' : 'hidden', ...rest, children: [labelShowBg && (jsx("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius })), jsx("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeRef, style: labelStyle, children: label }), children] }));
};
var EdgeText$1 = memo(EdgeText);

const getDimensions = (node) => ({
    width: node.offsetWidth,
    height: node.offsetHeight,
});
const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
const clampPosition = (position = { x: 0, y: 0 }, extent) => ({
    x: clamp(position.x, extent[0][0], extent[1][0]),
    y: clamp(position.y, extent[0][1], extent[1][1]),
});
const getHostForElement = (element) => element.getRootNode?.() || window?.document;
const getBoundsOfBoxes = (box1, box2) => ({
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
});
const rectToBox = ({ x, y, width, height }) => ({
    x,
    y,
    x2: x + width,
    y2: y + height,
});
const boxToRect = ({ x, y, x2, y2 }) => ({
    x,
    y,
    width: x2 - x,
    height: y2 - y,
});
const nodeToRect = (node) => ({
    ...(node.positionAbsolute || { x: 0, y: 0 }),
    width: node.width || 0,
    height: node.height || 0,
});
const getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
const getOverlappingArea = (rectA, rectB) => {
    const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
    const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
    return Math.ceil(xOverlap * yOverlap);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const isNumeric = (n) => !isNaN(n) && isFinite(n);
const internalsSymbol = Symbol.for('internals');
// used for a11y key board controls for nodes and edges
const elementSelectionKeys = ['Enter', ' ', 'Escape'];
const devWarn = (message) => {
    if (process.env.NODE_ENV === 'development') {
        console.warn(`[React Flow]: ${message}`);
    }
};
const isReactKeyboardEvent = (event) => 'nativeEvent' in event;
function isInputDOMNode(event) {
    const kbEvent = isReactKeyboardEvent(event) ? event.nativeEvent : event;
    // using composed path for handling shadow dom
    const target = (kbEvent.composedPath?.()?.[0] || event.target);
    // we want to be able to do a multi selection event if we are in an input field
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
        return false;
    }
    // when an input field is focused we don't want to trigger deletion or movement of nodes
    return (['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.nodeName) ||
        target?.hasAttribute('contenteditable') ||
        !!target?.closest('.nokey'));
}

const BaseEdge = ({ path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth = 20, }) => {
    return (jsxs(Fragment, { children: [jsx("path", { style: style, d: path, fill: "none", className: "react-flow__edge-path", markerEnd: markerEnd, markerStart: markerStart }), interactionWidth && (jsx("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" })), label && isNumeric(labelX) && isNumeric(labelY) ? (jsx(EdgeText$1, { x: labelX, y: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius })) : null] }));
};
BaseEdge.displayName = 'BaseEdge';

const getMarkerEnd = (markerType, markerEndId) => {
    if (typeof markerEndId !== 'undefined' && markerEndId) {
        return `url(#${markerEndId})`;
    }
    return typeof markerType !== 'undefined' ? `url(#react-flow__${markerType})` : 'none';
};
function getMouseHandler$1(id, getState, handler) {
    return handler === undefined
        ? handler
        : (event) => {
            const edge = getState().edges.find((e) => e.id === id);
            if (edge) {
                handler(event, { ...edge });
            }
        };
}
// this is used for straight edges and simple smoothstep edges (LTR, RTL, BTT, TTB)
function getEdgeCenter({ sourceX, sourceY, targetX, targetY, }) {
    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    return [centerX, centerY, xOffset, yOffset];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY, }) {
    // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
    // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
    const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
    const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
    const offsetX = Math.abs(centerX - sourceX);
    const offsetY = Math.abs(centerY - sourceY);
    return [centerX, centerY, offsetX, offsetY];
}

var ConnectionMode;
(function (ConnectionMode) {
    ConnectionMode["Strict"] = "strict";
    ConnectionMode["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function (PanOnScrollMode) {
    PanOnScrollMode["Free"] = "free";
    PanOnScrollMode["Vertical"] = "vertical";
    PanOnScrollMode["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function (SelectionMode) {
    SelectionMode["Partial"] = "partial";
    SelectionMode["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));

var ConnectionLineType;
(function (ConnectionLineType) {
    ConnectionLineType["Bezier"] = "default";
    ConnectionLineType["Straight"] = "straight";
    ConnectionLineType["Step"] = "step";
    ConnectionLineType["SmoothStep"] = "smoothstep";
    ConnectionLineType["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function (MarkerType) {
    MarkerType["Arrow"] = "arrow";
    MarkerType["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));

var Position;
(function (Position) {
    Position["Left"] = "left";
    Position["Top"] = "top";
    Position["Right"] = "right";
    Position["Bottom"] = "bottom";
})(Position || (Position = {}));

function getControl({ pos, x1, y1, x2, y2 }) {
    if (pos === Position.Left || pos === Position.Right) {
        return [0.5 * (x1 + x2), y1];
    }
    return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, }) {
    const [sourceControlX, sourceControlY] = getControl({
        pos: sourcePosition,
        x1: sourceX,
        y1: sourceY,
        x2: targetX,
        y2: targetY,
    });
    const [targetControlX, targetControlY] = getControl({
        pos: targetPosition,
        x1: targetX,
        y1: targetY,
        x2: sourceX,
        y2: sourceY,
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceControlX,
        sourceControlY,
        targetControlX,
        targetControlY,
    });
    return [
        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
        labelX,
        labelY,
        offsetX,
        offsetY,
    ];
}
const SimpleBezierEdge = memo(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }) => {
    const [path, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    return (jsx(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
SimpleBezierEdge.displayName = 'SimpleBezierEdge';

const handleDirections = {
    [Position.Left]: { x: -1, y: 0 },
    [Position.Right]: { x: 1, y: 0 },
    [Position.Top]: { x: 0, y: -1 },
    [Position.Bottom]: { x: 0, y: 1 },
};
const getDirection = ({ source, sourcePosition = Position.Bottom, target, }) => {
    if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
        return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
    }
    return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
// ith this function we try to mimic a orthogonal edge routing behaviour
// It's not as good as a real orthogonal edge routing but it's faster and good enough as a default for step and smooth step edges
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset, }) {
    const sourceDir = handleDirections[sourcePosition];
    const targetDir = handleDirections[targetPosition];
    const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
    const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
    const dir = getDirection({
        source: sourceGapped,
        sourcePosition,
        target: targetGapped,
    });
    const dirAccessor = dir.x !== 0 ? 'x' : 'y';
    const currDir = dir[dirAccessor];
    let points = [];
    let centerX, centerY;
    const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
        sourceX: source.x,
        sourceY: source.y,
        targetX: target.x,
        targetY: target.y,
    });
    // opposite handle positions, default case
    if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
        centerX = center.x || defaultCenterX;
        centerY = center.y || defaultCenterY;
        //    --->
        //    |
        // >---
        const verticalSplit = [
            { x: centerX, y: sourceGapped.y },
            { x: centerX, y: targetGapped.y },
        ];
        //    |
        //  ---
        //  |
        const horizontalSplit = [
            { x: sourceGapped.x, y: centerY },
            { x: targetGapped.x, y: centerY },
        ];
        if (sourceDir[dirAccessor] === currDir) {
            points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
        }
        else {
            points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
        }
    }
    else {
        // sourceTarget means we take x from source and y from target, targetSource is the opposite
        const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
        const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
        // this handles edges with same handle positions
        if (dirAccessor === 'x') {
            points = sourceDir.x === currDir ? targetSource : sourceTarget;
        }
        else {
            points = sourceDir.y === currDir ? sourceTarget : targetSource;
        }
        // these are conditions for handling mixed handle positions like Right -> Bottom for example
        if (sourcePosition !== targetPosition) {
            const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
            const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
            const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
            const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
            const flipSourceTarget = (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
                (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));
            if (flipSourceTarget) {
                points = dirAccessor === 'x' ? sourceTarget : targetSource;
            }
        }
        centerX = points[0].x;
        centerY = points[0].y;
    }
    const pathPoints = [source, sourceGapped, ...points, targetGapped, target];
    return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
    const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
    const { x, y } = b;
    // no bend
    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
        return `L${x} ${y}`;
    }
    // first segment is horizontal
    if (a.y === y) {
        const xDir = a.x < c.x ? -1 : 1;
        const yDir = a.y < c.y ? 1 : -1;
        return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
    }
    const xDir = a.x < c.x ? 1 : -1;
    const yDir = a.y < c.y ? -1 : 1;
    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20, }) {
    const [points, labelX, labelY, offsetX, offsetY] = getPoints({
        source: { x: sourceX, y: sourceY },
        sourcePosition,
        target: { x: targetX, y: targetY },
        targetPosition,
        center: { x: centerX, y: centerY },
        offset,
    });
    const path = points.reduce((res, p, i) => {
        let segment = '';
        if (i > 0 && i < points.length - 1) {
            segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
        }
        else {
            segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
        }
        res += segment;
        return res;
    }, '');
    return [path, labelX, labelY, offsetX, offsetY];
}
const SmoothStepEdge = memo(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth, }) => {
    const [path, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: pathOptions?.borderRadius,
        offset: pathOptions?.offset,
    });
    return (jsx(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
SmoothStepEdge.displayName = 'SmoothStepEdge';

const StepEdge = memo((props) => (jsx(SmoothStepEdge, { ...props, pathOptions: useMemo(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset]) })));
StepEdge.displayName = 'StepEdge';

function getStraightPath({ sourceX, sourceY, targetX, targetY, }) {
    const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
const StraightEdge = memo(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }) => {
    const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    return (jsx(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
StraightEdge.displayName = 'StraightEdge';

function calculateControlOffset(distance, curvature) {
    if (distance >= 0) {
        return 0.5 * distance;
    }
    return curvature * 25 * Math.sqrt(-distance);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
    switch (pos) {
        case Position.Left:
            return [x1 - calculateControlOffset(x1 - x2, c), y1];
        case Position.Right:
            return [x1 + calculateControlOffset(x2 - x1, c), y1];
        case Position.Top:
            return [x1, y1 - calculateControlOffset(y1 - y2, c)];
        case Position.Bottom:
            return [x1, y1 + calculateControlOffset(y2 - y1, c)];
    }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25, }) {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
        pos: sourcePosition,
        x1: sourceX,
        y1: sourceY,
        x2: targetX,
        y2: targetY,
        c: curvature,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
        pos: targetPosition,
        x1: targetX,
        y1: targetY,
        x2: sourceX,
        y2: sourceY,
        c: curvature,
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceControlX,
        sourceControlY,
        targetControlX,
        targetControlY,
    });
    return [
        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
        labelX,
        labelY,
        offsetX,
        offsetY,
    ];
}
const BezierEdge = memo(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, pathOptions, interactionWidth, }) => {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: pathOptions?.curvature,
    });
    return (jsx(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
BezierEdge.displayName = 'BezierEdge';

const NodeIdContext = createContext(null);
const Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
const useNodeId = () => {
    const nodeId = useContext(NodeIdContext);
    return nodeId;
};

// checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
function checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc) {
    const elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
    const elementBelowIsTarget = elementBelow?.classList.contains('target') || false;
    const elementBelowIsSource = elementBelow?.classList.contains('source') || false;
    const result = {
        elementBelow,
        isValid: false,
        connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
        isHoveringHandle: false,
    };
    if (elementBelow && (elementBelowIsTarget || elementBelowIsSource)) {
        result.isHoveringHandle = true;
        const elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
        const elementBelowHandleId = elementBelow.getAttribute('data-handleid');
        const connection = isTarget
            ? {
                source: elementBelowNodeId,
                sourceHandle: elementBelowHandleId,
                target: nodeId,
                targetHandle: handleId,
            }
            : {
                source: nodeId,
                sourceHandle: handleId,
                target: elementBelowNodeId,
                targetHandle: elementBelowHandleId,
            };
        result.connection = connection;
        // in strict mode we don't allow target to target or source to source connections
        const isValid = connectionMode === ConnectionMode.Strict
            ? (isTarget && elementBelowIsSource) || (!isTarget && elementBelowIsTarget)
            : elementBelowNodeId !== nodeId || elementBelowHandleId !== handleId;
        if (isValid) {
            result.isValid = isValidConnection(connection);
        }
    }
    return result;
}
function resetRecentHandle(hoveredHandle) {
    hoveredHandle?.classList.remove('react-flow__handle-valid');
    hoveredHandle?.classList.remove('react-flow__handle-connecting');
}
function handleMouseDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, elementEdgeUpdaterType, onEdgeUpdateEnd, }) {
    const reactFlowNode = event.target.closest('.react-flow');
    // when react-flow is used inside a shadow root we can't use document
    const doc = getHostForElement(event.target);
    if (!doc) {
        return;
    }
    const elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
    const elementBelowIsTarget = elementBelow?.classList.contains('target');
    const elementBelowIsSource = elementBelow?.classList.contains('source');
    if (!reactFlowNode || (!elementBelowIsTarget && !elementBelowIsSource && !elementEdgeUpdaterType)) {
        return;
    }
    const { onConnectStart, connectionMode } = getState();
    const handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementBelowIsTarget ? 'target' : 'source';
    const containerBounds = reactFlowNode.getBoundingClientRect();
    let recentHoveredHandle;
    setState({
        connectionPosition: {
            x: event.clientX - containerBounds.left,
            y: event.clientY - containerBounds.top,
        },
        connectionNodeId: nodeId,
        connectionHandleId: handleId,
        connectionHandleType: handleType,
    });
    onConnectStart?.(event, { nodeId, handleId, handleType });
    function onMouseMove(event) {
        setState({
            connectionPosition: {
                x: event.clientX - containerBounds.left,
                y: event.clientY - containerBounds.top,
            },
        });
        const { connection, elementBelow, isValid, isHoveringHandle } = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc);
        if (!isHoveringHandle) {
            return resetRecentHandle(recentHoveredHandle);
        }
        if (connection.source !== connection.target && elementBelow) {
            resetRecentHandle(recentHoveredHandle);
            recentHoveredHandle = elementBelow;
            elementBelow.classList.add('react-flow__handle-connecting');
            elementBelow.classList.toggle('react-flow__handle-valid', isValid);
        }
    }
    function onMouseUp(event) {
        const { connection, isValid } = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc);
        if (isValid) {
            onConnect?.(connection);
        }
        getState().onConnectEnd?.(event);
        if (elementEdgeUpdaterType && onEdgeUpdateEnd) {
            onEdgeUpdateEnd(event);
        }
        resetRecentHandle(recentHoveredHandle);
        setState({
            connectionNodeId: null,
            connectionHandleId: null,
            connectionHandleType: null,
        });
        doc.removeEventListener('mousemove', onMouseMove);
        doc.removeEventListener('mouseup', onMouseUp);
    }
    doc.addEventListener('mousemove', onMouseMove);
    doc.addEventListener('mouseup', onMouseUp);
}

const isEdge = (element) => 'id' in element && 'source' in element && 'target' in element;
const isNode = (element) => 'id' in element && !('source' in element) && !('target' in element);
const getOutgoers = (node, nodes, edges) => {
    if (!isNode(node)) {
        return [];
    }
    const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
    return nodes.filter((n) => outgoerIds.includes(n.id));
};
const getIncomers = (node, nodes, edges) => {
    if (!isNode(node)) {
        return [];
    }
    const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
    return nodes.filter((n) => incomersIds.includes(n.id));
};
const getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
const getMarkerId = (marker, rfId) => {
    if (typeof marker === 'undefined') {
        return '';
    }
    if (typeof marker === 'string') {
        return marker;
    }
    const idPrefix = rfId ? `${rfId}__` : '';
    return `${idPrefix}${Object.keys(marker)
        .sort()
        .map((key) => `${key}=${marker[key]}`)
        .join('&')}`;
};
const connectionExists = (edge, edges) => {
    return edges.some((el) => el.source === edge.source &&
        el.target === edge.target &&
        (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
        (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle)));
};
const addEdge = (edgeParams, edges) => {
    if (!edgeParams.source || !edgeParams.target) {
        devWarn("Can't create edge. An edge needs a source and a target. Help: https://reactflow.dev/error#600");
        return edges;
    }
    let edge;
    if (isEdge(edgeParams)) {
        edge = { ...edgeParams };
    }
    else {
        edge = {
            ...edgeParams,
            id: getEdgeId(edgeParams),
        };
    }
    if (connectionExists(edge, edges)) {
        return edges;
    }
    return edges.concat(edge);
};
const updateEdge = (oldEdge, newConnection, edges) => {
    if (!newConnection.source || !newConnection.target) {
        devWarn("Can't create a new edge. An edge needs a source and a target. Help: https://reactflow.dev/error#600");
        return edges;
    }
    const foundEdge = edges.find((e) => e.id === oldEdge.id);
    if (!foundEdge) {
        devWarn(`The old edge with id=${oldEdge.id} does not exist. Help: https://reactflow.dev/error#700`);
        return edges;
    }
    // Remove old edge and create the new edge with parameters of old edge.
    const edge = {
        ...oldEdge,
        id: getEdgeId(newConnection),
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
    };
    return edges.filter((e) => e.id !== oldEdge.id).concat(edge);
};
const pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid, [snapX, snapY]) => {
    const position = {
        x: (x - tx) / tScale,
        y: (y - ty) / tScale,
    };
    if (snapToGrid) {
        return {
            x: snapX * Math.round(position.x / snapX),
            y: snapY * Math.round(position.y / snapY),
        };
    }
    return position;
};
const getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
    if (!node) {
        return {
            x: 0,
            y: 0,
            positionAbsolute: {
                x: 0,
                y: 0,
            },
        };
    }
    const offsetX = (node.width ?? 0) * nodeOrigin[0];
    const offsetY = (node.height ?? 0) * nodeOrigin[1];
    const position = {
        x: node.position.x - offsetX,
        y: node.position.y - offsetY,
    };
    return {
        ...position,
        positionAbsolute: node.positionAbsolute
            ? {
                x: node.positionAbsolute.x - offsetX,
                y: node.positionAbsolute.y - offsetY,
            }
            : position,
    };
};
const getRectOfNodes = (nodes, nodeOrigin = [0, 0]) => {
    if (nodes.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    const box = nodes.reduce((currBox, node) => {
        const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
        return getBoundsOfBoxes(currBox, rectToBox({
            x,
            y,
            width: node.width || 0,
            height: node.height || 0,
        }));
    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return boxToRect(box);
};
const getNodesInside = (nodeInternals, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, 
// set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
excludeNonSelectableNodes = false, nodeOrigin = [0, 0]) => {
    const paneRect = {
        x: (rect.x - tx) / tScale,
        y: (rect.y - ty) / tScale,
        width: rect.width / tScale,
        height: rect.height / tScale,
    };
    const visibleNodes = [];
    nodeInternals.forEach((node) => {
        const { width, height, selectable = true, hidden = false } = node;
        if ((excludeNonSelectableNodes && !selectable) || hidden) {
            return false;
        }
        const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);
        const nodeRect = {
            x: positionAbsolute.x,
            y: positionAbsolute.y,
            width: width || 0,
            height: height || 0,
        };
        const overlappingArea = getOverlappingArea(paneRect, nodeRect);
        const notInitialized = typeof width === 'undefined' || typeof height === 'undefined' || width === null || height === null;
        const partiallyVisible = partially && overlappingArea > 0;
        const area = (width || 0) * (height || 0);
        const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;
        if (isVisible || node.dragging) {
            visibleNodes.push(node);
        }
    });
    return visibleNodes;
};
const getConnectedEdges = (nodes, edges) => {
    const nodeIds = nodes.map((node) => node.id);
    return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};
const getTransformForBounds = (bounds, width, height, minZoom, maxZoom, padding = 0.1) => {
    const xZoom = width / (bounds.width * (1 + padding));
    const yZoom = height / (bounds.height * (1 + padding));
    const zoom = Math.min(xZoom, yZoom);
    const clampedZoom = clamp(zoom, minZoom, maxZoom);
    const boundsCenterX = bounds.x + bounds.width / 2;
    const boundsCenterY = bounds.y + bounds.height / 2;
    const x = width / 2 - boundsCenterX * clampedZoom;
    const y = height / 2 - boundsCenterY * clampedZoom;
    return [x, y, clampedZoom];
};
const getD3Transition = (selection, duration = 0) => {
    return selection.transition().duration(duration);
};

const alwaysValid = () => true;
const selector$e = (s) => ({
    connectionStartHandle: s.connectionStartHandle,
    connectOnClick: s.connectOnClick,
    noPanClassName: s.noPanClassName,
});
const Handle = forwardRef(({ type = 'source', position = Position.Top, isValidConnection = alwaysValid, isConnectable = true, id, onConnect, children, className, onMouseDown, ...rest }, ref) => {
    const store = useStoreApi();
    // @fixme: remove type assertion and handle nodeId === null
    const nodeId = useNodeId();
    const { connectionStartHandle, connectOnClick, noPanClassName } = useStore(selector$e, shallow);
    const handleId = id || null;
    const isTarget = type === 'target';
    const onConnectExtended = (params) => {
        const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
        const edgeParams = {
            ...defaultEdgeOptions,
            ...params,
        };
        if (hasDefaultEdges) {
            const { edges } = store.getState();
            store.setState({ edges: addEdge(edgeParams, edges) });
        }
        onConnectAction?.(edgeParams);
        onConnect?.(edgeParams);
    };
    const onMouseDownHandler = (event) => {
        if (event.button === 0) {
            handleMouseDown({
                event,
                handleId,
                nodeId,
                onConnect: onConnectExtended,
                isTarget,
                getState: store.getState,
                setState: store.setState,
                isValidConnection,
            });
        }
        onMouseDown?.(event);
    };
    const onClick = (event) => {
        const { onClickConnectStart, onClickConnectEnd, connectionMode } = store.getState();
        if (!connectionStartHandle) {
            onClickConnectStart?.(event, { nodeId, handleId, handleType: type });
            store.setState({ connectionStartHandle: { nodeId, type, handleId } });
            return;
        }
        const doc = getHostForElement(event.target);
        const { connection, isValid } = checkElementBelowIsValid(event, connectionMode, connectionStartHandle.type === 'target', connectionStartHandle.nodeId, connectionStartHandle.handleId || null, isValidConnection, doc);
        if (isValid) {
            onConnectExtended(connection);
        }
        onClickConnectEnd?.(event);
        store.setState({ connectionStartHandle: null });
    };
    return (jsx("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, className: cc([
            'react-flow__handle',
            `react-flow__handle-${position}`,
            'nodrag',
            noPanClassName,
            className,
            {
                source: !isTarget,
                target: isTarget,
                connectable: isConnectable,
                connecting: connectionStartHandle?.nodeId === nodeId &&
                    connectionStartHandle?.handleId === handleId &&
                    connectionStartHandle?.type === type,
            },
        ]), onMouseDown: onMouseDownHandler, onClick: connectOnClick ? onClick : undefined, ref: ref, ...rest, children: children }));
});
Handle.displayName = 'Handle';
var Handle$1 = memo(Handle);

const DefaultNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom, }) => {
    return (jsxs(Fragment, { children: [jsx(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }), data?.label, jsx(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })] }));
};
DefaultNode.displayName = 'DefaultNode';
var DefaultNode$1 = memo(DefaultNode);

const InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }) => (jsxs(Fragment, { children: [data?.label, jsx(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })] }));
InputNode.displayName = 'InputNode';
var InputNode$1 = memo(InputNode);

const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }) => (jsxs(Fragment, { children: [jsx(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }), data?.label] }));
OutputNode.displayName = 'OutputNode';
var OutputNode$1 = memo(OutputNode);

const GroupNode = () => null;
GroupNode.displayName = 'GroupNode';

const selector$d = (s) => ({
    selectedNodes: s.getNodes().filter((n) => n.selected),
    selectedEdges: s.edges.filter((e) => e.selected),
});
const selectId = (obj) => obj.id;
function areEqual(a, b) {
    return (shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) &&
        shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId)));
}
// This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
const SelectionListener = memo(({ onSelectionChange }) => {
    const store = useStoreApi();
    const { selectedNodes, selectedEdges } = useStore(selector$d, areEqual);
    useEffect(() => {
        const params = { nodes: selectedNodes, edges: selectedEdges };
        onSelectionChange?.(params);
        store.getState().onSelectionChange?.(params);
    }, [selectedNodes, selectedEdges, onSelectionChange]);
    return null;
});
SelectionListener.displayName = 'SelectionListener';
const changeSelector = (s) => !!s.onSelectionChange;
function Wrapper$1({ onSelectionChange }) {
    const storeHasSelectionChange = useStore(changeSelector);
    if (onSelectionChange || storeHasSelectionChange) {
        return jsx(SelectionListener, { onSelectionChange: onSelectionChange });
    }
    return null;
}

const selector$c = (s) => ({
    setNodes: s.setNodes,
    setEdges: s.setEdges,
    setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
    setMinZoom: s.setMinZoom,
    setMaxZoom: s.setMaxZoom,
    setTranslateExtent: s.setTranslateExtent,
    setNodeExtent: s.setNodeExtent,
    reset: s.reset,
});
function useStoreUpdater(value, setStoreState) {
    useEffect(() => {
        if (typeof value !== 'undefined') {
            setStoreState(value);
        }
    }, [value]);
}
// updates with values in store that don't have a dedicated setter function
function useDirectStoreUpdater(key, value, setState) {
    useEffect(() => {
        if (typeof value !== 'undefined') {
            setState({ [key]: value });
        }
    }, [value]);
}
const StoreUpdater = ({ nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, elevateNodesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, connectOnClick, defaultEdgeOptions, fitView, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDrag, onNodeDragStart, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId, }) => {
    const { setNodes, setEdges, setDefaultNodesAndEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset, } = useStore(selector$c, shallow);
    const store = useStoreApi();
    useEffect(() => {
        const edgesWithDefaults = defaultEdges?.map((e) => ({ ...e, ...defaultEdgeOptions }));
        setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);
        return () => {
            reset();
        };
    }, []);
    useDirectStoreUpdater('defaultEdgeOptions', defaultEdgeOptions, store.setState);
    useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
    useDirectStoreUpdater('onConnect', onConnect, store.setState);
    useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
    useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
    useDirectStoreUpdater('onClickConnectStart', onClickConnectStart, store.setState);
    useDirectStoreUpdater('onClickConnectEnd', onClickConnectEnd, store.setState);
    useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
    useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
    useDirectStoreUpdater('nodesFocusable', nodesFocusable, store.setState);
    useDirectStoreUpdater('edgesFocusable', edgesFocusable, store.setState);
    useDirectStoreUpdater('elementsSelectable', elementsSelectable, store.setState);
    useDirectStoreUpdater('elevateNodesOnSelect', elevateNodesOnSelect, store.setState);
    useDirectStoreUpdater('snapToGrid', snapToGrid, store.setState);
    useDirectStoreUpdater('snapGrid', snapGrid, store.setState);
    useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
    useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
    useDirectStoreUpdater('connectOnClick', connectOnClick, store.setState);
    useDirectStoreUpdater('fitViewOnInit', fitView, store.setState);
    useDirectStoreUpdater('fitViewOnInitOptions', fitViewOptions, store.setState);
    useDirectStoreUpdater('onNodesDelete', onNodesDelete, store.setState);
    useDirectStoreUpdater('onEdgesDelete', onEdgesDelete, store.setState);
    useDirectStoreUpdater('onNodeDrag', onNodeDrag, store.setState);
    useDirectStoreUpdater('onNodeDragStart', onNodeDragStart, store.setState);
    useDirectStoreUpdater('onNodeDragStop', onNodeDragStop, store.setState);
    useDirectStoreUpdater('onSelectionDrag', onSelectionDrag, store.setState);
    useDirectStoreUpdater('onSelectionDragStart', onSelectionDragStart, store.setState);
    useDirectStoreUpdater('onSelectionDragStop', onSelectionDragStop, store.setState);
    useDirectStoreUpdater('noPanClassName', noPanClassName, store.setState);
    useDirectStoreUpdater('nodeOrigin', nodeOrigin, store.setState);
    useDirectStoreUpdater('rfId', rfId, store.setState);
    useStoreUpdater(nodes, setNodes);
    useStoreUpdater(edges, setEdges);
    useStoreUpdater(minZoom, setMinZoom);
    useStoreUpdater(maxZoom, setMaxZoom);
    useStoreUpdater(translateExtent, setTranslateExtent);
    useStoreUpdater(nodeExtent, setNodeExtent);
    return null;
};

const style = { display: 'none' };
const ariaLiveStyle = {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0px, 0px, 0px, 0px)',
    clipPath: 'inset(100%)',
};
const ARIA_NODE_DESC_KEY = 'react-flow__node-desc';
const ARIA_EDGE_DESC_KEY = 'react-flow__edge-desc';
const ARIA_LIVE_MESSAGE = 'react-flow__aria-live';
const selector$b = (s) => s.ariaLiveMessage;
function AriaLiveMessage({ rfId }) {
    const ariaLiveMessage = useStore(selector$b);
    return (jsx("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle, children: ariaLiveMessage }));
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
    return (jsxs(Fragment, { children: [jsxs("div", { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style: style, children: ["Press enter or space to select a node.", !disableKeyboardA11y && 'You can then use the arrow keys to move the node around.', " Press delete to remove it and escape to cancel.", ' '] }), jsx("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style: style, children: "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel." }), !disableKeyboardA11y && jsx(AriaLiveMessage, { rfId: rfId })] }));
}

const shiftX = (x, shift, position) => {
    if (position === Position.Left)
        return x - shift;
    if (position === Position.Right)
        return x + shift;
    return x;
};
const shiftY = (y, shift, position) => {
    if (position === Position.Top)
        return y - shift;
    if (position === Position.Bottom)
        return y + shift;
    return y;
};
const EdgeUpdaterClassName = 'react-flow__edgeupdater';
const EdgeAnchor = ({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type, }) => (jsx("circle", { onMouseDown: onMouseDown, onMouseEnter: onMouseEnter, onMouseOut: onMouseOut, className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" }));

var wrapEdge = (EdgeComponent) => {
    const EdgeWrapper = ({ id, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, edgeUpdaterRadius, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, pathOptions, interactionWidth, }) => {
        const edgeRef = useRef(null);
        const [updateHover, setUpdateHover] = useState(false);
        const [updating, setUpdating] = useState(false);
        const store = useStoreApi();
        const markerStartUrl = useMemo(() => `url(#${getMarkerId(markerStart, rfId)})`, [markerStart, rfId]);
        const markerEndUrl = useMemo(() => `url(#${getMarkerId(markerEnd, rfId)})`, [markerEnd, rfId]);
        if (hidden) {
            return null;
        }
        const onEdgeClick = (event) => {
            const { edges, addSelectedEdges } = store.getState();
            if (elementsSelectable) {
                store.setState({ nodesSelectionActive: false });
                addSelectedEdges([id]);
            }
            if (onClick) {
                const edge = edges.find((e) => e.id === id);
                onClick(event, edge);
            }
        };
        const onEdgeDoubleClickHandler = getMouseHandler$1(id, store.getState, onEdgeDoubleClick);
        const onEdgeContextMenu = getMouseHandler$1(id, store.getState, onContextMenu);
        const onEdgeMouseEnter = getMouseHandler$1(id, store.getState, onMouseEnter);
        const onEdgeMouseMove = getMouseHandler$1(id, store.getState, onMouseMove);
        const onEdgeMouseLeave = getMouseHandler$1(id, store.getState, onMouseLeave);
        const handleEdgeUpdater = (event, isSourceHandle) => {
            const nodeId = isSourceHandle ? target : source;
            const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
            const handleType = isSourceHandle ? 'target' : 'source';
            const isValidConnection = () => true;
            const isTarget = isSourceHandle;
            const edge = store.getState().edges.find((e) => e.id === id);
            setUpdating(true);
            onEdgeUpdateStart?.(event, edge, handleType);
            const _onEdgeUpdateEnd = (evt) => {
                setUpdating(false);
                onEdgeUpdateEnd?.(evt, edge, handleType);
            };
            const onConnectEdge = (connection) => onEdgeUpdate?.(edge, connection);
            handleMouseDown({
                event,
                handleId,
                nodeId,
                onConnect: onConnectEdge,
                isTarget,
                getState: store.getState,
                setState: store.setState,
                isValidConnection,
                elementEdgeUpdaterType: handleType,
                onEdgeUpdateEnd: _onEdgeUpdateEnd,
            });
        };
        const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
        const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
        const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
        const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
        const inactive = !elementsSelectable && !onClick;
        const handleEdgeUpdate = typeof onEdgeUpdate !== 'undefined';
        const onKeyDown = (event) => {
            if (elementSelectionKeys.includes(event.key) && elementsSelectable) {
                const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
                const unselect = event.key === 'Escape';
                if (unselect) {
                    edgeRef.current?.blur();
                    unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id)] });
                }
                else {
                    addSelectedEdges([id]);
                }
            }
        };
        return (jsxs("g", { className: cc([
                'react-flow__edge',
                `react-flow__edge-${type}`,
                className,
                { selected, animated, inactive, updating: updateHover },
            ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClickHandler, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : undefined, tabIndex: isFocusable ? 0 : undefined, role: isFocusable ? 'button' : undefined, "data-testid": `rf__edge-${id}`, "aria-label": ariaLabel === null ? undefined : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined, ref: edgeRef, children: [!updating && (jsx(EdgeComponent, { id: id, source: source, target: target, selected: selected, animated: animated, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, data: data, style: style, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, sourceHandleId: sourceHandleId, targetHandleId: targetHandleId, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions: pathOptions, interactionWidth: interactionWidth })), handleEdgeUpdate && (jsxs(Fragment, { children: [jsx(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "source" }), jsx(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "target" })] }))] }));
    };
    EdgeWrapper.displayName = 'EdgeWrapper';
    return memo(EdgeWrapper);
};

function createEdgeTypes(edgeTypes) {
    const standardTypes = {
        default: wrapEdge((edgeTypes.default || BezierEdge)),
        straight: wrapEdge((edgeTypes.bezier || StraightEdge)),
        step: wrapEdge((edgeTypes.step || StepEdge)),
        smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge)),
        simplebezier: wrapEdge((edgeTypes.simplebezier || SimpleBezierEdge)),
    };
    const wrappedTypes = {};
    const specialTypes = Object.keys(edgeTypes)
        .filter((k) => !['default', 'bezier'].includes(k))
        .reduce((res, key) => {
        res[key] = wrapEdge((edgeTypes[key] || BezierEdge));
        return res;
    }, wrappedTypes);
    return {
        ...standardTypes,
        ...specialTypes,
    };
}
function getHandlePosition(position, nodeRect, handle = null) {
    const x = (handle?.x || 0) + nodeRect.x;
    const y = (handle?.y || 0) + nodeRect.y;
    const width = handle?.width || nodeRect.width;
    const height = handle?.height || nodeRect.height;
    switch (position) {
        case Position.Top:
            return {
                x: x + width / 2,
                y,
            };
        case Position.Right:
            return {
                x: x + width,
                y: y + height / 2,
            };
        case Position.Bottom:
            return {
                x: x + width / 2,
                y: y + height,
            };
        case Position.Left:
            return {
                x,
                y: y + height / 2,
            };
    }
}
function getHandle(bounds, handleId) {
    if (!bounds) {
        return null;
    }
    // there is no handleId when there are no multiple handles/ handles with ids
    // so we just pick the first one
    let handle = null;
    if (bounds.length === 1 || !handleId) {
        handle = bounds[0];
    }
    else if (handleId) {
        handle = bounds.find((d) => d.id === handleId);
    }
    return typeof handle === 'undefined' ? null : handle;
}
const getEdgePositions = (sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) => {
    const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
    const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
    return {
        sourceX: sourceHandlePos.x,
        sourceY: sourceHandlePos.y,
        targetX: targetHandlePos.x,
        targetY: targetHandlePos.y,
    };
};
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform, }) {
    const edgeBox = {
        x: Math.min(sourcePos.x, targetPos.x),
        y: Math.min(sourcePos.y, targetPos.y),
        x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
        y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight),
    };
    if (edgeBox.x === edgeBox.x2) {
        edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
        edgeBox.y2 += 1;
    }
    const viewBox = rectToBox({
        x: (0 - transform[0]) / transform[2],
        y: (0 - transform[1]) / transform[2],
        width: width / transform[2],
        height: height / transform[2],
    });
    const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
    const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
    const overlappingArea = Math.ceil(xOverlap * yOverlap);
    return overlappingArea > 0;
}
function getNodeData(node) {
    const handleBounds = node?.[internalsSymbol]?.handleBounds || null;
    const isInvalid = !node ||
        !handleBounds ||
        !node.width ||
        !node.height ||
        typeof node.positionAbsolute?.x === 'undefined' ||
        typeof node.positionAbsolute?.y === 'undefined';
    return [
        {
            x: node?.positionAbsolute?.x || 0,
            y: node?.positionAbsolute?.y || 0,
            width: node?.width || 0,
            height: node?.height || 0,
        },
        handleBounds,
        !isInvalid,
    ];
}

function isParentSelected(node, nodeInternals) {
    if (!node.parentNode) {
        return false;
    }
    const parentNode = nodeInternals.get(node.parentNode);
    if (!parentNode) {
        return false;
    }
    if (parentNode.selected) {
        return true;
    }
    return isParentSelected(parentNode, nodeInternals);
}
function hasSelector(target, selector, nodeRef) {
    let current = target;
    do {
        if (current?.matches(selector))
            return true;
        if (current === nodeRef.current)
            return false;
        current = current.parentElement;
    } while (current);
    return false;
}
// looks for all selected nodes and created a NodeDragItem for each of them
function getDragItems(nodeInternals, mousePos, nodeId) {
    return Array.from(nodeInternals.values())
        .filter((n) => (n.selected || n.id === nodeId) && (!n.parentNode || !isParentSelected(n, nodeInternals)))
        .map((n) => ({
        id: n.id,
        position: n.position || { x: 0, y: 0 },
        positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
        distance: {
            x: mousePos.x - (n.positionAbsolute?.x ?? 0),
            y: mousePos.y - (n.positionAbsolute?.y ?? 0),
        },
        delta: {
            x: 0,
            y: 0,
        },
        extent: n.extent,
        parentNode: n.parentNode,
        width: n.width,
        height: n.height,
    }));
}
function calcNextPosition(node, nextPosition, nodeInternals, nodeExtent, nodeOrigin = [0, 0]) {
    let currentExtent = node.extent || nodeExtent;
    if (node.extent === 'parent') {
        if (node.parentNode && node.width && node.height) {
            const parent = nodeInternals.get(node.parentNode);
            const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
            currentExtent =
                parent && isNumeric(parentX) && isNumeric(parentY) && isNumeric(parent.width) && isNumeric(parent.height)
                    ? [
                        [parentX + node.width * nodeOrigin[0], parentY + node.height * nodeOrigin[1]],
                        [
                            parentX + parent.width - node.width + node.width * nodeOrigin[0],
                            parentY + parent.height - node.height + node.height * nodeOrigin[1],
                        ],
                    ]
                    : currentExtent;
        }
        else {
            devWarn('Only child nodes can use a parent extent. Help: https://reactflow.dev/error#500');
            currentExtent = nodeExtent;
        }
    }
    else if (node.extent && node.parentNode) {
        const parent = nodeInternals.get(node.parentNode);
        const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
        currentExtent = [
            [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
            [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
        ];
    }
    let parentPosition = { x: 0, y: 0 };
    if (node.parentNode) {
        const parentNode = nodeInternals.get(node.parentNode);
        parentPosition = getNodePositionWithOrigin(parentNode, nodeOrigin).positionAbsolute;
    }
    const positionAbsolute = currentExtent
        ? clampPosition(nextPosition, currentExtent)
        : nextPosition;
    return {
        position: {
            x: positionAbsolute.x - parentPosition.x,
            y: positionAbsolute.y - parentPosition.y,
        },
        positionAbsolute,
    };
}
// returns two params:
// 1. the dragged node (or the first of the list, if we are dragging a node selection)
// 2. array of selected nodes (for multi selections)
function getEventHandlerParams({ nodeId, dragItems, nodeInternals, }) {
    const extentedDragItems = dragItems.map((n) => {
        const node = nodeInternals.get(n.id);
        return {
            ...node,
            position: n.position,
            positionAbsolute: n.positionAbsolute,
        };
    });
    return [nodeId ? extentedDragItems.find((n) => n.id === nodeId) : extentedDragItems[0], extentedDragItems];
}

const getHandleBounds = (selector, nodeElement, zoom, nodeOrigin) => {
    const handles = nodeElement.querySelectorAll(selector);
    if (!handles || !handles.length) {
        return null;
    }
    const handlesArray = Array.from(handles);
    const nodeBounds = nodeElement.getBoundingClientRect();
    const nodeOffset = {
        x: nodeBounds.width * nodeOrigin[0],
        y: nodeBounds.height * nodeOrigin[1],
    };
    return handlesArray.map((handle) => {
        const handleBounds = handle.getBoundingClientRect();
        return {
            id: handle.getAttribute('data-handleid'),
            position: handle.getAttribute('data-handlepos'),
            x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
            y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
            ...getDimensions(handle),
        };
    });
};
function getMouseHandler(id, getState, handler) {
    return handler === undefined
        ? handler
        : (event) => {
            const node = getState().nodeInternals.get(id);
            handler(event, { ...node });
        };
}
// this handler is called by
// 1. the click handler when node is not draggable or selectNodesOnDrag = false
// or
// 2. the on drag start handler when node is draggable and selectNodesOnDrag = true
function handleNodeClick({ id, store, unselect = false, }) {
    const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals } = store.getState();
    const node = nodeInternals.get(id);
    store.setState({ nodesSelectionActive: false });
    if (!node.selected) {
        addSelectedNodes([id]);
    }
    else if (unselect || (node.selected && multiSelectionActive)) {
        unselectNodesAndEdges({ nodes: [node] });
    }
}

function useGetPointerPosition() {
    const store = useStoreApi();
    // returns the pointer position projected to the RF coordinate system
    const getPointerPosition = useCallback(({ sourceEvent }) => {
        const { transform, snapGrid, snapToGrid } = store.getState();
        const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
        const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
        const pointerPos = {
            x: (x - transform[0]) / transform[2],
            y: (y - transform[1]) / transform[2],
        };
        // we need the snapped position in order to be able to skip unnecessary drag events
        return {
            xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
            ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
            ...pointerPos,
        };
    }, []);
    return getPointerPosition;
}

function wrapSelectionDragFunc(selectionFunc) {
    return (event, _, nodes) => selectionFunc?.(event, nodes);
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, selectNodesOnDrag, }) {
    const [dragging, setDragging] = useState(false);
    const store = useStoreApi();
    const dragItems = useRef();
    const lastPos = useRef({ x: null, y: null });
    const getPointerPosition = useGetPointerPosition();
    useEffect(() => {
        if (nodeRef?.current) {
            const selection = select(nodeRef.current);
            if (disabled) {
                selection.on('.drag', null);
            }
            else {
                const dragHandler = drag()
                    .on('start', (event) => {
                    const { nodeInternals, multiSelectionActive, unselectNodesAndEdges, onNodeDragStart, onSelectionDragStart, } = store.getState();
                    const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);
                    if (!selectNodesOnDrag && !multiSelectionActive && nodeId) {
                        if (!nodeInternals.get(nodeId)?.selected) {
                            // we need to reset selected nodes when selectNodesOnDrag=false
                            unselectNodesAndEdges();
                        }
                    }
                    if (nodeId && isSelectable && selectNodesOnDrag) {
                        handleNodeClick({
                            id: nodeId,
                            store,
                        });
                    }
                    const pointerPos = getPointerPosition(event);
                    lastPos.current = pointerPos;
                    dragItems.current = getDragItems(nodeInternals, pointerPos, nodeId);
                    if (onStart && dragItems.current) {
                        const [currentNode, nodes] = getEventHandlerParams({
                            nodeId,
                            dragItems: dragItems.current,
                            nodeInternals,
                        });
                        onStart(event.sourceEvent, currentNode, nodes);
                    }
                })
                    .on('drag', (event) => {
                    const { updateNodePositions, nodeInternals, nodeExtent, onNodeDrag, onSelectionDrag, snapGrid, snapToGrid, nodeOrigin, } = store.getState();
                    const pointerPos = getPointerPosition(event);
                    // skip events without movement
                    if ((lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) &&
                        dragItems.current) {
                        lastPos.current = {
                            x: pointerPos.xSnapped,
                            y: pointerPos.ySnapped,
                        };
                        let hasChange = false;
                        dragItems.current = dragItems.current.map((n) => {
                            const nextPosition = { x: pointerPos.x - n.distance.x, y: pointerPos.y - n.distance.y };
                            if (snapToGrid) {
                                nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                                nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                            }
                            const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, nodeOrigin);
                            // we want to make sure that we only fire a change event when there is a changes
                            hasChange =
                                hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;
                            n.position = updatedPos.position;
                            n.positionAbsolute = updatedPos.positionAbsolute;
                            return n;
                        });
                        if (!hasChange) {
                            return;
                        }
                        const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);
                        updateNodePositions(dragItems.current, true, true);
                        setDragging(true);
                        if (onDrag) {
                            const [currentNode, nodes] = getEventHandlerParams({
                                nodeId,
                                dragItems: dragItems.current,
                                nodeInternals,
                            });
                            onDrag(event.sourceEvent, currentNode, nodes);
                        }
                    }
                })
                    .on('end', (event) => {
                    setDragging(false);
                    if (dragItems.current) {
                        const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
                        const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
                        updateNodePositions(dragItems.current, false, false);
                        if (onStop) {
                            const [currentNode, nodes] = getEventHandlerParams({
                                nodeId,
                                dragItems: dragItems.current,
                                nodeInternals,
                            });
                            onStop(event.sourceEvent, currentNode, nodes);
                        }
                    }
                })
                    .filter((event) => {
                    const target = event.target;
                    const isDraggable = !event.button &&
                        (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) &&
                        (!handleSelector || hasSelector(target, handleSelector, nodeRef));
                    return isDraggable;
                });
                selection.call(dragHandler);
                return () => {
                    selection.on('.drag', null);
                };
            }
        }
    }, [
        nodeRef,
        disabled,
        noDragClassName,
        handleSelector,
        isSelectable,
        store,
        nodeId,
        selectNodesOnDrag,
        getPointerPosition,
    ]);
    return dragging;
}

function useUpdateNodePositions() {
    const store = useStoreApi();
    const updatePositions = useCallback((params) => {
        const { nodeInternals, nodeExtent, updateNodePositions, getNodes, snapToGrid, snapGrid } = store.getState();
        const selectedNodes = getNodes().filter((n) => n.selected);
        // by default a node moves 5px on each key press, or 20px if shift is pressed
        // if snap grid is enabled, we use that for the velocity.
        const xVelo = snapToGrid ? snapGrid[0] : 5;
        const yVelo = snapToGrid ? snapGrid[1] : 5;
        const factor = params.isShiftPressed ? 4 : 1;
        const positionDiffX = params.x * xVelo * factor;
        const positionDiffY = params.y * yVelo * factor;
        const nodeUpdates = selectedNodes.map((n) => {
            if (n.positionAbsolute) {
                const nextPosition = { x: n.positionAbsolute.x + positionDiffX, y: n.positionAbsolute.y + positionDiffY };
                if (snapToGrid) {
                    nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                    nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                }
                const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent);
                n.position = updatedPos.position;
                n.positionAbsolute = updatedPos.positionAbsolute;
            }
            return n;
        });
        updateNodePositions(nodeUpdates, true, false);
    }, []);
    return updatePositions;
}

const arrowKeyDiffs = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
};
var wrapNode = (NodeComponent) => {
    const NodeWrapper = ({ id, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId, }) => {
        const store = useStoreApi();
        const nodeRef = useRef(null);
        const prevSourcePosition = useRef(sourcePosition);
        const prevTargetPosition = useRef(targetPosition);
        const prevType = useRef(type);
        const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
        const updatePositions = useUpdateNodePositions();
        const onMouseEnterHandler = getMouseHandler(id, store.getState, onMouseEnter);
        const onMouseMoveHandler = getMouseHandler(id, store.getState, onMouseMove);
        const onMouseLeaveHandler = getMouseHandler(id, store.getState, onMouseLeave);
        const onContextMenuHandler = getMouseHandler(id, store.getState, onContextMenu);
        const onDoubleClickHandler = getMouseHandler(id, store.getState, onDoubleClick);
        const onSelectNodeHandler = (event) => {
            if (isSelectable && (!selectNodesOnDrag || !isDraggable)) {
                // this handler gets called within the drag start event when selectNodesOnDrag=true
                handleNodeClick({
                    id,
                    store,
                });
            }
            if (onClick) {
                const node = store.getState().nodeInternals.get(id);
                onClick(event, { ...node });
            }
        };
        const onKeyDown = (event) => {
            if (isInputDOMNode(event)) {
                return;
            }
            if (elementSelectionKeys.includes(event.key) && isSelectable) {
                const unselect = event.key === 'Escape';
                if (unselect) {
                    nodeRef.current?.blur();
                }
                handleNodeClick({
                    id,
                    store,
                    unselect,
                });
            }
            else if (!disableKeyboardA11y &&
                isDraggable &&
                selected &&
                Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
                store.setState({
                    ariaLiveMessage: `Moved selected node ${event.key
                        .replace('Arrow', '')
                        .toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}`,
                });
                updatePositions({
                    x: arrowKeyDiffs[event.key].x,
                    y: arrowKeyDiffs[event.key].y,
                    isShiftPressed: event.shiftKey,
                });
            }
        };
        useEffect(() => {
            if (nodeRef.current && !hidden) {
                const currNode = nodeRef.current;
                resizeObserver?.observe(currNode);
                return () => resizeObserver?.unobserve(currNode);
            }
        }, [hidden]);
        useEffect(() => {
            // when the user programmatically changes the source or handle position, we re-initialize the node
            const typeChanged = prevType.current !== type;
            const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
            const targetPosChanged = prevTargetPosition.current !== targetPosition;
            if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
                if (typeChanged) {
                    prevType.current = type;
                }
                if (sourcePosChanged) {
                    prevSourcePosition.current = sourcePosition;
                }
                if (targetPosChanged) {
                    prevTargetPosition.current = targetPosition;
                }
                store.getState().updateNodeDimensions([{ id, nodeElement: nodeRef.current, forceUpdate: true }]);
            }
        }, [id, type, sourcePosition, targetPosition]);
        const dragging = useDrag({
            nodeRef,
            disabled: hidden || !isDraggable,
            noDragClassName,
            handleSelector: dragHandle,
            nodeId: id,
            isSelectable,
            selectNodesOnDrag,
        });
        if (hidden) {
            return null;
        }
        return (jsx("div", { className: cc([
                'react-flow__node',
                `react-flow__node-${type}`,
                {
                    // this is overwritable by passing `nopan` as a class name
                    [noPanClassName]: isDraggable,
                },
                className,
                {
                    selected,
                    selectable: isSelectable,
                    parent: isParent,
                    dragging,
                },
            ]), ref: nodeRef, style: {
                zIndex,
                transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
                pointerEvents: hasPointerEvents ? 'all' : 'none',
                visibility: initialized ? 'visible' : 'hidden',
                ...style,
            }, "data-id": id, "data-testid": `rf__node-${id}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : undefined, tabIndex: isFocusable ? 0 : undefined, role: isFocusable ? 'button' : undefined, "aria-describedby": disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": ariaLabel, children: jsx(Provider, { value: id, children: jsx(NodeComponent, { id: id, data: data, type: type, xPos: xPos, yPos: yPos, selected: selected, isConnectable: isConnectable, sourcePosition: sourcePosition, targetPosition: targetPosition, dragging: dragging, dragHandle: dragHandle, zIndex: zIndex }) }) }));
    };
    NodeWrapper.displayName = 'NodeWrapper';
    return memo(NodeWrapper);
};

function createNodeTypes(nodeTypes) {
    const standardTypes = {
        input: wrapNode((nodeTypes.input || InputNode$1)),
        default: wrapNode((nodeTypes.default || DefaultNode$1)),
        output: wrapNode((nodeTypes.output || OutputNode$1)),
        group: wrapNode((nodeTypes.group || GroupNode)),
    };
    const wrappedTypes = {};
    const specialTypes = Object.keys(nodeTypes)
        .filter((k) => !['input', 'default', 'output', 'group'].includes(k))
        .reduce((res, key) => {
        res[key] = wrapNode((nodeTypes[key] || DefaultNode$1));
        return res;
    }, wrappedTypes);
    return {
        ...standardTypes,
        ...specialTypes,
    };
}
const getPositionWithOrigin = ({ x, y, width, height, origin, }) => {
    if (!width || !height) {
        return { x, y };
    }
    if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
        devWarn('nodeOrigin must be between 0 and 1');
        return { x, y };
    }
    return {
        x: x - width * origin[0],
        y: y - height * origin[1],
    };
};

const doc = typeof document !== 'undefined' ? document : null;
// the keycode can be a string 'a' or an array of strings ['a', 'a+d']
// a string means a single key 'a' or a combination when '+' is used 'a+d'
// an array means different possibilites. Explainer: ['a', 'd+s'] here the
// user can use the single key 'a' or the combination 'd' + 's'
var useKeyPress = (keyCode = null, options = { target: doc }) => {
    const [keyPressed, setKeyPressed] = useState(false);
    // we need to remember the pressed keys in order to support combinations
    const pressedKeys = useRef(new Set([]));
    // keyCodes = array with single keys [['a']] or key combinations [['a', 's']]
    // keysToWatch = array with all keys flattened ['a', 'd', 'ShiftLeft']
    // used to check if we store event.code or event.key. When the code is in the list of keysToWatch
    // we use the code otherwise the key. Explainer: When you press the left "command" key, the code is "MetaLeft"
    // and the key is "Meta". We want users to be able to pass keys and codes so we assume that the key is meant when
    // we can't find it in the list of keysToWatch.
    const [keyCodes, keysToWatch] = useMemo(() => {
        if (keyCode !== null) {
            const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
            const keys = keyCodeArr.filter((kc) => typeof kc === 'string').map((kc) => kc.split('+'));
            const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
            return [keys, keysFlat];
        }
        return [[], []];
    }, [keyCode]);
    useEffect(() => {
        if (keyCode !== null) {
            const downHandler = (event) => {
                if (isInputDOMNode(event)) {
                    return false;
                }
                const keyOrCode = useKeyOrCode(event.code, keysToWatch);
                pressedKeys.current.add(event[keyOrCode]);
                if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
                    event.preventDefault();
                    setKeyPressed(true);
                }
            };
            const upHandler = (event) => {
                if (isInputDOMNode(event)) {
                    return false;
                }
                const keyOrCode = useKeyOrCode(event.code, keysToWatch);
                if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
                    setKeyPressed(false);
                    pressedKeys.current.clear();
                }
                else {
                    pressedKeys.current.delete(event[keyOrCode]);
                }
            };
            const resetHandler = () => {
                pressedKeys.current.clear();
                setKeyPressed(false);
            };
            options?.target?.addEventListener('keydown', downHandler);
            options?.target?.addEventListener('keyup', upHandler);
            window.addEventListener('blur', resetHandler);
            return () => {
                options?.target?.removeEventListener('keydown', downHandler);
                options?.target?.removeEventListener('keyup', upHandler);
                window.removeEventListener('blur', resetHandler);
            };
        }
    }, [keyCode, setKeyPressed]);
    return keyPressed;
};
// utils
function isMatchingKey(keyCodes, pressedKeys, isUp) {
    return (keyCodes
        // we only want to compare same sizes of keyCode definitions
        // and pressed keys. When the user specified 'Meta' as a key somewhere
        // this would also be truthy without this filter when user presses 'Meta' + 'r'
        .filter((keys) => isUp || keys.length === pressedKeys.size)
        // since we want to support multiple possibilities only one of the
        // combinations need to be part of the pressed keys
        .some((keys) => keys.every((k) => pressedKeys.has(k))));
}
function useKeyOrCode(eventCode, keysToWatch) {
    return keysToWatch.includes(eventCode) ? 'code' : 'key';
}

function calculateXYZPosition(node, nodeInternals, parentNodes, result, nodeOrigin) {
    if (!node.parentNode) {
        return result;
    }
    const parentNode = nodeInternals.get(node.parentNode);
    const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);
    return calculateXYZPosition(parentNode, nodeInternals, parentNodes, {
        x: (result.x ?? 0) + parentNodePosition.x,
        y: (result.y ?? 0) + parentNodePosition.y,
        z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    }, nodeOrigin);
}
function createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) {
    const nextNodeInternals = new Map();
    const parentNodes = {};
    const selectedNodeZ = elevateNodesOnSelect ? 1000 : 0;
    nodes.forEach((node) => {
        const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
        const currInternals = nodeInternals.get(node.id);
        const internals = {
            width: currInternals?.width,
            height: currInternals?.height,
            ...node,
            positionAbsolute: {
                x: node.position.x,
                y: node.position.y,
            },
        };
        if (node.parentNode) {
            internals.parentNode = node.parentNode;
            parentNodes[node.parentNode] = true;
        }
        Object.defineProperty(internals, internalsSymbol, {
            enumerable: false,
            value: {
                handleBounds: currInternals?.[internalsSymbol]?.handleBounds,
                z,
            },
        });
        nextNodeInternals.set(node.id, internals);
    });
    nextNodeInternals.forEach((node) => {
        if (node.parentNode && !nextNodeInternals.has(node.parentNode)) {
            throw new Error(`Parent node ${node.parentNode} not found`);
        }
        if (node.parentNode || parentNodes[node.id]) {
            const { x, y, z } = calculateXYZPosition(node, nextNodeInternals, parentNodes, {
                ...node.position,
                z: node[internalsSymbol]?.z ?? 0,
            }, nodeOrigin);
            node.positionAbsolute = {
                x,
                y,
            };
            node[internalsSymbol].z = z;
            if (parentNodes[node.id]) {
                node[internalsSymbol].isParent = true;
            }
        }
    });
    return nextNodeInternals;
}
function fitView(get, options = {}) {
    const { getNodes, width, height, minZoom, maxZoom, d3Zoom, d3Selection, fitViewOnInitDone, fitViewOnInit, nodeOrigin, } = get();
    if ((options.initial && !fitViewOnInitDone && fitViewOnInit) || !options.initial) {
        if (d3Zoom && d3Selection) {
            const nodes = getNodes().filter((n) => (options.includeHiddenNodes ? n.width && n.height : !n.hidden));
            const nodesInitialized = nodes.every((n) => n.width && n.height);
            if (nodes.length > 0 && nodesInitialized) {
                const bounds = getRectOfNodes(nodes, nodeOrigin);
                const [x, y, zoom] = getTransformForBounds(bounds, width, height, options.minZoom ?? minZoom, options.maxZoom ?? maxZoom, options.padding ?? 0.1);
                const nextTransform = zoomIdentity.translate(x, y).scale(zoom);
                if (typeof options.duration === 'number' && options.duration > 0) {
                    d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
                }
                else {
                    d3Zoom.transform(d3Selection, nextTransform);
                }
                return true;
            }
        }
    }
    return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
    nodeChanges.forEach((change) => {
        const node = nodeInternals.get(change.id);
        if (node) {
            nodeInternals.set(node.id, {
                ...node,
                [internalsSymbol]: node[internalsSymbol],
                selected: change.selected,
            });
        }
    });
    return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
    return edges.map((e) => {
        const change = edgeChanges.find((change) => change.id === e.id);
        if (change) {
            e.selected = change.selected;
        }
        return e;
    });
}
function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }) {
    const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();
    if (changedNodes?.length) {
        if (hasDefaultNodes) {
            set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
        }
        onNodesChange?.(changedNodes);
    }
    if (changedEdges?.length) {
        if (hasDefaultEdges) {
            set({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
        }
        onEdgesChange?.(changedEdges);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };
const initialViewportHelper = {
    zoomIn: noop,
    zoomOut: noop,
    zoomTo: noop,
    getZoom: () => 1,
    setViewport: noop,
    getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
    fitView: noop,
    setCenter: noop,
    fitBounds: noop,
    project: (position) => position,
    viewportInitialized: false,
};
const selector$a = (s) => ({
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection,
});
const useViewportHelper = () => {
    const store = useStoreApi();
    const { d3Zoom, d3Selection } = useStore(selector$a, shallow);
    const viewportHelperFunctions = useMemo(() => {
        if (d3Selection && d3Zoom) {
            return {
                zoomIn: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1.2),
                zoomOut: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1 / 1.2),
                zoomTo: (zoomLevel, options) => d3Zoom.scaleTo(getD3Transition(d3Selection, options?.duration), zoomLevel),
                getZoom: () => store.getState().transform[2],
                setViewport: (transform, options) => {
                    const [x, y, zoom] = store.getState().transform;
                    const nextTransform = zoomIdentity
                        .translate(transform.x ?? x, transform.y ?? y)
                        .scale(transform.zoom ?? zoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), nextTransform);
                },
                getViewport: () => {
                    const [x, y, zoom] = store.getState().transform;
                    return { x, y, zoom };
                },
                fitView: (options) => fitView(store.getState, options),
                setCenter: (x, y, options) => {
                    const { width, height, maxZoom } = store.getState();
                    const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
                    const centerX = width / 2 - x * nextZoom;
                    const centerY = height / 2 - y * nextZoom;
                    const transform = zoomIdentity.translate(centerX, centerY).scale(nextZoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
                },
                fitBounds: (bounds, options) => {
                    const { width, height, minZoom, maxZoom } = store.getState();
                    const [x, y, zoom] = getTransformForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);
                    const transform = zoomIdentity.translate(x, y).scale(zoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
                },
                project: (position) => {
                    const { transform, snapToGrid, snapGrid } = store.getState();
                    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
                },
                viewportInitialized: true,
            };
        }
        return initialViewportHelper;
    }, [d3Zoom, d3Selection]);
    return viewportHelperFunctions;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function useReactFlow() {
    const viewportHelper = useViewportHelper();
    const store = useStoreApi();
    const getNodes = useCallback(() => {
        return store
            .getState()
            .getNodes()
            .map((n) => ({ ...n }));
    }, []);
    const getNode = useCallback((id) => {
        return store.getState().nodeInternals.get(id);
    }, []);
    const getEdges = useCallback(() => {
        const { edges = [] } = store.getState();
        return edges.map((e) => ({ ...e }));
    }, []);
    const getEdge = useCallback((id) => {
        const { edges = [] } = store.getState();
        return edges.find((e) => e.id === id);
    }, []);
    const setNodes = useCallback((payload) => {
        const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
        const nodes = getNodes();
        const nextNodes = typeof payload === 'function' ? payload(nodes) : payload;
        if (hasDefaultNodes) {
            setNodes(nextNodes);
        }
        else if (onNodesChange) {
            const changes = nextNodes.length === 0
                ? nodes.map((node) => ({ type: 'remove', id: node.id }))
                : nextNodes.map((node) => ({ item: node, type: 'reset' }));
            onNodesChange(changes);
        }
    }, []);
    const setEdges = useCallback((payload) => {
        const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
        const nextEdges = typeof payload === 'function' ? payload(edges) : payload;
        if (hasDefaultEdges) {
            setEdges(nextEdges);
        }
        else if (onEdgesChange) {
            const changes = nextEdges.length === 0
                ? edges.map((edge) => ({ type: 'remove', id: edge.id }))
                : nextEdges.map((edge) => ({ item: edge, type: 'reset' }));
            onEdgesChange(changes);
        }
    }, []);
    const addNodes = useCallback((payload) => {
        const nodes = Array.isArray(payload) ? payload : [payload];
        const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
        if (hasDefaultNodes) {
            const currentNodes = getNodes();
            const nextNodes = [...currentNodes, ...nodes];
            setNodes(nextNodes);
        }
        else if (onNodesChange) {
            const changes = nodes.map((node) => ({ item: node, type: 'add' }));
            onNodesChange(changes);
        }
    }, []);
    const addEdges = useCallback((payload) => {
        const nextEdges = Array.isArray(payload) ? payload : [payload];
        const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
        if (hasDefaultEdges) {
            setEdges([...edges, ...nextEdges]);
        }
        else if (onEdgesChange) {
            const changes = nextEdges.map((edge) => ({ item: edge, type: 'add' }));
            onEdgesChange(changes);
        }
    }, []);
    const toObject = useCallback(() => {
        const { getNodes, edges = [], transform } = store.getState();
        const [x, y, zoom] = transform;
        return {
            nodes: getNodes().map((n) => ({ ...n })),
            edges: edges.map((e) => ({ ...e })),
            viewport: {
                x,
                y,
                zoom,
            },
        };
    }, []);
    const deleteElements = useCallback(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
        const { nodeInternals, getNodes, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete, onNodesChange, onEdgesChange, } = store.getState();
        const nodeIds = (nodesDeleted || []).map((node) => node.id);
        const edgeIds = (edgesDeleted || []).map((edge) => edge.id);
        const nodesToRemove = getNodes().reduce((res, node) => {
            const parentHit = !nodeIds.includes(node.id) && node.parentNode && res.find((n) => n.id === node.parentNode);
            const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
            if (deletable && (nodeIds.includes(node.id) || parentHit)) {
                res.push(node);
            }
            return res;
        }, []);
        const deletableEdges = edges.filter((e) => (typeof e.deletable === 'boolean' ? e.deletable : true));
        const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
        if (nodesToRemove || initialHitEdges) {
            const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
            const edgesToRemove = [...initialHitEdges, ...connectedEdges];
            const edgeIdsToRemove = edgesToRemove.reduce((res, edge) => {
                if (!res.includes(edge.id)) {
                    res.push(edge.id);
                }
                return res;
            }, []);
            if (hasDefaultEdges || hasDefaultNodes) {
                if (hasDefaultEdges) {
                    store.setState({
                        edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)),
                    });
                }
                if (hasDefaultNodes) {
                    nodesToRemove.forEach((node) => {
                        nodeInternals.delete(node.id);
                    });
                    store.setState({
                        nodeInternals: new Map(nodeInternals),
                    });
                }
            }
            if (edgeIdsToRemove.length > 0) {
                onEdgesDelete?.(edgesToRemove);
                if (onEdgesChange) {
                    onEdgesChange(edgeIdsToRemove.map((id) => ({
                        id,
                        type: 'remove',
                    })));
                }
            }
            if (nodesToRemove.length > 0) {
                onNodesDelete?.(nodesToRemove);
                if (onNodesChange) {
                    const nodeChanges = nodesToRemove.map((n) => ({ id: n.id, type: 'remove' }));
                    onNodesChange(nodeChanges);
                }
            }
        }
    }, []);
    const getNodeRect = useCallback((nodeOrRect) => {
        const isRect = isRectObject(nodeOrRect);
        const node = isRect ? null : store.getState().nodeInternals.get(nodeOrRect.id);
        const nodeRect = isRect ? nodeOrRect : nodeToRect(node);
        return [nodeRect, node, isRect];
    }, []);
    const getIntersectingNodes = useCallback((nodeOrRect, partially = true, nodes) => {
        const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);
        if (!nodeRect) {
            return [];
        }
        return (nodes || store.getState().getNodes()).filter((n) => {
            if (!isRect && (n.id === node.id || !n.positionAbsolute)) {
                return false;
            }
            const currNodeRect = nodeToRect(n);
            const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
            const partiallyVisible = partially && overlappingArea > 0;
            return partiallyVisible || overlappingArea >= nodeOrRect.width * nodeOrRect.height;
        });
    }, []);
    const isNodeIntersecting = useCallback((nodeOrRect, area, partially = true) => {
        const [nodeRect] = getNodeRect(nodeOrRect);
        if (!nodeRect) {
            return false;
        }
        const overlappingArea = getOverlappingArea(nodeRect, area);
        const partiallyVisible = partially && overlappingArea > 0;
        return partiallyVisible || overlappingArea >= nodeOrRect.width * nodeOrRect.height;
    }, []);
    return useMemo(() => {
        return {
            ...viewportHelper,
            getNodes,
            getNode,
            getEdges,
            getEdge,
            setNodes,
            setEdges,
            addNodes,
            addEdges,
            toObject,
            deleteElements,
            getIntersectingNodes,
            isNodeIntersecting,
        };
    }, [
        viewportHelper,
        getNodes,
        getNode,
        getEdges,
        getEdge,
        setNodes,
        setEdges,
        addNodes,
        addEdges,
        toObject,
        deleteElements,
        getIntersectingNodes,
        isNodeIntersecting,
    ]);
}

var useGlobalKeyHandler = ({ deleteKeyCode, multiSelectionKeyCode }) => {
    const store = useStoreApi();
    const { deleteElements } = useReactFlow();
    const deleteKeyPressed = useKeyPress(deleteKeyCode);
    const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
    useEffect(() => {
        if (deleteKeyPressed) {
            const { edges, getNodes } = store.getState();
            const selectedNodes = getNodes().filter((node) => node.selected);
            const selectedEdges = edges.filter((edge) => edge.selected);
            deleteElements({ nodes: selectedNodes, edges: selectedEdges });
            store.setState({ nodesSelectionActive: false });
        }
    }, [deleteKeyPressed]);
    useEffect(() => {
        store.setState({ multiSelectionActive: multiSelectionKeyPressed });
    }, [multiSelectionKeyPressed]);
};

function useResizeHandler(rendererNode) {
    const store = useStoreApi();
    useEffect(() => {
        let resizeObserver;
        const updateDimensions = () => {
            if (!rendererNode.current) {
                return;
            }
            const size = getDimensions(rendererNode.current);
            if (size.height === 0 || size.width === 0) {
                devWarn('The React Flow parent container needs a width and a height to render the graph. Help: https://reactflow.dev/error#400');
            }
            store.setState({ width: size.width || 500, height: size.height || 500 });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        if (rendererNode.current) {
            resizeObserver = new ResizeObserver(() => updateDimensions());
            resizeObserver.observe(rendererNode.current);
        }
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (resizeObserver && rendererNode.current) {
                resizeObserver.unobserve(rendererNode.current);
            }
        };
    }, []);
}

const containerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
};

const viewChanged = (prevViewport, eventViewport) => prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;
const eventToFlowTransform = (eventViewport) => ({
    x: eventViewport.x,
    y: eventViewport.y,
    zoom: eventViewport.k,
});
const isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
const isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
const selector$9 = (s) => ({
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection,
    d3ZoomHandler: s.d3ZoomHandler,
    userSelectionActive: s.userSelectionActive,
});
const ZoomPane = ({ onMove, onMoveStart, onMoveEnd, onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, elementsSelectable, panOnDrag = true, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children, noWheelClassName, noPanClassName, }) => {
    const timerId = useRef();
    const store = useStoreApi();
    const isZoomingOrPanning = useRef(false);
    const zoomedWithRightMouseButton = useRef(false);
    const zoomPane = useRef(null);
    const prevTransform = useRef({ x: 0, y: 0, zoom: 0 });
    const { d3Zoom, d3Selection, d3ZoomHandler, userSelectionActive } = useStore(selector$9, shallow);
    const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
    useResizeHandler(zoomPane);
    useEffect(() => {
        if (zoomPane.current) {
            const bbox = zoomPane.current.getBoundingClientRect();
            const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
            const selection = select(zoomPane.current).call(d3ZoomInstance);
            const updatedTransform = zoomIdentity
                .translate(defaultViewport.x, defaultViewport.y)
                .scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
            const extent = [
                [0, 0],
                [bbox.width, bbox.height],
            ];
            const constrainedTransform = d3ZoomInstance.constrain()(updatedTransform, extent, translateExtent);
            d3ZoomInstance.transform(selection, constrainedTransform);
            store.setState({
                d3Zoom: d3ZoomInstance,
                d3Selection: selection,
                d3ZoomHandler: selection.on('wheel.zoom'),
                // we need to pass transform because zoom handler is not registered when we set the initial transform
                transform: [constrainedTransform.x, constrainedTransform.y, constrainedTransform.k],
                domNode: zoomPane.current.closest('.react-flow'),
            });
        }
    }, []);
    useEffect(() => {
        if (d3Selection && d3Zoom) {
            if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) {
                d3Selection.on('wheel.zoom', (event) => {
                    if (isWrappedWithClass(event, noWheelClassName)) {
                        return false;
                    }
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    const currentZoom = d3Selection.property('__zoom').k || 1;
                    if (event.ctrlKey && zoomOnPinch) {
                        const point = pointer(event);
                        // taken from https://github.com/d3/d3-zoom/blob/master/src/zoom.js
                        const pinchDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * 10;
                        const zoom = currentZoom * Math.pow(2, pinchDelta);
                        d3Zoom.scaleTo(d3Selection, zoom, point);
                        return;
                    }
                    // increase scroll speed in firefox
                    // firefox: deltaMode === 1; chrome: deltaMode === 0
                    const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
                    const deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
                    const deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
                    d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed);
                });
            }
            else if (typeof d3ZoomHandler !== 'undefined') {
                d3Selection.on('wheel.zoom', function (event, d) {
                    if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
                        return null;
                    }
                    event.preventDefault();
                    d3ZoomHandler.call(this, event, d);
                });
            }
        }
    }, [
        userSelectionActive,
        panOnScroll,
        panOnScrollMode,
        d3Selection,
        d3Zoom,
        d3ZoomHandler,
        zoomActivationKeyPressed,
        zoomOnPinch,
        preventScrolling,
        noWheelClassName,
    ]);
    useEffect(() => {
        if (d3Zoom) {
            if (userSelectionActive && !isZoomingOrPanning.current) {
                d3Zoom.on('zoom', null);
            }
            else if (!userSelectionActive) {
                d3Zoom.on('zoom', (event) => {
                    const { onViewportChange } = store.getState();
                    store.setState({ transform: [event.transform.x, event.transform.y, event.transform.k] });
                    zoomedWithRightMouseButton.current = !!(onPaneContextMenu && isRightClickPan(panOnDrag, event.sourceEvent?.button));
                    if (onMove || onViewportChange) {
                        const flowTransform = eventToFlowTransform(event.transform);
                        onViewportChange?.(flowTransform);
                        onMove?.(event.sourceEvent, flowTransform);
                    }
                });
            }
        }
    }, [userSelectionActive, d3Zoom, onMove, panOnDrag, onPaneContextMenu]);
    useEffect(() => {
        if (d3Zoom) {
            d3Zoom.on('start', (event) => {
                if (!event.sourceEvent) {
                    return null;
                }
                const { onViewportChangeStart } = store.getState();
                isZoomingOrPanning.current = true;
                if (event.sourceEvent?.type === 'mousedown') {
                    store.setState({ paneDragging: true });
                }
                if (onMoveStart || onViewportChangeStart) {
                    const flowTransform = eventToFlowTransform(event.transform);
                    prevTransform.current = flowTransform;
                    onViewportChangeStart?.(flowTransform);
                    onMoveStart?.(event.sourceEvent, flowTransform);
                }
            });
        }
    }, [d3Zoom, onMoveStart]);
    useEffect(() => {
        if (d3Zoom) {
            d3Zoom.on('end', (event) => {
                if (!event.sourceEvent) {
                    return null;
                }
                const { onViewportChangeEnd } = store.getState();
                isZoomingOrPanning.current = false;
                store.setState({ paneDragging: false });
                if (onPaneContextMenu &&
                    isRightClickPan(panOnDrag, event.sourceEvent?.button) &&
                    !zoomedWithRightMouseButton.current) {
                    onPaneContextMenu(event.sourceEvent);
                }
                zoomedWithRightMouseButton.current = false;
                if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
                    const flowTransform = eventToFlowTransform(event.transform);
                    prevTransform.current = flowTransform;
                    clearTimeout(timerId.current);
                    timerId.current = setTimeout(() => {
                        onViewportChangeEnd?.(flowTransform);
                        onMoveEnd?.(event.sourceEvent, flowTransform);
                    }, panOnScroll ? 150 : 0);
                }
            });
        }
    }, [d3Zoom, panOnScroll, panOnDrag, onMoveEnd, onPaneContextMenu]);
    useEffect(() => {
        if (d3Zoom) {
            d3Zoom.filter((event) => {
                const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
                const pinchZoom = zoomOnPinch && event.ctrlKey;
                if (event.button === 1 &&
                    event.type === 'mousedown' &&
                    (isWrappedWithClass(event, 'react-flow__node') || isWrappedWithClass(event, 'react-flow__edge'))) {
                    return true;
                }
                // if all interactions are disabled, we prevent all zoom events
                if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
                    return false;
                }
                // during a selection we prevent all other interactions
                if (userSelectionActive) {
                    return false;
                }
                // if zoom on double click is disabled, we prevent the double click event
                if (!zoomOnDoubleClick && event.type === 'dblclick') {
                    return false;
                }
                // if the target element is inside an element with the nowheel class, we prevent zooming
                if (isWrappedWithClass(event, noWheelClassName) && event.type === 'wheel') {
                    return false;
                }
                // if the target element is inside an element with the nopan class, we prevent panning
                if (isWrappedWithClass(event, noPanClassName) && event.type !== 'wheel') {
                    return false;
                }
                if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
                    return false;
                }
                // when there is no scroll handling enabled, we prevent all wheel events
                if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
                    return false;
                }
                // if the pane is not movable, we prevent dragging it with mousestart or touchstart
                if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
                    return false;
                }
                // if the pane is only movable using allowed clicks
                if (Array.isArray(panOnDrag) &&
                    !panOnDrag.includes(event.button) &&
                    (event.type === 'mousedown' || event.type === 'touchstart')) {
                    return false;
                }
                // We only allow right clicks if pan on drag is set to right click
                const buttonAllowed = (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;
                // default filter for d3-zoom
                return (!event.ctrlKey || event.type === 'wheel') && buttonAllowed;
            });
        }
    }, [
        userSelectionActive,
        d3Zoom,
        zoomOnScroll,
        zoomOnPinch,
        panOnScroll,
        zoomOnDoubleClick,
        panOnDrag,
        elementsSelectable,
        zoomActivationKeyPressed,
    ]);
    return (jsx("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle, children: children }));
};

const selector$8 = (s) => ({
    userSelectionActive: s.userSelectionActive,
    userSelectionRect: s.userSelectionRect,
});
function UserSelection() {
    const { userSelectionActive, userSelectionRect } = useStore(selector$8, shallow);
    const showSelectionBox = userSelectionActive && userSelectionRect;
    if (!showSelectionBox) {
        return null;
    }
    return (jsx("div", { className: "react-flow__selection react-flow__container", style: {
            width: userSelectionRect.width,
            height: userSelectionRect.height,
            transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
        } }));
}

function handleParentExpand(res, updateItem) {
    const parent = res.find((e) => e.id === updateItem.parentNode);
    if (parent) {
        const extendWidth = updateItem.position.x + updateItem.width - parent.width;
        const extendHeight = updateItem.position.y + updateItem.height - parent.height;
        if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
            parent.style = { ...parent.style } || {};
            parent.style.width = parent.style.width ?? parent.width;
            parent.style.height = parent.style.height ?? parent.height;
            if (extendWidth > 0) {
                parent.style.width += extendWidth;
            }
            if (extendHeight > 0) {
                parent.style.height += extendHeight;
            }
            if (updateItem.position.x < 0) {
                const xDiff = Math.abs(updateItem.position.x);
                parent.position.x = parent.position.x - xDiff;
                parent.style.width += xDiff;
                updateItem.position.x = 0;
            }
            if (updateItem.position.y < 0) {
                const yDiff = Math.abs(updateItem.position.y);
                parent.position.y = parent.position.y - yDiff;
                parent.style.height += yDiff;
                updateItem.position.y = 0;
            }
            parent.width = parent.style.width;
            parent.height = parent.style.height;
        }
    }
}
function applyChanges(changes, elements) {
    // we need this hack to handle the setNodes and setEdges function of the useReactFlow hook for controlled flows
    if (changes.some((c) => c.type === 'reset')) {
        return changes.filter((c) => c.type === 'reset').map((c) => c.item);
    }
    const initElements = changes.filter((c) => c.type === 'add').map((c) => c.item);
    return elements.reduce((res, item) => {
        const currentChanges = changes.filter((c) => c.id === item.id);
        if (currentChanges.length === 0) {
            res.push(item);
            return res;
        }
        const updateItem = { ...item };
        for (const currentChange of currentChanges) {
            if (currentChange) {
                switch (currentChange.type) {
                    case 'select': {
                        updateItem.selected = currentChange.selected;
                        break;
                    }
                    case 'position': {
                        if (typeof currentChange.position !== 'undefined') {
                            updateItem.position = currentChange.position;
                        }
                        if (typeof currentChange.positionAbsolute !== 'undefined') {
                            updateItem.positionAbsolute = currentChange.positionAbsolute;
                        }
                        if (typeof currentChange.dragging !== 'undefined') {
                            updateItem.dragging = currentChange.dragging;
                        }
                        if (updateItem.expandParent) {
                            handleParentExpand(res, updateItem);
                        }
                        break;
                    }
                    case 'dimensions': {
                        if (typeof currentChange.dimensions !== 'undefined') {
                            updateItem.width = currentChange.dimensions.width;
                            updateItem.height = currentChange.dimensions.height;
                        }
                        if (typeof currentChange.updateStyle !== 'undefined') {
                            updateItem.style = { ...(updateItem.style || {}), ...currentChange.dimensions };
                        }
                        if (typeof currentChange.resizing === 'boolean') {
                            updateItem.resizing = currentChange.resizing;
                        }
                        if (updateItem.expandParent) {
                            handleParentExpand(res, updateItem);
                        }
                        break;
                    }
                    case 'remove': {
                        return res;
                    }
                }
            }
        }
        res.push(updateItem);
        return res;
    }, initElements);
}
function applyNodeChanges(changes, nodes) {
    return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
    return applyChanges(changes, edges);
}
const createSelectionChange = (id, selected) => ({
    id,
    type: 'select',
    selected,
});
function getSelectionChanges(items, selectedIds) {
    return items.reduce((res, item) => {
        const willBeSelected = selectedIds.includes(item.id);
        if (!item.selected && willBeSelected) {
            item.selected = true;
            res.push(createSelectionChange(item.id, true));
        }
        else if (item.selected && !willBeSelected) {
            item.selected = false;
            res.push(createSelectionChange(item.id, false));
        }
        return res;
    }, []);
}

function getMousePosition(event, containerBounds) {
    return {
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top,
    };
}
const wrapHandler = (handler, containerRef) => {
    return (event) => {
        if (event.target !== containerRef.current) {
            return;
        }
        handler?.(event);
    };
};
const selector$7 = (s) => ({
    userSelectionActive: s.userSelectionActive,
    elementsSelectable: s.elementsSelectable,
    dragging: s.paneDragging,
});
const Pane = memo(({ isSelecting, selectionMode = SelectionMode.Full, panOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children, }) => {
    const container = useRef(null);
    const store = useStoreApi();
    const prevSelectedNodesCount = useRef(0);
    const prevSelectedEdgesCount = useRef(0);
    const containerBounds = useRef();
    const { userSelectionActive, elementsSelectable, dragging } = useStore(selector$7, shallow);
    const resetUserSelection = () => {
        store.setState({ userSelectionActive: false, userSelectionRect: null });
        prevSelectedNodesCount.current = 0;
        prevSelectedEdgesCount.current = 0;
    };
    const onClick = (event) => {
        onPaneClick?.(event);
        store.getState().resetSelectedElements();
        store.setState({ nodesSelectionActive: false });
    };
    const onContextMenu = (event) => {
        if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
            event.preventDefault();
            return;
        }
        onPaneContextMenu?.(event);
    };
    const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : undefined;
    const onMouseDown = (event) => {
        const { resetSelectedElements, domNode } = store.getState();
        containerBounds.current = domNode?.getBoundingClientRect();
        if (!elementsSelectable ||
            !isSelecting ||
            event.button !== 0 ||
            event.target !== container.current ||
            !containerBounds.current) {
            return;
        }
        const { x, y } = getMousePosition(event, containerBounds.current);
        resetSelectedElements();
        store.setState({
            userSelectionRect: {
                width: 0,
                height: 0,
                startX: x,
                startY: y,
                x,
                y,
            },
        });
        onSelectionStart?.(event);
    };
    const onMouseMove = (event) => {
        const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin, getNodes } = store.getState();
        if (!isSelecting || !containerBounds.current || !userSelectionRect) {
            return;
        }
        store.setState({ userSelectionActive: true, nodesSelectionActive: false });
        const mousePos = getMousePosition(event, containerBounds.current);
        const startX = userSelectionRect.startX ?? 0;
        const startY = userSelectionRect.startY ?? 0;
        const nextUserSelectRect = {
            ...userSelectionRect,
            x: mousePos.x < startX ? mousePos.x : startX,
            y: mousePos.y < startY ? mousePos.y : startY,
            width: Math.abs(mousePos.x - startX),
            height: Math.abs(mousePos.y - startY),
        };
        const nodes = getNodes();
        const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, selectionMode === SelectionMode.Partial, true, nodeOrigin);
        const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
        const selectedNodeIds = selectedNodes.map((n) => n.id);
        if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
            prevSelectedNodesCount.current = selectedNodeIds.length;
            const changes = getSelectionChanges(nodes, selectedNodeIds);
            if (changes.length) {
                onNodesChange?.(changes);
            }
        }
        if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
            prevSelectedEdgesCount.current = selectedEdgeIds.length;
            const changes = getSelectionChanges(edges, selectedEdgeIds);
            if (changes.length) {
                onEdgesChange?.(changes);
            }
        }
        store.setState({
            userSelectionRect: nextUserSelectRect,
        });
    };
    const onMouseUp = (event) => {
        const { userSelectionRect } = store.getState();
        // We only want to trigger click functions when in selection mode if
        // the user did not move the mouse.
        if (!userSelectionActive && userSelectionRect && event.target === container.current) {
            onClick?.(event);
        }
        store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
        resetUserSelection();
        onSelectionEnd?.(event);
    };
    const onMouseLeave = (event) => {
        if (userSelectionActive) {
            store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
            onSelectionEnd?.(event);
        }
        resetUserSelection();
    };
    const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);
    return (jsxs("div", { className: cc(['react-flow__pane', { dragging, selection: isSelecting }]), onClick: hasActiveSelection ? undefined : wrapHandler(onClick, container), onContextMenu: wrapHandler(onContextMenu, container), onWheel: wrapHandler(onWheel, container), onMouseEnter: hasActiveSelection ? undefined : onPaneMouseEnter, onMouseDown: hasActiveSelection ? onMouseDown : undefined, onMouseMove: hasActiveSelection ? onMouseMove : onPaneMouseMove, onMouseUp: hasActiveSelection ? onMouseUp : undefined, onMouseLeave: hasActiveSelection ? onMouseLeave : onPaneMouseLeave, ref: container, style: containerStyle, children: [children, jsx(UserSelection, {})] }));
});
Pane.displayName = 'Pane';

const selector$6 = (s) => ({
    transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
    userSelectionActive: s.userSelectionActive,
});
const bboxSelector = (s) => {
    const selectedNodes = s.getNodes().filter((n) => n.selected);
    return getRectOfNodes(selectedNodes, s.nodeOrigin);
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
    const store = useStoreApi();
    const { transformString, userSelectionActive } = useStore(selector$6, shallow);
    const { width, height, x: left, y: top } = useStore(bboxSelector, shallow);
    const updatePositions = useUpdateNodePositions();
    const nodeRef = useRef(null);
    useEffect(() => {
        if (!disableKeyboardA11y) {
            nodeRef.current?.focus({
                preventScroll: true,
            });
        }
    }, [disableKeyboardA11y]);
    useDrag({
        nodeRef,
    });
    if (userSelectionActive || !width || !height) {
        return null;
    }
    const onContextMenu = onSelectionContextMenu
        ? (event) => {
            const selectedNodes = store
                .getState()
                .getNodes()
                .filter((n) => n.selected);
            onSelectionContextMenu(event, selectedNodes);
        }
        : undefined;
    const onKeyDown = (event) => {
        if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
            updatePositions({
                x: arrowKeyDiffs[event.key].x,
                y: arrowKeyDiffs[event.key].y,
                isShiftPressed: event.shiftKey,
            });
        }
    };
    return (jsx("div", { className: cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName]), style: {
            transform: transformString,
        }, children: jsx("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu: onContextMenu, tabIndex: disableKeyboardA11y ? undefined : -1, onKeyDown: disableKeyboardA11y ? undefined : onKeyDown, style: {
                width,
                height,
                top,
                left,
            } }) }));
}
var NodesSelection$1 = memo(NodesSelection);

const selector$5 = (s) => s.nodesSelectionActive;
const FlowRenderer = ({ children, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y, }) => {
    const nodesSelectionActive = useStore(selector$5);
    const selectionKeyPressed = useKeyPress(selectionKeyCode);
    const panActivationKeyPressed = useKeyPress(panActivationKeyCode);
    const panOnDrag = panActivationKeyPressed || _panOnDrag;
    const isSelecting = selectionKeyPressed || (selectionOnDrag && panOnDrag !== true);
    useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
    return (jsx(ZoomPane, { onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onPaneContextMenu: onPaneContextMenu, elementsSelectable: elementsSelectable, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, zoomOnDoubleClick: zoomOnDoubleClick, panOnDrag: !selectionKeyPressed && panOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, zoomActivationKeyCode: zoomActivationKeyCode, preventScrolling: preventScrolling, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, children: jsxs(Pane, { onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, panOnDrag: panOnDrag, isSelecting: !!isSelecting, selectionMode: selectionMode, children: [children, nodesSelectionActive && (jsx(NodesSelection$1, { onSelectionContextMenu: onSelectionContextMenu, noPanClassName: noPanClassName, disableKeyboardA11y: disableKeyboardA11y }))] }) }));
};
FlowRenderer.displayName = 'FlowRenderer';
var FlowRenderer$1 = memo(FlowRenderer);

function useVisibleNodes(onlyRenderVisible) {
    const nodes = useStore(useCallback((s) => onlyRenderVisible
        ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
        : s.getNodes(), [onlyRenderVisible]));
    return nodes;
}

const selector$4 = (s) => ({
    nodesDraggable: s.nodesDraggable,
    nodesConnectable: s.nodesConnectable,
    nodesFocusable: s.nodesFocusable,
    elementsSelectable: s.elementsSelectable,
    updateNodeDimensions: s.updateNodeDimensions,
});
const NodeRenderer = (props) => {
    const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions } = useStore(selector$4, shallow);
    const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
    const resizeObserverRef = useRef();
    const resizeObserver = useMemo(() => {
        if (typeof ResizeObserver === 'undefined') {
            return null;
        }
        const observer = new ResizeObserver((entries) => {
            const updates = entries.map((entry) => ({
                id: entry.target.getAttribute('data-id'),
                nodeElement: entry.target,
                forceUpdate: true,
            }));
            updateNodeDimensions(updates);
        });
        resizeObserverRef.current = observer;
        return observer;
    }, []);
    useEffect(() => {
        return () => {
            resizeObserverRef?.current?.disconnect();
        };
    }, []);
    return (jsx("div", { className: "react-flow__nodes", style: containerStyle, children: nodes.map((node) => {
            let nodeType = node.type || 'default';
            if (!props.nodeTypes[nodeType]) {
                devWarn(`Node type "${nodeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`);
                nodeType = 'default';
            }
            const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default);
            const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
            const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
            const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
            const isFocusable = !!(node.focusable || (nodesFocusable && typeof node.focusable === 'undefined'));
            const clampedPosition = props.nodeExtent
                ? clampPosition(node.positionAbsolute, props.nodeExtent)
                : node.positionAbsolute;
            const posX = clampedPosition?.x ?? 0;
            const posY = clampedPosition?.y ?? 0;
            const posOrigin = getPositionWithOrigin({
                x: posX,
                y: posY,
                width: node.width ?? 0,
                height: node.height ?? 0,
                origin: props.nodeOrigin,
            });
            return (jsx(NodeComponent, { id: node.id, className: node.className, style: node.style, type: nodeType, data: node.data, sourcePosition: node.sourcePosition || Position.Bottom, targetPosition: node.targetPosition || Position.Top, hidden: node.hidden, xPos: posX, yPos: posY, xPosOrigin: posOrigin.x, yPosOrigin: posOrigin.y, selectNodesOnDrag: props.selectNodesOnDrag, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, selected: !!node.selected, isDraggable: isDraggable, isSelectable: isSelectable, isConnectable: isConnectable, isFocusable: isFocusable, resizeObserver: resizeObserver, dragHandle: node.dragHandle, zIndex: node[internalsSymbol]?.z ?? 0, isParent: !!node[internalsSymbol]?.isParent, noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, initialized: !!node.width && !!node.height, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, ariaLabel: node.ariaLabel }, node.id));
        }) }));
};
NodeRenderer.displayName = 'NodeRenderer';
var NodeRenderer$1 = memo(NodeRenderer);

const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];
function groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect = false) {
    let maxLevel = -1;
    const levelLookup = edges.reduce((tree, edge) => {
        const hasZIndex = isNumeric(edge.zIndex);
        let z = hasZIndex ? edge.zIndex : 0;
        if (elevateEdgesOnSelect) {
            z = hasZIndex
                ? edge.zIndex
                : Math.max(nodeInternals.get(edge.source)?.[internalsSymbol]?.z || 0, nodeInternals.get(edge.target)?.[internalsSymbol]?.z || 0);
        }
        if (tree[z]) {
            tree[z].push(edge);
        }
        else {
            tree[z] = [edge];
        }
        maxLevel = z > maxLevel ? z : maxLevel;
        return tree;
    }, {});
    const edgeTree = Object.entries(levelLookup).map(([key, edges]) => {
        const level = +key;
        return {
            edges,
            level,
            isMaxLevel: level === maxLevel,
        };
    });
    if (edgeTree.length === 0) {
        return defaultEdgeTree;
    }
    return edgeTree;
}
function useVisibleEdges(onlyRenderVisible, nodeInternals, elevateEdgesOnSelect) {
    const edges = useStore(useCallback((s) => {
        if (!onlyRenderVisible) {
            return s.edges;
        }
        return s.edges.filter((e) => {
            const sourceNode = nodeInternals.get(e.source);
            const targetNode = nodeInternals.get(e.target);
            return (sourceNode?.width &&
                sourceNode?.height &&
                targetNode?.width &&
                targetNode?.height &&
                isEdgeVisible({
                    sourcePos: sourceNode.positionAbsolute || { x: 0, y: 0 },
                    targetPos: targetNode.positionAbsolute || { x: 0, y: 0 },
                    sourceWidth: sourceNode.width,
                    sourceHeight: sourceNode.height,
                    targetWidth: targetNode.width,
                    targetHeight: targetNode.height,
                    width: s.width,
                    height: s.height,
                    transform: s.transform,
                }));
        });
    }, [onlyRenderVisible, nodeInternals]));
    return groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect);
}

const oppositePosition = {
    [Position.Left]: Position.Right,
    [Position.Right]: Position.Left,
    [Position.Top]: Position.Bottom,
    [Position.Bottom]: Position.Top,
};
const ConnectionLine = ({ connectionNodeId, connectionHandleType, connectionLineStyle, connectionLineType = ConnectionLineType.Bezier, isConnectable, CustomConnectionLineComponent, }) => {
    const { fromNode, handleId, toX, toY, connectionMode } = useStore(useCallback((s) => ({
        fromNode: s.nodeInternals.get(connectionNodeId),
        handleId: s.connectionHandleId,
        toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
        toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
        connectionMode: s.connectionMode,
    }), [connectionNodeId]), shallow);
    const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
    let handleBounds = fromHandleBounds?.[connectionHandleType];
    if (connectionMode === ConnectionMode.Loose) {
        handleBounds = handleBounds
            ? handleBounds
            : fromHandleBounds?.[connectionHandleType === 'source' ? 'target' : 'source'];
    }
    if (!fromNode || !isConnectable || !handleBounds) {
        return null;
    }
    const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
    const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode?.width ?? 0) / 2;
    const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode?.height ?? 0;
    const fromX = (fromNode?.positionAbsolute?.x || 0) + fromHandleX;
    const fromY = (fromNode?.positionAbsolute?.y || 0) + fromHandleY;
    const fromPosition = fromHandle?.position;
    if (!fromPosition) {
        return null;
    }
    const toPosition = oppositePosition[fromPosition];
    if (CustomConnectionLineComponent) {
        return (jsx("g", { className: "react-flow__connection", children: jsx(CustomConnectionLineComponent, { connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, fromNode: fromNode, fromHandle: fromHandle, fromX: fromX, fromY: fromY, toX: toX, toY: toY, fromPosition: fromPosition, toPosition: toPosition }) }));
    }
    let dAttr = '';
    const pathParams = {
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
    };
    if (connectionLineType === ConnectionLineType.Bezier) {
        // we assume the destination position is opposite to the source position
        [dAttr] = getBezierPath(pathParams);
    }
    else if (connectionLineType === ConnectionLineType.Step) {
        [dAttr] = getSmoothStepPath({
            ...pathParams,
            borderRadius: 0,
        });
    }
    else if (connectionLineType === ConnectionLineType.SmoothStep) {
        [dAttr] = getSmoothStepPath(pathParams);
    }
    else if (connectionLineType === ConnectionLineType.SimpleBezier) {
        [dAttr] = getSimpleBezierPath(pathParams);
    }
    else {
        dAttr = `M${fromX},${fromY} ${toX},${toY}`;
    }
    return (jsx("g", { className: "react-flow__connection", children: jsx("path", { d: dAttr, fill: "none", className: "react-flow__connection-path", style: connectionLineStyle }) }));
};
ConnectionLine.displayName = 'ConnectionLine';

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }) => {
    return (jsx("polyline", { stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: strokeWidth, fill: "none", points: "-5,-4 0,0 -5,4" }));
};
const ArrowClosedSymbol = ({ color = 'none', strokeWidth = 1 }) => {
    return (jsx("polyline", { stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: strokeWidth, fill: color, points: "-5,-4 0,0 -5,4 -5,-4" }));
};
const MarkerSymbols = {
    [MarkerType.Arrow]: ArrowSymbol,
    [MarkerType.ArrowClosed]: ArrowClosedSymbol,
};
function useMarkerSymbol(type) {
    const symbol = useMemo(() => {
        const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
        if (!symbolExists) {
            devWarn(`Marker type "${type}" doesn't exist. Help: https://reactflow.dev/error#900`);
            return null;
        }
        return MarkerSymbols[type];
    }, [type]);
    return symbol;
}

const Marker = ({ id, type, color, width = 12.5, height = 12.5, markerUnits = 'strokeWidth', strokeWidth, orient = 'auto-start-reverse', }) => {
    const Symbol = useMarkerSymbol(type);
    if (!Symbol) {
        return null;
    }
    return (jsx("marker", { className: "react-flow__arrowhead", id: id, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits: markerUnits, orient: orient, refX: "0", refY: "0", children: jsx(Symbol, { color: color, strokeWidth: strokeWidth }) }));
};
const markerSelector = ({ defaultColor, rfId }) => (s) => {
    const ids = [];
    return s.edges
        .reduce((markers, edge) => {
        [edge.markerStart, edge.markerEnd].forEach((marker) => {
            if (marker && typeof marker === 'object') {
                const markerId = getMarkerId(marker, rfId);
                if (!ids.includes(markerId)) {
                    markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
                    ids.push(markerId);
                }
            }
        });
        return markers;
    }, [])
        .sort((a, b) => a.id.localeCompare(b.id));
};
// when you have multiple flows on a page and you hide the first one, the other ones have no markers anymore
// when they do have markers with the same ids. To prevent this the user can pass a unique id to the react flow wrapper
// that we can then use for creating our unique marker ids
const MarkerDefinitions = ({ defaultColor, rfId }) => {
    const markers = useStore(useCallback(markerSelector({ defaultColor, rfId }), [defaultColor, rfId]), 
    // the id includes all marker options, so we just need to look at that part of the marker
    (a, b) => !(a.length !== b.length || a.some((m, i) => m.id !== b[i].id)));
    return (jsx("defs", { children: markers.map((marker) => (jsx(Marker, { id: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient }, marker.id))) }));
};
MarkerDefinitions.displayName = 'MarkerDefinitions';
var MarkerDefinitions$1 = memo(MarkerDefinitions);

const selector$3 = (s) => ({
    connectionNodeId: s.connectionNodeId,
    connectionHandleType: s.connectionHandleType,
    nodesConnectable: s.nodesConnectable,
    edgesFocusable: s.edgesFocusable,
    elementsSelectable: s.elementsSelectable,
    width: s.width,
    height: s.height,
    connectionMode: s.connectionMode,
    nodeInternals: s.nodeInternals,
});
const EdgeRenderer = (props) => {
    const { connectionNodeId, connectionHandleType, nodesConnectable, edgesFocusable, elementsSelectable, width, height, connectionMode, nodeInternals, } = useStore(selector$3, shallow);
    const edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals, props.elevateEdgesOnSelect);
    if (!width) {
        return null;
    }
    const { connectionLineType, defaultMarkerColor, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, } = props;
    const renderConnectionLine = connectionNodeId && connectionHandleType;
    return (jsxs(Fragment, { children: [edgeTree.map(({ level, edges, isMaxLevel }) => (jsxs("svg", { style: { zIndex: level }, width: width, height: height, className: "react-flow__edges react-flow__container", children: [isMaxLevel && jsx(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId: props.rfId }), jsx("g", { children: edges.map((edge) => {
                            const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
                            const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));
                            if (!sourceIsValid || !targetIsValid) {
                                return null;
                            }
                            let edgeType = edge.type || 'default';
                            if (!props.edgeTypes[edgeType]) {
                                devWarn(`Edge type "${edgeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`);
                                edgeType = 'default';
                            }
                            const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
                            // when connection type is loose we can define all handles as sources
                            const targetNodeHandles = connectionMode === ConnectionMode.Strict
                                ? targetHandleBounds.target
                                : targetHandleBounds.target || targetHandleBounds.source;
                            const sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle || null);
                            const targetHandle = getHandle(targetNodeHandles, edge.targetHandle || null);
                            const sourcePosition = sourceHandle?.position || Position.Bottom;
                            const targetPosition = targetHandle?.position || Position.Top;
                            const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
                            if (!sourceHandle || !targetHandle) {
                                devWarn(`Couldn't create edge for ${!sourceHandle ? 'source' : 'target'} handle id: ${!sourceHandle ? edge.sourceHandle : edge.targetHandle}; edge id: ${edge.id}. Help: https://reactflow.dev/error#800`);
                                return null;
                            }
                            const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
                            return (jsx(EdgeComponent, { id: edge.id, className: cc([edge.className, props.noPanClassName]), type: edgeType, data: edge.data, selected: !!edge.selected, animated: !!edge.animated, hidden: !!edge.hidden, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, source: edge.source, target: edge.target, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerEnd: edge.markerEnd, markerStart: edge.markerStart, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, elementsSelectable: elementsSelectable, onEdgeUpdate: props.onEdgeUpdate, onContextMenu: props.onEdgeContextMenu, onMouseEnter: props.onEdgeMouseEnter, onMouseMove: props.onEdgeMouseMove, onMouseLeave: props.onEdgeMouseLeave, onClick: props.onEdgeClick, edgeUpdaterRadius: props.edgeUpdaterRadius, onEdgeDoubleClick: props.onEdgeDoubleClick, onEdgeUpdateStart: props.onEdgeUpdateStart, onEdgeUpdateEnd: props.onEdgeUpdateEnd, rfId: props.rfId, ariaLabel: edge.ariaLabel, isFocusable: isFocusable, pathOptions: 'pathOptions' in edge ? edge.pathOptions : undefined, interactionWidth: edge.interactionWidth }, edge.id));
                        }) })] }, level))), renderConnectionLine && (jsx("svg", { style: connectionLineContainerStyle, width: width, height: height, className: "react-flow__edges react-flow__connectionline react-flow__container", children: jsx(ConnectionLine, { connectionNodeId: connectionNodeId, connectionHandleType: connectionHandleType, connectionLineStyle: connectionLineStyle, connectionLineType: connectionLineType, isConnectable: nodesConnectable, CustomConnectionLineComponent: connectionLineComponent }) }))] }));
};
EdgeRenderer.displayName = 'EdgeRenderer';
var EdgeRenderer$1 = memo(EdgeRenderer);

const selector$2 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
function Viewport({ children }) {
    const transform = useStore(selector$2);
    return (jsx("div", { className: "react-flow__viewport react-flow__container", style: { transform }, children: children }));
}

function useOnInitHandler(onInit) {
    const rfInstance = useReactFlow();
    const isInitialized = useRef(false);
    useEffect(() => {
        if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
            setTimeout(() => onInit(rfInstance), 1);
            isInitialized.current = true;
        }
    }, [onInit, rfInstance.viewportInitialized]);
}

const GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, edgeUpdaterRadius, onEdgeUpdateStart, onEdgeUpdateEnd, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId, }) => {
    useOnInitHandler(onInit);
    return (jsx(FlowRenderer$1, { onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, deleteKeyCode: deleteKeyCode, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, elementsSelectable: elementsSelectable, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, onSelectionContextMenu: onSelectionContextMenu, preventScrolling: preventScrolling, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, disableKeyboardA11y: disableKeyboardA11y, children: jsxs(Viewport, { children: [jsx(EdgeRenderer$1, { edgeTypes: edgeTypes, onEdgeClick: onEdgeClick, onEdgeDoubleClick: onEdgeDoubleClick, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, connectionLineContainerStyle: connectionLineContainerStyle, onEdgeUpdate: onEdgeUpdate, onlyRenderVisibleElements: onlyRenderVisibleElements, onEdgeContextMenu: onEdgeContextMenu, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, edgeUpdaterRadius: edgeUpdaterRadius, defaultMarkerColor: defaultMarkerColor, noPanClassName: noPanClassName, elevateEdgesOnSelect: !!elevateEdgesOnSelect, disableKeyboardA11y: disableKeyboardA11y, rfId: rfId }), jsx("div", { className: "react-flow__edgelabel-renderer" }), jsx(NodeRenderer$1, { nodeTypes: nodeTypes, onNodeClick: onNodeClick, onNodeDoubleClick: onNodeDoubleClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, selectNodesOnDrag: selectNodesOnDrag, onlyRenderVisibleElements: onlyRenderVisibleElements, noPanClassName: noPanClassName, noDragClassName: noDragClassName, disableKeyboardA11y: disableKeyboardA11y, nodeOrigin: nodeOrigin, nodeExtent: nodeExtent, rfId: rfId })] }) }));
};
GraphView.displayName = 'GraphView';
var GraphView$1 = memo(GraphView);

const infiniteExtent = [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];
const initialState = {
    rfId: '1',
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodeInternals: new Map(),
    edges: [],
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: false,
    hasDefaultEdges: false,
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: undefined,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionNodeId: null,
    connectionHandleId: null,
    connectionHandleType: 'source',
    connectionPosition: { x: 0, y: 0 },
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: [0, 0],
    snapGrid: [15, 15],
    snapToGrid: false,
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    fitViewOnInit: false,
    fitViewOnInitDone: false,
    fitViewOnInitOptions: undefined,
    multiSelectionActive: false,
    connectionStartHandle: null,
    connectOnClick: true,
    ariaLiveMessage: '',
};

const createRFStore = () => createStore((set, get) => ({
    ...initialState,
    setNodes: (nodes) => {
        const { nodeInternals, nodeOrigin, elevateNodesOnSelect } = get();
        set({ nodeInternals: createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) });
    },
    getNodes: () => {
        return Array.from(get().nodeInternals.values());
    },
    setEdges: (edges) => {
        const { defaultEdgeOptions = {} } = get();
        set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
    },
    setDefaultNodesAndEdges: (nodes, edges) => {
        const hasDefaultNodes = typeof nodes !== 'undefined';
        const hasDefaultEdges = typeof edges !== 'undefined';
        const nodeInternals = hasDefaultNodes
            ? createNodeInternals(nodes, new Map(), get().nodeOrigin, get().elevateNodesOnSelect)
            : new Map();
        const nextEdges = hasDefaultEdges ? edges : [];
        set({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
    },
    updateNodeDimensions: (updates) => {
        const { onNodesChange, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions, domNode, nodeOrigin, } = get();
        const viewportNode = domNode?.querySelector('.react-flow__viewport');
        if (!viewportNode) {
            return;
        }
        const style = window.getComputedStyle(viewportNode);
        const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
        const changes = updates.reduce((res, update) => {
            const node = nodeInternals.get(update.id);
            if (node) {
                const dimensions = getDimensions(update.nodeElement);
                const doUpdate = !!(dimensions.width &&
                    dimensions.height &&
                    (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate));
                if (doUpdate) {
                    nodeInternals.set(node.id, {
                        ...node,
                        [internalsSymbol]: {
                            ...node[internalsSymbol],
                            handleBounds: {
                                source: getHandleBounds('.source', update.nodeElement, zoom, nodeOrigin),
                                target: getHandleBounds('.target', update.nodeElement, zoom, nodeOrigin),
                            },
                        },
                        ...dimensions,
                    });
                    res.push({
                        id: node.id,
                        type: 'dimensions',
                        dimensions,
                    });
                }
            }
            return res;
        }, []);
        const nextFitViewOnInitDone = fitViewOnInitDone ||
            (fitViewOnInit && !fitViewOnInitDone && fitView(get, { initial: true, ...fitViewOnInitOptions }));
        set({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });
        if (changes?.length > 0) {
            onNodesChange?.(changes);
        }
    },
    updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
        const { triggerNodeChanges } = get();
        const changes = nodeDragItems.map((node) => {
            const change = {
                id: node.id,
                type: 'position',
                dragging,
            };
            if (positionChanged) {
                change.positionAbsolute = node.positionAbsolute;
                change.position = node.position;
            }
            return change;
        });
        triggerNodeChanges(changes);
    },
    triggerNodeChanges: (changes) => {
        const { onNodesChange, nodeInternals, hasDefaultNodes, nodeOrigin, getNodes, elevateNodesOnSelect } = get();
        if (changes?.length) {
            if (hasDefaultNodes) {
                const nodes = applyNodeChanges(changes, getNodes());
                const nextNodeInternals = createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect);
                set({ nodeInternals: nextNodeInternals });
            }
            onNodesChange?.(changes);
        }
    },
    addSelectedNodes: (selectedNodeIds) => {
        const { multiSelectionActive, edges, getNodes } = get();
        let changedNodes;
        let changedEdges = null;
        if (multiSelectionActive) {
            changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        }
        else {
            changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
            changedEdges = getSelectionChanges(edges, []);
        }
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    addSelectedEdges: (selectedEdgeIds) => {
        const { multiSelectionActive, edges, getNodes } = get();
        let changedEdges;
        let changedNodes = null;
        if (multiSelectionActive) {
            changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        }
        else {
            changedEdges = getSelectionChanges(edges, selectedEdgeIds);
            changedNodes = getSelectionChanges(getNodes(), []);
        }
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    unselectNodesAndEdges: ({ nodes, edges } = {}) => {
        const { edges: storeEdges, getNodes } = get();
        const nodesToUnselect = nodes ? nodes : getNodes();
        const edgesToUnselect = edges ? edges : storeEdges;
        const changedNodes = nodesToUnselect.map((n) => {
            n.selected = false;
            return createSelectionChange(n.id, false);
        });
        const changedEdges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    setMinZoom: (minZoom) => {
        const { d3Zoom, maxZoom } = get();
        d3Zoom?.scaleExtent([minZoom, maxZoom]);
        set({ minZoom });
    },
    setMaxZoom: (maxZoom) => {
        const { d3Zoom, minZoom } = get();
        d3Zoom?.scaleExtent([minZoom, maxZoom]);
        set({ maxZoom });
    },
    setTranslateExtent: (translateExtent) => {
        get().d3Zoom?.translateExtent(translateExtent);
        set({ translateExtent });
    },
    resetSelectedElements: () => {
        const { edges, getNodes } = get();
        const nodes = getNodes();
        const nodesToUnselect = nodes
            .filter((e) => e.selected)
            .map((n) => createSelectionChange(n.id, false));
        const edgesToUnselect = edges
            .filter((e) => e.selected)
            .map((e) => createSelectionChange(e.id, false));
        updateNodesAndEdgesSelections({
            changedNodes: nodesToUnselect,
            changedEdges: edgesToUnselect,
            get,
            set,
        });
    },
    setNodeExtent: (nodeExtent) => {
        const { nodeInternals } = get();
        nodeInternals.forEach((node) => {
            node.positionAbsolute = clampPosition(node.position, nodeExtent);
        });
        set({
            nodeExtent,
            nodeInternals: new Map(nodeInternals),
        });
    },
    cancelConnection: () => set({
        connectionNodeId: initialState.connectionNodeId,
        connectionHandleId: initialState.connectionHandleId,
    }),
    reset: () => set({ ...initialState }),
}));

const ReactFlowProvider = ({ children }) => {
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = createRFStore();
    }
    return jsx(Provider$1, { value: storeRef.current, children: children });
};
ReactFlowProvider.displayName = 'ReactFlowProvider';

const Wrapper = ({ children }) => {
    const isWrapped = useContext(StoreContext);
    if (isWrapped) {
        // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
        return jsx(Fragment, { children: children });
    }
    return jsx(ReactFlowProvider, { children: children });
};
Wrapper.displayName = 'ReactFlowWrapper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
    const typesKeysRef = useRef(null);
    const typesParsed = useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            const typeKeys = Object.keys(nodeOrEdgeTypes);
            if (shallow(typesKeysRef.current, typeKeys)) {
                devWarn("It looks like you have created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#200");
            }
            typesKeysRef.current = typeKeys;
        }
        return createTypes(nodeOrEdgeTypes);
    }, [nodeOrEdgeTypes]);
    return typesParsed;
}

const defaultNodeTypes = {
    input: InputNode$1,
    default: DefaultNode$1,
    output: OutputNode$1,
    group: GroupNode,
};
const defaultEdgeTypes = {
    default: BezierEdge,
    straight: StraightEdge,
    step: StepEdge,
    smoothstep: SmoothStepEdge,
    simplebezier: SimpleBezierEdge,
};
const initNodeOrigin = [0, 0];
const initSnapGrid = [15, 15];
const initDefaultViewport = { x: 0, y: 0, zoom: 1 };
const wrapperStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0,
};
const ReactFlow = forwardRef(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = 'Backspace', selectionKeyCode = 'Shift', selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = 'Space', multiSelectionKeyCode = 'Meta', zoomActivationKeyCode = 'Meta', snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = '#b1b1b7', zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children, onEdgeUpdate, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdateStart, onEdgeUpdateEnd, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = 'nodrag', noWheelClassName = 'nowheel', noPanClassName = 'nopan', fitView = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, style, id, ...rest }, ref) => {
    const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
    const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
    const rfId = id || '1';
    return (jsx("div", { ...rest, style: { ...style, ...wrapperStyle }, ref: ref, className: cc(['react-flow', className]), "data-testid": "rf__wrapper", id: id, children: jsxs(Wrapper, { children: [jsx(GraphView$1, { onInit: onInit, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onNodeClick: onNodeClick, onEdgeClick: onEdgeClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, onNodeDoubleClick: onNodeDoubleClick, nodeTypes: nodeTypesWrapped, edgeTypes: edgeTypesWrapped, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, connectionLineContainerStyle: connectionLineContainerStyle, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, deleteKeyCode: deleteKeyCode, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, onlyRenderVisibleElements: onlyRenderVisibleElements, selectNodesOnDrag: selectNodesOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, preventScrolling: preventScrolling, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneScroll: onPaneScroll, onPaneContextMenu: onPaneContextMenu, onSelectionContextMenu: onSelectionContextMenu, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, onEdgeUpdate: onEdgeUpdate, onEdgeContextMenu: onEdgeContextMenu, onEdgeDoubleClick: onEdgeDoubleClick, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, edgeUpdaterRadius: edgeUpdaterRadius, defaultMarkerColor: defaultMarkerColor, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, elevateEdgesOnSelect: elevateEdgesOnSelect, rfId: rfId, disableKeyboardA11y: disableKeyboardA11y, nodeOrigin: nodeOrigin, nodeExtent: nodeExtent }), jsx(StoreUpdater, { nodes: nodes, edges: edges, defaultNodes: defaultNodes, defaultEdges: defaultEdges, onConnect: onConnect, onConnectStart: onConnectStart, onConnectEnd: onConnectEnd, onClickConnectStart: onClickConnectStart, onClickConnectEnd: onClickConnectEnd, nodesDraggable: nodesDraggable, nodesConnectable: nodesConnectable, nodesFocusable: nodesFocusable, edgesFocusable: edgesFocusable, elementsSelectable: elementsSelectable, elevateNodesOnSelect: elevateNodesOnSelect, minZoom: minZoom, maxZoom: maxZoom, nodeExtent: nodeExtent, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, snapToGrid: snapToGrid, snapGrid: snapGrid, connectionMode: connectionMode, translateExtent: translateExtent, connectOnClick: connectOnClick, defaultEdgeOptions: defaultEdgeOptions, fitView: fitView, fitViewOptions: fitViewOptions, onNodesDelete: onNodesDelete, onEdgesDelete: onEdgesDelete, onNodeDragStart: onNodeDragStart, onNodeDrag: onNodeDrag, onNodeDragStop: onNodeDragStop, onSelectionDrag: onSelectionDrag, onSelectionDragStart: onSelectionDragStart, onSelectionDragStop: onSelectionDragStop, noPanClassName: noPanClassName, nodeOrigin: nodeOrigin, rfId: rfId }), jsx(Wrapper$1, { onSelectionChange: onSelectionChange }), children, jsx(Attribution, { proOptions: proOptions, position: attributionPosition }), jsx(A11yDescriptions, { rfId: rfId, disableKeyboardA11y: disableKeyboardA11y })] }) }));
});
ReactFlow.displayName = 'ReactFlow';

const selector$1 = (s) => s.domNode?.querySelector('.react-flow__edgelabel-renderer');
function EdgeLabelRenderer({ children }) {
    const edgeLabelRenderer = useStore(selector$1);
    if (!edgeLabelRenderer) {
        return null;
    }
    return createPortal(children, edgeLabelRenderer);
}

function useUpdateNodeInternals() {
    const store = useStoreApi();
    return useCallback((id) => {
        const { domNode, updateNodeDimensions } = store.getState();
        const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${id}"]`);
        if (nodeElement) {
            requestAnimationFrame(() => updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]));
        }
    }, []);
}

const nodesSelector = (state) => state.getNodes();
function useNodes() {
    const nodes = useStore(nodesSelector);
    return nodes;
}

const edgesSelector = (state) => state.edges;
function useEdges() {
    const edges = useStore(edgesSelector);
    return edges;
}

const viewportSelector = (state) => ({
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2],
});
function useViewport() {
    const viewport = useStore(viewportSelector, shallow);
    return viewport;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function createUseItemsState(applyChanges) {
    return (initialItems) => {
        const [items, setItems] = useState(initialItems);
        const onItemsChange = useCallback((changes) => setItems((items) => applyChanges(changes, items)), []);
        return [items, setItems, onItemsChange];
    };
}
const useNodesState = createUseItemsState(applyNodeChanges);
const useEdgesState = createUseItemsState(applyEdgeChanges);

function useOnViewportChange({ onStart, onChange, onEnd }) {
    const store = useStoreApi();
    useEffect(() => {
        store.setState({ onViewportChangeStart: onStart });
    }, [onStart]);
    useEffect(() => {
        store.setState({ onViewportChange: onChange });
    }, [onChange]);
    useEffect(() => {
        store.setState({ onViewportChangeEnd: onEnd });
    }, [onEnd]);
}

function useOnSelectionChange({ onChange }) {
    const store = useStoreApi();
    useEffect(() => {
        store.setState({ onSelectionChange: onChange });
    }, [onChange]);
}

const selector = (s) => {
    if (s.nodeInternals.size === 0) {
        return false;
    }
    return s.getNodes().every((n) => n[internalsSymbol]?.handleBounds !== undefined);
};
function useNodesInitialized() {
    const initialized = useStore(selector);
    return initialized;
}

export { BaseEdge, BezierEdge, ConnectionLineType, ConnectionMode, EdgeLabelRenderer, EdgeText$1 as EdgeText, Handle$1 as Handle, MarkerType, PanOnScrollMode, Panel, Position, ReactFlow, ReactFlowProvider, SelectionMode, SimpleBezierEdge, SmoothStepEdge, StepEdge, StraightEdge, addEdge, applyEdgeChanges, applyNodeChanges, boxToRect, getBezierPath, getBoundsOfRects, getConnectedEdges, getIncomers, getMarkerEnd, getNodePositionWithOrigin, getOutgoers, getRectOfNodes, getSimpleBezierPath, getSmoothStepPath, getStraightPath, getTransformForBounds, internalsSymbol, isEdge, isNode, rectToBox, updateEdge, useEdges, useEdgesState, useGetPointerPosition, useKeyPress, useNodeId, useNodes, useNodesInitialized, useNodesState, useOnSelectionChange, useOnViewportChange, useReactFlow, useStore, useStoreApi, useUpdateNodeInternals, useViewport };
