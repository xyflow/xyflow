import { useEffect } from 'react';
import isEqual from 'fast-deep-equal';

import { useStoreState, useStoreActions } from '../store/hooks';
import { parseElement, isNode, isEdge } from '../utils/graph';
import { Elements, Node, Edge, FlowElement } from '../types';

const useElementUpdater = (propElements: Elements): void => {
  const stateElements = useStoreState((state) => state.elements);
  const setElements = useStoreActions((actions) => actions.setElements);

  useEffect(() => {
    const nextElements: Elements = propElements.map((propElement) => {
      const existingElement = stateElements.find((el) => el.id === propElement.id);

      if (existingElement) {
        const data = !isEqual(existingElement.data, propElement.data)
          ? { ...existingElement.data, ...propElement.data }
          : existingElement.data;

        const style = !isEqual(existingElement.style, propElement.style)
          ? { ...existingElement.style, ...propElement.style }
          : existingElement.style;

        const elementProps = {
          ...existingElement,
        };

        if (typeof data !== 'undefined') {
          elementProps.data = data;
        }

        if (typeof style !== 'undefined') {
          elementProps.style = style;
        }

        if (typeof propElement.className !== 'undefined') {
          elementProps.className = propElement.className;
        }

        if (typeof propElement.isHidden !== 'undefined') {
          elementProps.isHidden = propElement.isHidden;
        }
        
        if (typeof propElement.type !== 'undefined') {
          elementProps.type = propElement.type;
        }

        if (isNode(existingElement)) {
          const propNode = propElement as Node;
          const nodeProps = elementProps as Node;

          const positionChanged =
            existingElement.position.x !== propNode.position.x || existingElement.position.y !== propNode.position.y;

          if (positionChanged) {
            nodeProps.__rf = {
              ...existingElement.__rf,
              position: propNode.position,
            };
            nodeProps.position = propNode.position;
          }

          if (typeof propNode.draggable !== 'undefined') {
            nodeProps.draggable = propNode.draggable;
          }

          if (typeof propNode.selectable !== 'undefined') {
            nodeProps.selectable = propNode.selectable;
          }

          if (typeof propNode.connectable !== 'undefined') {
            nodeProps.connectable = propNode.connectable;
          }

          return nodeProps;
        } else if (isEdge(existingElement)) {
          const propEdge = propElement as Edge;
          const edgeProps = elementProps as Edge;

          const labelStyle = !isEqual(existingElement.labelStyle, propEdge.labelStyle)
            ? { ...existingElement.labelStyle, ...propEdge.labelStyle }
            : existingElement.labelStyle;

          const labelBgStyle = !isEqual(existingElement.labelBgStyle, propEdge.labelBgStyle)
            ? { ...existingElement.labelBgStyle, ...propEdge.labelBgStyle }
            : existingElement.labelBgStyle;

          if (typeof propEdge.label !== 'undefined') {
            edgeProps.label = propEdge.label;
          }

          if (typeof labelStyle !== 'undefined') {
            edgeProps.labelStyle = labelStyle;
          }

          if (typeof propEdge.labelShowBg !== 'undefined') {
            edgeProps.labelShowBg = propEdge.labelShowBg;
          }

          if (typeof propEdge.labelBgPadding !== 'undefined') {
            edgeProps.labelBgPadding = propEdge.labelBgPadding;
          }

          if (typeof propEdge.labelBgBorderRadius !== 'undefined') {
            edgeProps.labelBgBorderRadius = propEdge.labelBgBorderRadius;
          }

          if (typeof labelBgStyle !== 'undefined') {
            edgeProps.labelBgStyle = labelBgStyle;
          }

          if (typeof propEdge.animated !== 'undefined') {
            edgeProps.animated = propEdge.animated;
          }

          if (typeof propEdge.arrowHeadType !== 'undefined') {
            edgeProps.arrowHeadType = propEdge.arrowHeadType;
          }

          return edgeProps;
        }
      }

      return parseElement(propElement) as FlowElement;
    });

    const elementsChanged: boolean = !isEqual(stateElements, nextElements);

    if (elementsChanged) {
      setElements(nextElements);
    }
  }, [propElements, stateElements]);
};

export default useElementUpdater;
