import React from 'react';

export default ({ children }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'entity')} draggable>
        Table Node
      </div>
      {children}
    </aside>
  );
};
