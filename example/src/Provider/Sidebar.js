import React from 'react';
import { useStoreState, useStoreActions } from 'react-flow-renderer';

const Sidebar = () => {
  const nodes = useStoreState((store) => store.nodes);
  const transform = useStoreState((store) => store.transform);
  const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

  const selectAll = () => {
    setSelectedElements(nodes.map((node) => ({ id: node.id, type: node.type })));
  };

  return (
    <aside>
      <div className="description">
        This is an example of how you can access the internal state outside of the ReactFlow component.
      </div>
      <div className="title">Zoom & pan transform</div>
      <div className="transform">
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div className="title">Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.__rf.position.x.toFixed(2)}, y: {node.__rf.position.y.toFixed(2)}
        </div>
      ))}

      <div className="selectall">
        <button onClick={selectAll}>select all nodes</button>
      </div>
    </aside>
  );
};

export default Sidebar;
