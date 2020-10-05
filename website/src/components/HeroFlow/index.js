import React, { useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
} from 'react-flow-renderer';

import ColorPickerNode from './ColorPickerNode';

const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

const getOffset = () => {
  if (windowWidth < 800) {
    return 0;
  } else if (windowWidth < 1200) {
    return 405;
  } else {
    return (windowWidth - 1200) / 2 + 405;
  }
};

const getColorNodeX = () => {
  if (windowWidth < 800) {
    return offsetLeft + 440;
  } else if (windowWidth < 1000) {
    return offsetLeft + 300;
  } else if (windowWidth < 1200) {
    return offsetLeft + 400;
  } else {
    return offsetLeft + 550;
  }
};

const offsetLeft = getOffset();

const nodeTypes = {
  colorpicker: ColorPickerNode,
};

const findNodeByColor = (color) => (n) =>
  n.type === 'colorpicker' && n.data.color === color;

export default () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const onChange = (event, id) => {
      setElements((els) => {
        const nextElements = els.map((e) => {
          if (e.id !== id) {
            return e;
          }

          const value = event.target.value;

          return {
            ...e,
            data: {
              ...e.data,
              value,
            },
          };
        });

        const red = nextElements.find(findNodeByColor('red')).data.value;
        const green = nextElements.find(findNodeByColor('green')).data.value;
        const blue = nextElements.find(findNodeByColor('blue')).data.value;

        const background = `rgb(${red}, ${green}, ${blue})`;
        const colorNode = nextElements.find((n) => n.id === '4');
        colorNode.style = {
          background,
        };
        colorNode.data = {
          ...colorNode.data,
          label: background,
        };

        return nextElements;
      });
    };

    const initialElements = [
      {
        id: '1',
        type: 'colorpicker',
        data: { color: 'red', value: 105, onChange },
        sourcePosition: 'right',
        position: { x: offsetLeft + 50, y: 5 },
      },
      {
        id: '2',
        type: 'colorpicker',
        data: { color: 'green', value: 100, onChange },
        sourcePosition: 'right',
        position: { x: offsetLeft, y: 150 },
      },
      {
        id: '3',
        data: { color: 'blue', value: 165, onChange },
        type: 'colorpicker',
        sourcePosition: 'right',
        position: { x: offsetLeft + 120, y: 300 },
      },
      {
        id: '4',
        data: { label: 'rgb(105, 100, 165)' },
        targetPosition: 'left',
        sourcePosition: 'right',
        position: { x: getColorNodeX(), y: 180 },
        style: {
          background: 'rgb(105, 100, 165)',
          color: 'white',
          textShadow:
            'rgba(0, 0, 0, 0.4) 1px 0px 0px, rgba(0, 0, 0, 0.4) -1px 0px 0px, rgba(0, 0, 0, 0.4) 0px 1px 0px, rgba(0, 0, 0, 0.4) 0px -1px 0px',
        },
      },
      { id: 'e1-4', source: '1', target: '4', animated: true },
      { id: 'e2-4', source: '2', target: '4', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
    ];

    setElements(initialElements);
  }, []);

  return (
    <ReactFlowProvider>
      <ReactFlow elements={elements} zoomOnScroll={false} nodeTypes={nodeTypes}>
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};
