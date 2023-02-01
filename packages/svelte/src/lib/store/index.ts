import { getContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import type { Node, Transform, NodeDragItem, NodeDimensionUpdate, Edge } from '@reactflow/core';
import { internalsSymbol } from '@reactflow/core';

import { getDimensions, getHandleBounds, updateAbsoluteNodePositions } from '../../utils';

export const key = Symbol();

type CreateStoreProps = {
	nodes: Node[];
	edges: Edge[];
	transform?: Transform;
};

type SvelteFlowStore = {
	nodesStore: Writable<CreateStoreProps['nodes']>;
	edgesStore: Writable<CreateStoreProps['edges']>;
	heightStore: Writable<number>;
	widthStore: Writable<number>;
	transformStore: Writable<Transform>;
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
		const nds = get(nodesStore);

		updates.forEach((update) => {
			const node = nds.find((n) => n.id === update.id);

			if (node) {
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
		});

		updateAbsoluteNodePositions(nds);
	}

	return {
		nodesStore,
		edgesStore,
		transformStore,
		heightStore,
		widthStore,
		updateNodePositions,
		updateNodeDimensions
	};
}

export function useStore(): SvelteFlowStore {
	const { getStore } = getContext<{ getStore: () => SvelteFlowStore }>(key);
	return getStore();
}
