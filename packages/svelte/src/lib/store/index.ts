import { getContext } from 'svelte';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import {
	type Node,
	type Transform,
	type NodeDragItem,
	type NodeDimensionUpdate,
	type Edge,
	Position,
	internalsSymbol,
	type NodeOrigin,
	type D3ZoomInstance,
	type D3SelectionInstance,
	type ViewportHelperFunctionOptions
} from '@reactflow/system';
import { fitView, getD3Transition } from '@reactflow/utils';

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
	fitView: boolean;
	nodeOrigin?: NodeOrigin;
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
	d3Store: Writable<{
		zoom: D3ZoomInstance | null;
		selection: D3SelectionInstance | null;
	}>;
	transformStore: Writable<Transform>;
	edgesWithDataStore: Readable<EdgeWithData[]>;
	zoomIn: (options?: ViewportHelperFunctionOptions) => void;
	zoomOut: (options?: ViewportHelperFunctionOptions) => void;
	fitView: (options?: ViewportHelperFunctionOptions) => void;
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
	transform = [0, 0, 1],
	nodeOrigin = [0, 0],
	fitView: fitViewOnInit = false
}: CreateStoreProps): SvelteFlowStore {
	const nodesStore = writable(nodes.map((n) => ({ ...n, positionAbsolute: n.position })));
	const edgesStore = writable(edges);
	const heightStore = writable(500);
	const widthStore = writable(500);
	const nodeOriginStore = writable(nodeOrigin);
	const d3Store = writable<{ zoom: D3ZoomInstance | null; selection: D3SelectionInstance | null }>({
		zoom: null,
		selection: null
	});

	let fitViewOnInitDone = false;

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

		const nextNodes = get(nodesStore).map((node) => {
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

		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);

		const nextFitViewOnInitDone =
			fitViewOnInitDone ||
			(fitViewOnInit &&
				!fitViewOnInitDone &&
				!!d3Zoom &&
				!!d3Selection &&
				fitView(
					{
						nodes: get(nodesStore),
						width: get(widthStore),
						height: get(heightStore),
						minZoom: 0.2,
						maxZoom: 2,
						d3Selection,
						d3Zoom,
						nodeOrigin: get(nodeOriginStore)
					},
					{}
				));

		fitViewOnInitDone = nextFitViewOnInitDone;

		nodesStore.set(nextNodes);
	}

	function zoomIn(options?: ViewportHelperFunctionOptions) {
		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);

		if (d3Zoom && d3Selection) {
			d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1.2);
		}
	}

	function zoomOut(options?: ViewportHelperFunctionOptions) {
		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);
		if (d3Zoom && d3Selection) {
			d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1 / 1.2);
		}
	}

	function _fitView() {
		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);
		if (d3Zoom && d3Selection) {
			fitView(
				{
					nodes: get(nodesStore),
					width: get(widthStore),
					height: get(heightStore),
					minZoom: 0.2,
					maxZoom: 2,
					d3Selection,
					d3Zoom,
					nodeOrigin: get(nodeOriginStore)
				},
				{}
			);
		}
	}

	return {
		nodesStore,
		edgesStore,
		transformStore,
		d3Store,
		heightStore,
		widthStore,
		edgesWithDataStore,
		updateNodePositions,
		updateNodeDimensions,
		zoomIn,
		zoomOut,
		fitView: _fitView
	};
}

export function useStore(): SvelteFlowStore {
	const { getStore } = getContext<{ getStore: () => SvelteFlowStore }>(key);
	return getStore();
}
