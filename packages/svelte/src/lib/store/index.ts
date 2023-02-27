import { getContext } from 'svelte';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import {
	type Transform,
	type NodeDragItem,
	type NodeDimensionUpdate,
	Position,
	internalsSymbol,
	SelectionMode,
	type NodeOrigin,
	type D3ZoomInstance,
	type D3SelectionInstance,
	type ViewportHelperFunctionOptions,
	type SelectionRect,
	type Node as RFNode,
	type Connection,
	ConnectionMode,
	type XYPosition,
	type CoordinateExtent,
	ConnectionLineType
} from '@reactflow/system';
import {
	fitView as fitViewUtil,
	getConnectedEdges,
	getD3Transition,
	getDimensions,
	addEdge as addEdgeUtil
} from '@reactflow/utils';
import { zoomIdentity } from 'd3-zoom';

import { getHandleBounds } from '../../utils';
import { getEdgePositions, getHandle, getNodeData } from '$lib/container/EdgeRenderer/utils';
import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import type { EdgeTypes, NodeTypes, Node, Edge, WrapEdgeProps, ConnectionData } from '$lib/types';
import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
import StraightEdge from '$lib/components/edges/StraightEdge.svelte';
import SmoothStepEdge from '$lib/components/edges/SmoothStepEdge.svelte';
import { getBezierPath, getSmoothStepPath, getStraightPath } from '@reactflow/edge-utils';

export const key = Symbol();

type CreateStoreProps = {
	fitView?: boolean;
	nodeOrigin?: NodeOrigin;
	transform?: Transform;
	nodeTypes?: NodeTypes;
	edgeTypes?: EdgeTypes;
	id?: string;
};

type SvelteFlowStore = {
	nodesStore: Writable<Node[]>;
	edgesStore: Writable<Edge[]>;
	heightStore: Writable<number>;
	widthStore: Writable<number>;
	d3Store: Writable<{
		zoom: D3ZoomInstance | null;
		selection: D3SelectionInstance | null;
	}>;
	transformStore: Writable<Transform>;
	edgesWithDataStore: Readable<WrapEdgeProps[]>;
	idStore: Writable<string>;
	nodeOriginStore: Writable<NodeOrigin>;
	draggingStore: Writable<boolean>;
	selectionRectStore: Writable<SelectionRect | null>;
	selectionRectModeStore: Writable<string | null>;
	selectionMode: Writable<SelectionMode>;
	selectionKeyPressedStore: Writable<boolean>;
	deleteKeyPressedStore: Writable<boolean>;
	nodeTypesStore: Writable<NodeTypes>;
	edgeTypesStore: Writable<EdgeTypes>;
	domNodeStore: Writable<HTMLDivElement | null>;
	connectionRadiusStore: Writable<number>;
	connectionModeStore: Writable<ConnectionMode>;
	connectionStore: Writable<ConnectionData>;
	connectionPathStore: Readable<string | null>;
	setNodes: (nodes: Node[]) => void;
	setEdges: (edges: Edge[]) => void;
	addEdge: (edge: Edge | Connection) => void;
	zoomIn: (options?: ViewportHelperFunctionOptions) => void;
	zoomOut: (options?: ViewportHelperFunctionOptions) => void;
	fitView: (options?: ViewportHelperFunctionOptions) => boolean;
	updateNodePositions: (
		nodeDragItems: NodeDragItem[],
		positionChanged?: boolean,
		dragging?: boolean
	) => void;
	updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
	resetSelectedElements: () => void;
	addSelectedNodes: (ids: string[]) => void;
	panBy: (delta: XYPosition) => void;
	updateConnection: (connection: Partial<ConnectionData>) => void;
	cancelConnection: () => void;
};

const initConnectionData = {
	nodeId: null,
	handleId: null,
	handleType: null,
	position: null,
	status: null
};

export function createStore({
	transform = [0, 0, 1],
	nodeOrigin = [0, 0],
	fitView: fitViewOnInit = false,
	nodeTypes = {},
	edgeTypes = {},
	id = '1'
}: CreateStoreProps): SvelteFlowStore {
	const nodesStore = writable([] as Node[]);
	const edgesStore = writable([] as Edge[]);
	const heightStore = writable(500);
	const widthStore = writable(500);
	const nodeOriginStore = writable(nodeOrigin);
	const d3Store = writable<{ zoom: D3ZoomInstance | null; selection: D3SelectionInstance | null }>({
		zoom: null,
		selection: null
	});
	const idStore = writable(id);
	const draggingStore = writable(false);
	const selectionRectStore = writable(null);
	const selectionKeyPressedStore = writable(false);
	const multiselectionKeyPressedStore = writable(false);
	const deleteKeyPressedStore = writable(false);
	const selectionRectModeStore = writable(null);
	const selectionMode = writable(SelectionMode.Partial);
	const nodeTypesStore = writable({
		...nodeTypes,
		input: nodeTypes.input || InputNode,
		output: nodeTypes.output || OutputNode,
		default: nodeTypes.default || DefaultNode
	});

	const edgeTypesStore = writable({
		...edgeTypes,
		straight: edgeTypes.straight || StraightEdge,
		smoothstep: edgeTypes.smoothstep || SmoothStepEdge,
		default: edgeTypes.default || BezierEdge
	});
	const transformStore = writable(transform);
	const connectionModeStore = writable(ConnectionMode.Strict);
	const domNodeStore = writable(null);
	const connectionStore = writable<ConnectionData>(initConnectionData);
	const connectionRadiusStore = writable(25);
	const connectionLineTypeStore = writable(ConnectionLineType.Bezier);

	let fitViewOnInitDone = false;

	const edgesWithDataStore = derived([edgesStore, nodesStore], ([$edges, $nodes]) => {
		return $edges
			.map((edge) => {
				const sourceNode = $nodes.find((node) => node.id === edge.source);
				const targetNode = $nodes.find((node) => node.id === edge.target);
				const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(
					sourceNode as RFNode
				);
				const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(
					targetNode as RFNode
				);

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

				// we nee to do this to match the types
				const sourceHandleId = edge.sourceHandle;
				const targetHandleId = edge.targetHandle;

				return {
					...edge,
					type: edgeType,
					sourceX,
					sourceY,
					targetX,
					targetY,
					sourcePosition,
					targetPosition,
					sourceHandleId,
					targetHandleId
				};
			})
			.filter((e) => e !== null) as WrapEdgeProps[];
	});

	const oppositePosition = {
		[Position.Left]: Position.Right,
		[Position.Right]: Position.Left,
		[Position.Top]: Position.Bottom,
		[Position.Bottom]: Position.Top
	};

	const connectionPathStore = derived(
		[connectionStore, connectionLineTypeStore, connectionModeStore, nodesStore, transformStore],
		([
			$connectionStore,
			$connectionLineTypeStore,
			$connectionModeStore,
			$nodesStore,
			$transformStore
		]) => {
			if (!$connectionStore.nodeId) {
				return null;
			}

			const fromNode = $nodesStore.find((n) => n.id === $connectionStore.nodeId);
			const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
			const handleBoundsStrict = fromHandleBounds?.[$connectionStore.handleType || 'source'] || [];
			const handleBoundsLoose = handleBoundsStrict
				? handleBoundsStrict
				: fromHandleBounds?.[$connectionStore.handleType === 'source' ? 'target' : 'source']!;
			const handleBounds =
				$connectionModeStore === ConnectionMode.Strict ? handleBoundsStrict : handleBoundsLoose;
			const fromHandle = $connectionStore.handleId
				? handleBounds.find((d) => d.id === $connectionStore.handleId)
				: handleBounds[0];
			const fromHandleX = fromHandle
				? fromHandle.x + fromHandle.width / 2
				: (fromNode?.width ?? 0) / 2;
			const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode?.height ?? 0;
			const fromX = (fromNode?.positionAbsolute?.x ?? 0) + fromHandleX;
			const fromY = (fromNode?.positionAbsolute?.y ?? 0) + fromHandleY;
			const fromPosition = fromHandle?.position;
			const toPosition = fromPosition ? oppositePosition[fromPosition] : undefined;

			const pathParams = {
				sourceX: fromX,
				sourceY: fromY,
				sourcePosition: fromPosition,
				targetX: (($connectionStore.position?.x ?? 0) - $transformStore[0]) / $transformStore[2],
				targetY: (($connectionStore.position?.y ?? 0) - $transformStore[1]) / $transformStore[2],
				targetPosition: toPosition
			};

			let path = '';

			if ($connectionLineTypeStore === ConnectionLineType.Bezier) {
				// we assume the destination position is opposite to the source position
				[path] = getBezierPath(pathParams);
			} else if ($connectionLineTypeStore === ConnectionLineType.Step) {
				[path] = getSmoothStepPath({
					...pathParams,
					borderRadius: 0
				});
			} else if ($connectionLineTypeStore === ConnectionLineType.SmoothStep) {
				[path] = getSmoothStepPath(pathParams);
			} else {
				[path] = getStraightPath(pathParams);
			}

			return path;
		}
	);

	function setEdges(edges: Edge[]) {
		edgesStore.set(edges);
	}

	function addEdge(edgeParams: Edge | Connection) {
		const edges = get(edgesStore);
		edgesStore.set(addEdgeUtil(edgeParams, edges));
	}

	function setNodes(nodes: Node[]) {
		nodesStore.update((currentNodes) => {
			const nextNodes = nodes.map((n) => {
				const currentNode = currentNodes.find((cn) => cn.id === n.id) || {};

				return {
					...currentNode,
					...n,
					positionAbsolute: n.position
				};
			});

			return nextNodes;
		});
	}

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

		fitViewOnInitDone =
			fitViewOnInitDone || (fitViewOnInit && !!d3Zoom && !!d3Selection && fitView());

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

	function fitView() {
		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);

		if (!d3Zoom || !d3Selection) {
			return false;
		}

		return fitViewUtil(
			{
				nodes: get(nodesStore) as RFNode[],
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

	function resetSelectedItem<T extends Node | Edge>(item: T) {
		if (item.selected) {
			return {
				...item,
				selected: false
			};
		}

		return item;
	}

	function resetSelectedElements() {
		nodesStore.update((ns) => ns.map(resetSelectedItem));
		edgesStore.update((es) => es.map(resetSelectedItem));
	}

	deleteKeyPressedStore.subscribe((deleteKeyPressed) => {
		if (deleteKeyPressed) {
			const nodes = get(nodesStore);
			const edges = get(edgesStore);
			const selectedNodes = nodes.filter((node) => node.selected);
			const selectedEdges = edges.filter((edge) => edge.selected);

			// @todo can we put this stuff into @reactflow/utils?
			const nodeIds = selectedNodes.map((node) => node.id);
			const edgeIds = selectedEdges.map((edge) => edge.id);
			const nodesToRemove = nodes.reduce<Node[]>((res, node) => {
				const parentHit =
					!nodeIds.includes(node.id) &&
					node.parentNode &&
					res.find((n) => n.id === node.parentNode);
				const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
				if (deletable && (nodeIds.includes(node.id) || parentHit)) {
					res.push(node);
				}

				return res;
			}, []);
			const deletableEdges = edges.filter((e) =>
				typeof e.deletable === 'boolean' ? e.deletable : true
			);
			const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));

			if (nodesToRemove || initialHitEdges) {
				const connectedEdges = getConnectedEdges(nodesToRemove as RFNode[], deletableEdges);
				const edgesToRemove = [...initialHitEdges, ...connectedEdges];
				const edgeIdsToRemove = edgesToRemove.reduce<string[]>((res, edge) => {
					if (!res.includes(edge.id)) {
						res.push(edge.id);
					}
					return res;
				}, []);

				nodesStore.update((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
				edgesStore.update((eds) => eds.filter((edge) => !edgeIdsToRemove.includes(edge.id)));
			}
		}
	});

	function addSelectedNodes(ids: string[]) {
		selectionRectStore.set(null);
		selectionRectModeStore.set(null);

		if (get(multiselectionKeyPressedStore)) {
			// @todo handle multiselection key
		}

		nodesStore.update((ns) =>
			ns.map((node) => {
				return {
					...node,
					selected: ids.includes(node.id)
				};
			})
		);
	}

	function panBy(delta: XYPosition) {
		const { zoom: d3Zoom, selection: d3Selection } = get(d3Store);
		const transform = get(transformStore);
		const width = get(widthStore);
		const height = get(heightStore);

		if (!d3Zoom || !d3Selection || (!delta.x && !delta.y)) {
			return;
		}

		const nextTransform = zoomIdentity
			.translate(transform[0] + delta.x, transform[1] + delta.y)
			.scale(transform[2]);

		const extent: CoordinateExtent = [
			[0, 0],
			[width, height]
		];

		const constrainedTransform = d3Zoom?.constrain()(nextTransform, extent, [
			[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
			[Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
		]);
		d3Zoom.transform(d3Selection, constrainedTransform);
	}

	function updateConnection(connectionUpdate: Partial<ConnectionData> | null) {
		const currentConnectionData = get(connectionStore);
		const nextConnectionData = currentConnectionData
			? {
					...initConnectionData,
					...currentConnectionData,
					...connectionUpdate
			  }
			: {
					...initConnectionData,
					...connectionUpdate
			  };

		connectionStore.set(nextConnectionData);
	}

	function cancelConnection() {
		updateConnection(initConnectionData);
	}

	return {
		nodesStore,
		edgesStore,
		transformStore,
		d3Store,
		heightStore,
		widthStore,
		edgesWithDataStore,
		idStore,
		nodeOriginStore,
		draggingStore,
		selectionRectStore,
		selectionKeyPressedStore,
		deleteKeyPressedStore,
		selectionRectModeStore,
		selectionMode,
		nodeTypesStore,
		edgeTypesStore,
		connectionModeStore,
		domNodeStore,
		connectionStore,
		connectionRadiusStore,
		connectionPathStore,
		setNodes,
		setEdges,
		addEdge,
		updateNodePositions,
		updateNodeDimensions,
		zoomIn,
		zoomOut,
		fitView,
		resetSelectedElements,
		addSelectedNodes,
		panBy,
		updateConnection,
		cancelConnection
	};
}

export function useStore(): SvelteFlowStore {
	const { getStore } = getContext<{ getStore: () => SvelteFlowStore }>(key);

	return getStore();
}
