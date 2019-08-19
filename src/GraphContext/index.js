import React, { createContext, useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'fast-deep-equal';

import { reducer, initialState } from '../state';
import { setNodes, setEdges } from '../state/actions';
import { parseElement, isNode, isEdge } from '../graph-utils';

export const GraphContext = createContext({});

export const Provider = ({
  elements,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const nodes = elements.filter(isNode);
    const edges = elements.filter(isEdge).map(parseElement, state.transform);

    const nextNodes = nodes.map(propNode => {
      const existingNode = state.nodes.find(n => n.id === propNode.id);

      if (existingNode) {
        const data = !isEqual(existingNode.data, propNode.data) ?
          { ...existingNode.data, ...propNode.data } : existingNode.data;

        return {
          ...existingNode,
          data
        };
      }

      return parseElement(propNode, state.transform);
    });

    const nodesChanged = !isEqual(state.nodes, nextNodes);
    const edgesChanged = !isEqual(state.edges, edges);

    if (nodesChanged) {
      dispatch(setNodes(nextNodes));
    }

    if (edgesChanged) {
      dispatch(setEdges(edges));
    }
  });

  const graphContext = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <GraphContext.Provider
      value={graphContext}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const { Consumer } = GraphContext;

Provider.displayName = 'GraphProvider';

Provider.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object)
};

Provider.defaultProps = {
  elements: [],
};
