import {
	type CoordinateExtent,
	type Dimensions,
	type XYPosition,
	type Node,
	type XYZPosition,
	type HandleElement,
	internalsSymbol,
	Position
} from '@reactflow/core';

export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export const clampPosition = (position: XYPosition = { x: 0, y: 0 }, extent: CoordinateExtent) => ({
	x: clamp(position.x, extent[0][0], extent[1][0]),
	y: clamp(position.y, extent[0][1], extent[1][1])
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n);

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
	width: node.offsetWidth,
	height: node.offsetHeight
});

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(node: Node, nodes: Node[], result: XYZPosition): XYZPosition {
	if (!node.parentNode) {
		return result;
	}
	const parentNode = nodes.find((n) => n.id === node.parentNode)!;
	const parentNodePosition = parentNode.positionAbsolute!;

	return calculateXYZPosition(parentNode, nodes, {
		x: (result.x ?? 0) + parentNodePosition.x,
		y: (result.y ?? 0) + parentNodePosition.y,
		z:
			(parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0)
				? parentNode[internalsSymbol]?.z ?? 0
				: result.z ?? 0
	});
}

export function updateAbsoluteNodePositions(nodes: Node[], parentNodes?: ParentNodes) {
	nodes.forEach((node) => {
		if (node.parentNode) {
			throw new Error(`Parent node ${node.parentNode} not found`);
		}

		if (node.parentNode || parentNodes?.[node.id]) {
			const { x, y, z } = calculateXYZPosition(node, nodes, {
				...node.position,
				z: node[internalsSymbol]?.z ?? 0
			});

			node.positionAbsolute = {
				x,
				y
			};

			node[internalsSymbol]!.z = z;

			if (parentNodes?.[node.id]) {
				node[internalsSymbol]!.isParent = true;
			}
		}
	});
}

export const getHandleBounds = (
	selector: string,
	nodeElement: HTMLDivElement,
	zoom: number
): HandleElement[] | null => {
	const handles = nodeElement.querySelectorAll(selector);

	if (!handles || !handles.length) {
		return null;
	}

	const handlesArray = Array.from(handles) as HTMLDivElement[];
	const nodeBounds = nodeElement.getBoundingClientRect();
	const nodeOffset = {
		x: nodeBounds.width,
		y: nodeBounds.height
	};

	return handlesArray.map((handle): HandleElement => {
		const handleBounds = handle.getBoundingClientRect();

		return {
			id: handle.getAttribute('data-handleid'),
			position: handle.getAttribute('data-handlepos') as unknown as Position,
			x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
			y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
			...getDimensions(handle)
		};
	});
};
