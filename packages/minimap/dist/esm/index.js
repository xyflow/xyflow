import { jsx, jsxs } from 'react/jsx-runtime';
import { memo, useRef, useEffect } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, pointer } from 'd3-selection';
import { useStoreApi, useStore, Panel, getNodePositionWithOrigin, getBoundsOfRects, getRectOfNodes } from '@reactflow/core';

const MiniMapNode = ({ id, x, y, width, height, style, color, strokeColor, strokeWidth, className, borderRadius, shapeRendering, onClick, }) => {
    const { background, backgroundColor } = style || {};
    const fill = (color || background || backgroundColor);
    return (jsx("rect", { className: cc(['react-flow__minimap-node', className]), x: x, y: y, rx: borderRadius, ry: borderRadius, width: width, height: height, fill: fill, stroke: strokeColor, strokeWidth: strokeWidth, shapeRendering: shapeRendering, onClick: onClick ? (event) => onClick(event, id) : undefined }));
};
MiniMapNode.displayName = 'MiniMapNode';
var MiniMapNode$1 = memo(MiniMapNode);

const defaultWidth = 200;
const defaultHeight = 150;
const selector = (s) => {
    const nodes = s.getNodes();
    const viewBB = {
        x: -s.transform[0] / s.transform[2],
        y: -s.transform[1] / s.transform[2],
        width: s.width / s.transform[2],
        height: s.height / s.transform[2],
    };
    return {
        nodes: nodes.filter((node) => !node.hidden && node.width && node.height),
        viewBB,
        boundingRect: nodes.length > 0 ? getBoundsOfRects(getRectOfNodes(nodes, s.nodeOrigin), viewBB) : viewBB,
        rfId: s.rfId,
        nodeOrigin: s.nodeOrigin,
    };
};
const getAttrFunction = (func) => (func instanceof Function ? func : () => func);
const ARIA_LABEL_KEY = 'react-flow__minimap-desc';
function MiniMap({ style, className, nodeStrokeColor = 'transparent', nodeColor = '#e2e2e2', nodeClassName = '', nodeBorderRadius = 5, nodeStrokeWidth = 2, maskColor = 'rgb(240, 240, 240, 0.6)', maskStrokeColor = 'none', maskStrokeWidth = 1, position = 'bottom-right', onClick, onNodeClick, pannable = false, zoomable = false, ariaLabel = 'React Flow mini map', }) {
    const store = useStoreApi();
    const svg = useRef(null);
    const { boundingRect, viewBB, nodes, rfId, nodeOrigin } = useStore(selector, shallow);
    const elementWidth = style?.width ?? defaultWidth;
    const elementHeight = style?.height ?? defaultHeight;
    const nodeColorFunc = getAttrFunction(nodeColor);
    const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
    const nodeClassNameFunc = getAttrFunction(nodeClassName);
    const scaledWidth = boundingRect.width / elementWidth;
    const scaledHeight = boundingRect.height / elementHeight;
    const viewScale = Math.max(scaledWidth, scaledHeight);
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = 5 * viewScale;
    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;
    const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';
    const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
    const viewScaleRef = useRef(0);
    viewScaleRef.current = viewScale;
    useEffect(() => {
        if (svg.current) {
            const selection = select(svg.current);
            const zoomHandler = (event) => {
                const { transform, d3Selection, d3Zoom } = store.getState();
                if (event.sourceEvent.type !== 'wheel' || !d3Selection || !d3Zoom) {
                    return;
                }
                const pinchDelta = -event.sourceEvent.deltaY *
                    (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 0.002) *
                    10;
                const zoom = transform[2] * Math.pow(2, pinchDelta);
                d3Zoom.scaleTo(d3Selection, zoom);
            };
            const panHandler = (event) => {
                const { transform, d3Selection, d3Zoom, translateExtent, width, height } = store.getState();
                if (event.sourceEvent.type !== 'mousemove' || !d3Selection || !d3Zoom) {
                    return;
                }
                // @TODO: how to calculate the correct next position? Math.max(1, transform[2]) is a workaround.
                const position = {
                    x: transform[0] - event.sourceEvent.movementX * viewScaleRef.current * Math.max(1, transform[2]),
                    y: transform[1] - event.sourceEvent.movementY * viewScaleRef.current * Math.max(1, transform[2]),
                };
                const extent = [
                    [0, 0],
                    [width, height],
                ];
                const nextTransform = zoomIdentity.translate(position.x, position.y).scale(transform[2]);
                const constrainedTransform = d3Zoom.constrain()(nextTransform, extent, translateExtent);
                d3Zoom.transform(d3Selection, constrainedTransform);
            };
            const zoomAndPanHandler = zoom()
                // @ts-ignore
                .on('zoom', pannable ? panHandler : null)
                // @ts-ignore
                .on('zoom.wheel', zoomable ? zoomHandler : null);
            selection.call(zoomAndPanHandler);
            return () => {
                selection.on('zoom', null);
            };
        }
    }, [pannable, zoomable]);
    const onSvgClick = onClick
        ? (event) => {
            const rfCoord = pointer(event);
            onClick(event, { x: rfCoord[0], y: rfCoord[1] });
        }
        : undefined;
    const onSvgNodeClick = onNodeClick
        ? (event, nodeId) => {
            const node = store.getState().nodeInternals.get(nodeId);
            onNodeClick(event, node);
        }
        : undefined;
    return (jsx(Panel, { position: position, style: style, className: cc(['react-flow__minimap', className]), children: jsxs("svg", { width: elementWidth, height: elementHeight, viewBox: `${x} ${y} ${width} ${height}`, role: "img", "aria-labelledby": labelledBy, ref: svg, onClick: onSvgClick, children: [ariaLabel && jsx("title", { id: labelledBy, children: ariaLabel }), nodes.map((node) => {
                    const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
                    return (jsx(MiniMapNode$1, { x: x, y: y, width: node.width, height: node.height, style: node.style, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth, shapeRendering: shapeRendering, onClick: onSvgNodeClick, id: node.id }, node.id));
                }), jsx("path", { className: "react-flow__minimap-mask", d: `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`, fill: maskColor, fillRule: "evenodd", stroke: maskStrokeColor, strokeWidth: maskStrokeWidth, pointerEvents: "none" })] }) }));
}
MiniMap.displayName = 'MiniMap';
var MiniMap$1 = memo(MiniMap);

export { MiniMap$1 as MiniMap };
