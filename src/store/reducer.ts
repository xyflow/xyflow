import isEqual from 'fast-deep-equal';

import { clampPosition, getDimensions } from '../utils';
import {
  getNodesInside,
  getConnectedEdges,
  getRectOfNodes,
  isNode,
  isEdge,
  parseNode,
  parseEdge,
} from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';

import { ReactFlowState, Node, XYPosition, Edge } from '../types';
import * as constants from './contants';
import { ReactFlowAction } from './actions';

import { initialState } from './index';

type NextElements = {
  nextNodes: Node[];
  nextEdges: Edge[];
};

export default function reactFlowReducer(state = initialState, action: ReactFlowAction): ReactFlowState {
  switch (action.type) {
    case constants.SET_ELEMENTS: {
      const propElements = action.payload;
      const nextElements: NextElements = {
        nextNodes: [],
        nextEdges: [],
      };
      const { nextNodes, nextEdges } = propElements.reduce((res, propElement): NextElements => {
        if (isNode(propElement)) {
          const storeNode = state.nodes.find((node) => node.id === propElement.id);

          if (storeNode) {
            const updatedNode: Node = {
              ...storeNode,
              ...propElement,
            };

            if (storeNode.position.x !== propElement.position.x || storeNode.position.y !== propElement.position.y) {
              updatedNode.__rf.position = propElement.position;
            }

            if (typeof propElement.type !== 'undefined' && propElement.type !== storeNode.type) {
              // we reset the elements dimensions here in order to force a re-calculation of the bounds.
              // When the type of a node changes it is possible that the number or positions of handles changes too.
              updatedNode.__rf.width = null;
            }

            res.nextNodes.push(updatedNode);
          } else {
            res.nextNodes.push(parseNode(propElement, state.nodeExtent));
          }
        } else if (isEdge(propElement)) {
          const storeEdge = state.edges.find((se) => se.id === propElement.id);

          if (storeEdge) {
            res.nextEdges.push({
              ...storeEdge,
              ...propElement,
            });
          } else {
            res.nextEdges.push(parseEdge(propElement));
          }
        }

        return res;
      }, nextElements);

      return { ...state, nodes: nextNodes, edges: nextEdges };
    }
    case constants.UPDATE_NODE_DIMENSIONS: {
      const updatedNodes = state.nodes.map((node) => {
        const update = action.payload.find((u) => u.id === node.id);
        if (update) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate =
            dimensions.width &&
            dimensions.height &&
            (node.__rf.width !== dimensions.width || node.__rf.height !== dimensions.height || update.forceUpdate);

          if (doUpdate) {
            const handleBounds = getHandleBounds(update.nodeElement, state.transform[2]);

            return {
              ...node,
              __rf: {
                ...node.__rf,
                ...dimensions,
                handleBounds,
              },
            };
          }
        }

        return node;
      });

      return {
        ...state,
        nodes: updatedNodes,
      };
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

      const nextNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            __rf: {
              ...node.__rf,
              position,
            },
          };
        }

        return node;
      });

      return { ...state, nodes: nextNodes };
    }
    case constants.UPDATE_NODE_POS_DIFF: {
      const { id, diff, isDragging } = action.payload;

      const nextNodes = state.nodes.map((node) => {
        if (id === node.id || state.selectedElements?.find((sNode) => sNode.id === node.id)) {
          const updatedNode = {
            ...node,
            __rf: {
              ...node.__rf,
              isDragging,
            },
          };

          if (diff) {
            updatedNode.__rf.position = {
              x: node.__rf.position.x + diff.x,
              y: node.__rf.position.y + diff.y,
            };
          }

          return updatedNode;
        }

        return node;
      });

      return { ...state, nodes: nextNodes };
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
        x: mousePos.x < startX ? mousePos.x : startX,
        y: mousePos.y < startY ? mousePos.y : startY,
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
            __rf: {
              ...node.__rf,
              position: clampPosition(node.__rf.position, nodeExtent),
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
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
