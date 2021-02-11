import isEqual from 'fast-deep-equal';

import { getDimensions } from '../utils';
import { getNodesInside, getConnectedEdges, getRectOfNodes, isNode, isEdge, parseElement } from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';

import { ReactFlowState, FlowElement, Node, XYPosition } from '../types';
import {
  ADD_SELECTED_ELEMENTS,
  BATCH_UPDATE_NODE_DIMENSIONS,
  INIT_D3ZOOM,
  RESET_SELECTED_ELEMENTS,
  SET_CONNECTION_MODE,
  SET_CONNECTION_NODEID,
  SET_CONNECTION_POSITION,
  SET_ELEMENTS,
  SET_ELEMENTS_SELECTABLE,
  SET_INTERACTIVE,
  SET_MAXZOOM,
  SET_MINZOOM,
  SET_MULTI_SELECTION_ACTIVE,
  SET_NODES_CONNECTABLE,
  SET_NODES_DRAGGABLE,
  SET_NODE_EXTENT,
  SET_ON_CONNECT,
  SET_ON_CONNECT_END,
  SET_ON_CONNECT_START,
  SET_ON_CONNECT_STOP,
  SET_SELECTED_ELEMENTS,
  SET_SNAPGRID,
  SET_SNAPTOGRID,
  SET_TRANSLATEEXTENT,
  SET_USER_SELECTION,
  UNSET_USER_SELECTION,
  UPDATE_NODE_DIMENSIONS,
  UPDATE_NODE_POS,
  UPDATE_NODE_POS_DIFF,
  UPDATE_SIZE,
  UPDATE_TRANSFORM,
  UPDATE_USER_SELECTION,
} from './contants';
import { ReactFlowAction } from './actions';

import { initialState } from './index';

export default function reactFlowReducer(state = initialState, action: ReactFlowAction): ReactFlowState {
  switch (action.type) {
    case SET_ELEMENTS: {
      const propElements = action.payload;

      const nextElements = propElements.map((el: FlowElement) => {
        let storeElement = state.elements.find((se) => se.id === el.id);

        // update existing element
        if (storeElement) {
          if (isNode(storeElement)) {
            const propNode = el as Node;
            const positionChanged =
              storeElement.position.x !== propNode.position.x || storeElement.position.y !== propNode.position.y;
            const typeChanged = typeof propNode.type !== 'undefined' && propNode.type !== storeElement.type;

            storeElement = {
              ...storeElement,
              ...propNode,
            };

            if (positionChanged) {
              (storeElement as Node).__rf.position = propNode.position;
            }

            if (typeChanged) {
              // we reset the elements dimensions here in order to force a re-calculation of the bounds.
              // When the type of a node changes it is possible that the number or positions of handles changes too.
              (storeElement as Node).__rf.width = null;
            }
          } else {
            storeElement = {
              ...storeElement,
              ...el,
            };
          }

          return storeElement;
        } else {
          // add new element
          return parseElement(el, state.nodeExtent);
        }
      });

      return { ...state, elements: nextElements };
    }
    case BATCH_UPDATE_NODE_DIMENSIONS: {
      const updatedElements = state.elements.map((el) => {
        const update = action.payload.find((u) => u.id === el.id);
        if (update) {
          const dimensions = getDimensions(update.nodeElement);
          const nodeToUpdate = el as Node;

          if (
            dimensions.width &&
            dimensions.height &&
            (nodeToUpdate.__rf.width !== dimensions.width || nodeToUpdate.__rf.height !== dimensions.height)
          ) {
            const handleBounds = getHandleBounds(update.nodeElement, state.transform[2]);

            return {
              ...nodeToUpdate,
              __rf: {
                ...nodeToUpdate.__rf,
                ...dimensions,
                handleBounds,
              },
            };
          }
        }

        return el;
      });

      return {
        ...state,
        elements: updatedElements,
      };
    }
    case UPDATE_NODE_DIMENSIONS: {
      const { nodeElement, id } = action.payload;
      const dimensions = getDimensions(nodeElement);

      if (!dimensions.width || !dimensions.height) {
        return state;
      }

      const nextElements = state.elements.map((el) => {
        if (el.id === id && isNode(el)) {
          const handleBounds = getHandleBounds(nodeElement, state.transform[2]);

          return {
            ...el,
            __rf: {
              ...el.__rf,
              width: dimensions.width,
              height: dimensions.height,
              handleBounds,
            },
          };
        }

        return el;
      });

      return { ...state, elements: nextElements };
    }
    case UPDATE_NODE_POS: {
      const { id, pos } = action.payload;

      let position: XYPosition = pos;

      if (state.snapToGrid) {
        const [gridSizeX, gridSizeY] = state.snapGrid;
        position = {
          x: gridSizeX * Math.round(pos.x / gridSizeX),
          y: gridSizeY * Math.round(pos.y / gridSizeY),
        };
      }

      const nextElements = state.elements.map((el) => {
        if (el.id === id && isNode(el)) {
          return {
            ...el,
            __rf: {
              ...el.__rf,
              position,
            },
          };
        }

        return el;
      });

      return { ...state, elements: nextElements };
    }
    case UPDATE_NODE_POS_DIFF: {
      const { id, diff, isDragging } = action.payload;

      const nextElements = state.elements.map((el) => {
        if (isNode(el) && (id === el.id || state.selectedElements?.find((sNode) => sNode.id === el.id))) {
          if (diff) {
            return {
              ...el,
              __rf: {
                ...el.__rf,
                isDragging,
                position: {
                  x: el.__rf.position.x + diff.x,
                  y: el.__rf.position.y + diff.y,
                },
              },
            };
          }

          return {
            ...el,
            __rf: {
              ...el.__rf,
              isDragging,
            },
          };
        }

        return el;
      });

      return { ...state, elements: nextElements };
    }
    case SET_USER_SELECTION: {
      const mousePos = action.payload;

      const userSelectionRect = {
        width: 0,
        height: 0,
        startX: mousePos.x,
        startY: mousePos.y,
        x: mousePos.x,
        y: mousePos.y,
        draw: true,
      };

      return {
        ...state,
        userSelectionRect,
        selectionActive: true,
      };
    }
    case UPDATE_USER_SELECTION: {
      const mousePos = action.payload;
      const startX = state.userSelectionRect.startX || 0;
      const startY = state.userSelectionRect.startY || 0;

      const negativeX = mousePos.x < startX;
      const negativeY = mousePos.y < startY;

      const nextUserSelectRect = {
        ...state.userSelectionRect,
        x: negativeX ? mousePos.x : state.userSelectionRect.x,
        y: negativeY ? mousePos.y : state.userSelectionRect.y,
        width: Math.abs(mousePos.x - startX),
        height: Math.abs(mousePos.y - startY),
      };

      const nodes = state.elements.filter(isNode);
      const edges = state.elements.filter(isEdge);

      const selectedNodes = getNodesInside(nodes, nextUserSelectRect, state.transform);
      const selectedEdges = getConnectedEdges(selectedNodes, edges);

      const nextSelectedElements = [...selectedNodes, ...selectedEdges];
      const selectedElementsUpdated = !isEqual(nextSelectedElements, state.selectedElements);

      if (selectedElementsUpdated) {
        return {
          ...state,
          selectedElements: nextSelectedElements.length > 0 ? nextSelectedElements : null,
          userSelectionRect: nextUserSelectRect,
        };
      }

      return {
        ...state,
        userSelectionRect: nextUserSelectRect,
      };
    }
    case UNSET_USER_SELECTION: {
      const selectedNodes = state.selectedElements?.filter((node) => isNode(node) && node.__rf) as Node[];

      const selectionActive = false;
      const userSelectionRect = {
        ...state.userSelectionRect,
        draw: false,
      };

      if (!selectedNodes || selectedNodes.length === 0) {
        return {
          ...state,
          selectionActive,
          userSelectionRect,
          selectedElements: null,
          nodesSelectionActive: false,
        };
      }

      const selectedNodesBbox = getRectOfNodes(selectedNodes);

      return {
        ...state,
        selectionActive,
        userSelectionRect,
        selectedNodesBbox,
        nodesSelectionActive: true,
      };
    }
    case SET_SELECTED_ELEMENTS: {
      const elements = action.payload;
      const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
      const selectedElementsUpdated = !isEqual(selectedElementsArr, state.selectedElements);
      const selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;

      return {
        ...state,
        selectedElements,
      };
    }
    case ADD_SELECTED_ELEMENTS: {
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
    case INIT_D3ZOOM: {
      const { d3Zoom, d3Selection, d3ZoomHandler, transform } = action.payload;

      return {
        ...state,
        d3Zoom,
        d3Selection,
        d3ZoomHandler,
        transform,
      };
    }
    case SET_MINZOOM: {
      const minZoom = action.payload;

      if (state.d3Zoom) {
        state.d3Zoom.scaleExtent([minZoom, state.maxZoom]);
      }

      return {
        ...state,
        minZoom,
      };
    }

    case SET_MAXZOOM: {
      const maxZoom = action.payload;

      if (state.d3Zoom) {
        state.d3Zoom.scaleExtent([state.minZoom, maxZoom]);
      }

      return {
        ...state,
        maxZoom,
      };
    }
    case SET_TRANSLATEEXTENT: {
      const translateExtent = action.payload;

      if (state.d3Zoom) {
        state.d3Zoom.translateExtent(translateExtent);
      }

      return {
        ...state,
        translateExtent,
      };
    }
    case SET_ON_CONNECT:
    case SET_ON_CONNECT_START:
    case SET_ON_CONNECT_STOP:
    case SET_ON_CONNECT_END:
    case RESET_SELECTED_ELEMENTS:
    case UPDATE_TRANSFORM:
    case UPDATE_SIZE:
    case SET_CONNECTION_POSITION:
    case SET_CONNECTION_NODEID:
    case SET_SNAPTOGRID:
    case SET_SNAPGRID:
    case SET_INTERACTIVE:
    case SET_NODES_DRAGGABLE:
    case SET_NODES_CONNECTABLE:
    case SET_ELEMENTS_SELECTABLE:
    case SET_MULTI_SELECTION_ACTIVE:
    case SET_CONNECTION_MODE:
    case SET_NODE_EXTENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
