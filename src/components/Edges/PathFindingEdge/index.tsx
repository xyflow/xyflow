import React, { memo } from 'react';
import BezierEdge from '../BezierEdge';
import { getMarkerEnd } from '../utils';
import { createGrid, PointInfo, gridRatio } from './createGrid';
import { drawSmoothLinePath } from './drawSvgPath';
import { generatePath } from './generatePath';
import { getBoundingBoxes } from './getBoundingBoxes';
import { gridToGraphPoint } from './pointConversion';
import { useStoreState } from '../../../store/hooks';
import useDebounce from './useDebounce';
import type { EdgeProps, Node } from '../../../types';

interface PathFindingEdgeProps<T = any> extends EdgeProps<T> {
	storeNodes: Node<T>[];
}

const nodePadding = 10;
const graphPadding = 20;
const roundCoordinatesTo = gridRatio;

const PathFindingEdge = memo((props: PathFindingEdgeProps) => {
	const {
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		arrowHeadType,
		markerEndId,
		style,
		storeNodes
	} = props;

	// We use the node's information to generate bounding boxes for them
	// and the graph
	const { graph, nodes } = getBoundingBoxes(
		storeNodes,
		nodePadding,
		graphPadding,
		roundCoordinatesTo
	);

	const source: PointInfo = {
		x: sourceX,
		y: sourceY,
		position: sourcePosition,
	};

	const target: PointInfo = {
		x: targetX,
		y: targetY,
		position: targetPosition,
	};

	// With this information, we can create a 2D grid representation of
	// our graph, that tells us where in the graph there is a "free" space or not
	const { grid, start, end } = createGrid(
		graph,
		nodes,
		source,
		target,
	);

	// We then can use the grid representation to do pathfinding
	const gridPath = generatePath(grid, start, end);

	/*
		Fallback to BezierEdge if no path was found.
		length = 0: no path was found
		length = 1: starting and ending points are the same
		length = 2: a single straight line from point A to point B
	*/
	if (gridPath.length <= 2) {
		return <BezierEdge {...props} />;
	}

	// Here we convert the grid path to a sequence of graph coordinates.
	const graphPath = gridPath.map((gridPoint) => {
		const [x, y] = gridPoint;
		const graphPoint = gridToGraphPoint({ x, y }, graph.xMin, graph.yMin);
		return [graphPoint.x, graphPoint.y];
	});

	// Finally, we can use the graph path to draw the edge
	const svgPathString = drawSmoothLinePath(source, target, graphPath);
	const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

	return (
		<path
			style={style}
			className="react-flow__edge-path"
			d={svgPathString}
			markerEnd={markerEnd}
		/>
	);
});

const DebouncedPathFindingEdge = memo((props: EdgeProps) => {
	const storeNodes = useStoreState((state) => state.nodes);
	const [debouncedNodes, debouncedProps] = useDebounce([storeNodes, props], 200);

	return (
		<PathFindingEdge
			storeNodes={debouncedNodes}
			{...debouncedProps}
		/>
	);
});

export default DebouncedPathFindingEdge;
