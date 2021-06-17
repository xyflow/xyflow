import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeData: object) => {
  event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event: DragEvent) => onDragStart(event, { nodeType: "input", label: "Input Node" })} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, { nodeType: "default", label: "Default Node" })} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event: DragEvent) => onDragStart(event, { nodeType: "output", label: "Output Node" })} draggable>
        Output Node
      </div>
      <div className="react-flow__node-multihandle" draggable
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            nodeType: "multihandle",
            handles: {
              top: { type: "target", ids: ["top_1", "top_2", "top_3"] },
              bottom: { type: "source", ids: ["bottom_1", "bottom_2"] },
              left: { type: "target", ids: ["left_1"] },
              right: { type: "source", ids: ["right_1"] },
            },
            label: "Multi-handle node (3-2-1-1)",
          })
        }
      >
        Multi-handle node (3-2-1-1)
      </div>
    </aside>
  );
};

export default Sidebar;
