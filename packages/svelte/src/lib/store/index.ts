import { getContext } from 'svelte';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import {
	type Node,
	type Transform,
	type NodeDragItem,
	type NodeDimensionUpdate,
	type Edge,
	Position
} from '@reactflow/core';
import { internalsSymbol } from '@reactflow/core';

import { getDimensions, getHandleBounds } from '../../utils';
import {
	getEdgePositions,
	getHandle,
	getNodeData,
	type EdgePosition
} from '$lib/container/EdgeRenderer/utils';

export const key = Symbol();

type CreateStoreProps = {
	nodes: Node[];
	edges: Edge[];
	transform?: Transform;
};

export type EdgeWithData = EdgePosition & {
	id: string;
	type: string;
};

type SvelteFlowStore = {
	nodesStore: Writable<CreateStoreProps['nodes']>;
	edgesStore: Writable<CreateStoreProps['edges']>;
	heightStore: Writable<number>;
	widthStore: Writable<number>;
	transformStore: Writable<Transform>;
	edgesWithDataStore: Readable<EdgeWithData[]>;
	updateNodePositions: (
		nodeDragItems: NodeDragItem[],
		positionChanged?: boolean,
		dragging?: boolean
	) => void;
	updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
};

export function createStore({
	nodes = [],
	edges = [],
	transform = [0, 0, 1]
}: CreateStoreProps): SvelteFlowStore {
	const nodesStore = writable(nodes.map((n) => ({ ...n, positionAbsolute: n.position })));
	const edgesStore = writable(edges);
	const heightStore = writable(500);
	const widthStore = writable(500);

	const edgesWithDataStore = derived([edgesStore, nodesStore], ([$edges, $nodes]) => {
		return $edges
			.map((edge) => {
				const sourceNode = $nodes.find((node) => node.id === edge.source);
				const targetNode = $nodes.find((node) => node.id === edge.target);
				const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(sourceNode);
				const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(targetNode);

				if (!sourceIsValid || !targetIsValid) {
					return null;
				}

				const edgeType = edge.type || 'default';

				const targetNodeHandles = targetHandleBounds!.target;
				const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle);
				const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle);
				const sourcePosition = sourceHandle?.position || Position.Bottom;
				const targetPosition = targetHandle?.position || Position.Top;

				if (!sourceHandle || !targetHandle) {
					return null;
				}

				const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
					sourceNodeRect,
					sourceHandle,
					sourcePosition,
					targetNodeRect,
					targetHandle,
					targetPosition
				);

				return {
					id: edge.id,
					type: edgeType,
					sourceX,
					sourceY,
					targetX,
					targetY
				};
			})
			.filter((e) => e !== null) as EdgeWithData[];
	});

	const transformStore = writable(transform);

	function updateNodePositions(nodeDragItems: NodeDragItem[], dragging = false) {
		nodesStore.update((nds) => {
			return nds.map((n) => {
				const nodeDragItem = nodeDragItems.find((ndi) => ndi.id === n.id);

				if (nodeDragItem) {
					return {
						...n,
						dragging,
						positionAbsolute: nodeDragItem.positionAbsolute,
						position: nodeDragItem.position
					};
				}

				return n;
			});
		});
	}

	function updateNodeDimensions(updates: NodeDimensionUpdate[]) {
		const viewportNode = document?.querySelector('.react-flow__viewport');

		if (!viewportNode) {
			return;
		}

		const style = window.getComputedStyle(viewportNode);
		const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

		nodesStore.update((nds) => {
			const nextNodes = nds.map((node) => {
				const update = updates.find((u) => u.id === node.id);

				if (update) {
					const dimensions = getDimensions(update.nodeElement);

					const doUpdate = !!(
						dimensions.width &&
						dimensions.height &&
						(node.width !== dimensions.width ||
							node.height !== dimensions.height ||
							update.forceUpdate)
					);

					if (doUpdate) {
						node[internalsSymbol] = {
							...node[internalsSymbol],
							handleBounds: {
								source: getHandleBounds('.source', update.nodeElement, zoom),
								target: getHandleBounds('.target', update.nodeElement, zoom)
							}
						};
						node.width = dimensions.width;
						node.height = dimensions.height;
					}
				}

				return node;
			});

			return nextNodes;
		});
	}

	return {
		nodesStore,
		edgesStore,
		transformStore,
		heightStore,
		widthStore,
		edgesWithDataStore,
		updateNodePositions,
		updateNodeDimensions
	};
}

export function useStore(): SvelteFlowStore {
	const { getStore } = getContext<{ getStore: () => SvelteFlowStore }>(key);
	return getStore();
}
