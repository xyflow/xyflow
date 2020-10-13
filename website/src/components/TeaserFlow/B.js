import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ReactFlow, {
  Handle,
  ReactFlowProvider,
  Background,
  Controls,
} from 'react-flow-renderer';

import TeaserFlow from 'components/TeaserFlow';
import { baseColors } from 'themes';

const NodeWrapper = styled.div`
  background: ${(p) => p.theme.colors.silverLighten30};
  padding: 8px 10px;
  font-size: 12px;
  border-radius: 4px;

  input {
    font-size: 12px;
    border: 1px solid ${(p) => p.theme.colors.violetLighten60};
    width: 100%;
    border-radius: 2px;
    max-width: 100px;
  }

  .react-flow__handle {
    background: ${(p) => p.theme.colors.violetLighten60};
  }
`;

const InputLabel = styled.div`
  color: ${(p) => p.theme.colors.violetLighten60};
`;

const InputNode = ({ id, data, isConnectable }) => {
  return (
    <NodeWrapper>
      <InputLabel>{data.label}:</InputLabel>
      <input
        className="nodrag"
        value={data.value}
        onChange={(event) => data.onChange(event, id)}
      />
      <Handle type="source" position="bottom" isConnectable={isConnectable} />
    </NodeWrapper>
  );
};

const ResultNode = ({ data, isConnectable }) => {
  return (
    <NodeWrapper>
      <div>{data.value}</div>
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ left: '40%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="top"
        id="b"
        style={{ left: '60%' }}
        isConnectable={isConnectable}
      />
    </NodeWrapper>
  );
};

const nodeTypes = {
  nameinput: InputNode,
  result: ResultNode,
};

const onLoad = (rf) => setTimeout(() => rf.fitView({ padding: 0.1 }), 1);

const findNodeById = (id) => (n) => n.id === id;

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

        const forname = nextElements.find(findNodeById('1')).data.value;
        const lastname = nextElements.find(findNodeById('2')).data.value;

        const result = `${forname} ${lastname}`;
        const resultNode = nextElements.find((n) => n.type === 'result');

        resultNode.data = {
          ...resultNode.data,
          value: !forname && !lastname ? '*please enter a name*' : result,
        };

        return nextElements;
      });
    };

    const initialElements = [
      {
        id: '1',
        type: 'nameinput',
        position: {
          x: 0,
          y: 200,
        },
        data: {
          label: 'Forename',
          value: 'React',
          onChange,
        },
      },
      {
        id: '2',
        type: 'nameinput',
        position: {
          x: 400,
          y: 200,
        },
        data: {
          label: 'Lastname',
          value: 'Flow',
          onChange,
        },
      },
      {
        id: '3',
        type: 'result',
        position: {
          x: 200,
          y: 400,
        },
        data: {
          value: 'React Flow',
        },
      },
      {
        id: 'e1',
        source: '1',
        target: '3__a',
        animated: true,
      },
      {
        id: 'e2',
        source: '2',
        target: '3__b',
        animated: true,
      },
    ];

    setElements(initialElements);
  }, []);

  return (
    <TeaserFlow
      title="Customizable"
      description="You can create your own node and edge types or just pass a custom style. You can implement custom UIs inside your nodes and add functionality to your edges."
      textPosition="right"
      isDark
    >
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          nodeTypes={nodeTypes}
          onLoad={onLoad}
          zoomOnScroll={false}
          nodesConnectable={false}
        >
          <Background color={baseColors.silverDarken60} gap={15} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </TeaserFlow>
  );
};
