import isEqual from 'fast-deep-equal';

import { clampPosition, getDimensions } from '../utils';
import { getNodesInside, getConnectedEdges, getRectOfNodes, isNode, parseNode, parseEdge } from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';
import { getSourceTargetNodes } from '../container/EdgeRenderer/utils';

import { ReactFlowState, Node, XYPosition, Edge, ElementChange } from '../types';
import * as constants from './contants';
import { ReactFlowAction } from './actions';

import { initialState } from './index';

export default function reactFlowReducer(state = initialState, action: ReactFlowAction): ReactFlowState {
  switch (action.type) {
    case constants.SET_NODES: {
      const propNodes = action.payload;
      const nextNodes = propNodes.map((propNode: Node) => {
        const storeNode = state.nodes.find((node) => node.id === propNode.id);

        if (storeNode) {
          if (typeof propNode.type !== 'undefined' && propNode.type !== storeNode.type) {
            const updatedNode: Node = {
              ...storeNode,
              ...propNode,
            };
            // we reset the elements dimensions here in order to force a re-calculation of the bounds.
            // When the type of a node changes it is possible that the number or positions of handles changes too.
            updatedNode.width = null;
            return updatedNode;
          }
        }

        return parseNode(propNode, state.nodeExtent);
      });

      const updatedEdges = state.edges.map((edge) => {
        const { sourceNode, targetNode } = getSourceTargetNodes(edge, nextNodes);

        if (sourceNode) {
          edge.sourceNode = sourceNode;
        }
        if (targetNode) {
          edge.targetNode = targetNode;
        }

        return edge;
      });

      return { ...state, nodes: nextNodes, edges: updatedEdges };
    }
    case constants.SET_EDGES: {
      const propElements = action.payload;
      const nextEdges = propElements.map((propEdge: Edge) => {
        const storeEdge = state.edges.find((se) => se.id === propEdge.id);

        if (storeEdge) {
          return parseEdge(propEdge);
        } else {
          const parsedEdge = parseEdge(propEdge);
          const { sourceNode, targetNode } = getSourceTargetNodes(parsedEdge, state.nodes);

          if (sourceNode) {
            parsedEdge.sourceNode = sourceNode;
          }
          if (targetNode) {
            parsedEdge.targetNode = targetNode;
          }

          return parsedEdge;
        }
      });

      return { ...state, edges: nextEdges };
    }
    case constants.UPDATE_NODE_DIMENSIONS: {
      const initialChanges: ElementChange[] = [];
      const nodesToChange: ElementChange[] = state.nodes.reduce((res, node) => {
        const update = action.payload.find((u) => u.id === node.id);
        if (update) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate =
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate);

          if (doUpdate) {
            const handleBounds = getHandleBounds(update.nodeElement, state.transform[2]);
            const change = {
              id: node.id,
              change: {
                ...dimensions,
                handleBounds,
              },
            } as ElementChange;

            res.push(change);
          }
        }

        return res;
      }, initialChanges);

      if (state.onNodesChange) {
        requestAnimationFrame(() => state.onNodesChange?.(nodesToChange));
      }

      return state;
    }
    case constants.UPDATE_NODE_POS: {
      const { id, pos } = action.payload;
      let position: XYPosition = pos;

      if (state.snapToGrid) {
        const [gridSizeX, gridSizeY] = state.snapGrid;
        position = {
          x: gridSizeX * Math.round(pos.x / gridSizeX),
          y: gridSizeY * Math.round(pos.y / gridSizeY),
        };
      }

      if (state.onNodesChange) {
        state.onNodesChange([{ id, change: { position } }]);

        return state;
      }

      const nextNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            position,

            __rf: {
              ...node.__rf,
            },
          };
        }

        return node;
      });

      return { ...state, nodes: nextNodes };
    }
    case constants.UPDATE_NODE_POS_DIFF: {
      const { id, diff, isDragging } = action.payload;

      if (state.onNodesChange && id && diff) {
        const matchingNode = state.nodes.find((n) => n.id === id);

        if (matchingNode) {
          requestAnimationFrame(() =>
            state.onNodesChange?.([
              {
                id,
                change: {
                  position: {
                    x: matchingNode.position.x + diff.x,
                    y: matchingNode.position.y + diff.y,
                    isDragging,
                  },
                },
              },
            ])
          );
        }
      }

      return state;
    }
    case constants.SET_USER_SELECTION: {
      const mousePos = action.payload;

      return {
        ...state,
        selectionActive: true,
        userSelectionRect: {
          width: 0,
          height: 0,
          startX: mousePos.x,
          startY: mousePos.y,
          x: mousePos.x,
          y: mousePos.y,
          draw: true,
        },
      };
    }
    case constants.UPDATE_USER_SELECTION: {
      const mousePos = action.payload;
      const startX = state.userSelectionRect.startX ?? 0;
      const startY = state.userSelectionRect.startY ?? 0;

      const nextUserSelectRect = {
        ...state.userSelectionRect,
        x: mousePos.x < startX ? mousePos.x : state.userSelectionRect.x,
        y: mousePos.y < startY ? mousePos.y : state.userSelectionRect.y,
        width: Math.abs(mousePos.x - startX),
        height: Math.abs(mousePos.y - startY),
      };

      const selectedNodes = getNodesInside(state.nodes, nextUserSelectRect, state.transform, false, true);
      const selectedEdges = getConnectedEdges(selectedNodes, state.edges);

      const nextSelectedElements = [...selectedNodes, ...selectedEdges];
      const selectedElementsChanged = !isEqual(nextSelectedElements, state.selectedElements);
      const selectedElementsUpdate = selectedElementsChanged
        ? {
            selectedElements: nextSelectedElements.length > 0 ? nextSelectedElements : null,
          }
        : {};

      return {
        ...state,
        ...selectedElementsUpdate,
        userSelectionRect: nextUserSelectRect,
      };
    }
    case constants.UNSET_USER_SELECTION: {
      const selectedNodes = state.selectedElements?.filter((node) => isNode(node) && node.__rf) as Node[];

      const stateUpdate = {
        ...state,
        selectionActive: false,
        userSelectionRect: {
          ...state.userSelectionRect,
          draw: false,
        },
      };

      if (!selectedNodes || selectedNodes.length === 0) {
        stateUpdate.selectedElements = null;
        stateUpdate.nodesSelectionActive = false;
      } else {
        const selectedNodesBbox = getRectOfNodes(selectedNodes);
        stateUpdate.selectedNodesBbox = selectedNodesBbox;
        stateUpdate.nodesSelectionActive = true;
      }

      return stateUpdate;
    }
    case constants.SET_SELECTED_ELEMENTS: {
      const elements = action.payload;
      const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
      const selectedElementsUpdated = !isEqual(selectedElementsArr, state.selectedElements);
      const selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;

      return {
        ...state,
        selectedElements,
      };
    }
    case constants.ADD_SELECTED_ELEMENTS: {
      const { multiSelectionActive, selectedElements } = state;
      const elements = action.payload;
      const selectedElementsArr = Array.isArray(elements) ? elements : [elements];

      let nextElements = selectedElementsArr;

      if (multiSelectionActive) {
        nextElements = selectedElements ? [...selectedElements, ...selectedElementsArr] : selectedElementsArr;
      }

      const selectedElementsUpdated = !isEqual(nextElements, state.selectedElements);
      const nextSelectedElements = selectedElementsUpdated ? nextElements : state.selectedElements;

      return { ...state, selectedElements: nextSelectedElements };
    }
    case constants.INIT_D3ZOOM: {
      const { d3Zoom, d3Selection, d3ZoomHandler, transform } = action.payload;

      return {
        ...state,
        d3Zoom,
        d3Selection,
        d3ZoomHandler,
        transform,
      };
    }
    case constants.SET_MINZOOM: {
      const minZoom = action.payload;

      state.d3Zoom?.scaleExtent([minZoom, state.maxZoom]);

      return {
        ...state,
        minZoom,
      };
    }

    case constants.SET_MAXZOOM: {
      const maxZoom = action.payload;

      state.d3Zoom?.scaleExtent([state.minZoom, maxZoom]);

      return {
        ...state,
        maxZoom,
      };
    }
    case constants.SET_TRANSLATEEXTENT: {
      const translateExtent = action.payload;

      state.d3Zoom?.translateExtent(translateExtent);

      return {
        ...state,
        translateExtent,
      };
    }
    case constants.SET_NODE_EXTENT: {
      const nodeExtent = action.payload;
      return {
        ...state,
        nodeExtent,
        nodes: state.nodes.map((node) => {
          return {
            ...node,
            position: clampPosition(node.position, nodeExtent),
            __rf: {
              ...node.__rf,
            },
          };
        }),
      };
    }
    case constants.SET_ON_CONNECT:
    case constants.SET_ON_CONNECT_START:
    case constants.SET_ON_CONNECT_STOP:
    case constants.SET_ON_CONNECT_END:
    case constants.RESET_SELECTED_ELEMENTS:
    case constants.UNSET_NODES_SELECTION:
    case constants.UPDATE_TRANSFORM:
    case constants.UPDATE_SIZE:
    case constants.SET_CONNECTION_POSITION:
    case constants.SET_CONNECTION_NODEID:
    case constants.SET_SNAPTOGRID:
    case constants.SET_SNAPGRID:
    case constants.SET_INTERACTIVE:
    case constants.SET_NODES_DRAGGABLE:
    case constants.SET_NODES_CONNECTABLE:
    case constants.SET_ELEMENTS_SELECTABLE:
    case constants.SET_MULTI_SELECTION_ACTIVE:
    case constants.SET_CONNECTION_MODE:
    case constants.SET_ON_NODES_CHANGE:
    case constants.SET_ON_EDGES_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
