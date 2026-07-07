import { type ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Panel,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type OnConnect,
} from '@xyflow/react';

import { colorModeReactConfig } from 'storybook-shared/flow-configs/color-mode';
import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/play-helpers/suite';

type PageTheme = 'system' | ColorMode;

export function ColorModeStory() {
  const [pageTheme, setPageTheme] = useState<PageTheme>('system');
  const [resetKey, setResetKey] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState(colorModeReactConfig.flowProps?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(colorModeReactConfig.flowProps?.edges ?? []);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges]
  );

  useEffect(() => {
    const reset = () => {
      setPageTheme('system');
      document.documentElement.removeAttribute('data-theme');
      setNodes(colorModeReactConfig.flowProps?.nodes ?? []);
      setEdges(colorModeReactConfig.flowProps?.edges ?? []);
      setResetKey((key) => key + 1);
    };

    window.addEventListener(FLOW_STORY_RESET_EVENT, reset);
    return () => window.removeEventListener(FLOW_STORY_RESET_EVENT, reset);
  }, [setEdges, setNodes]);

  const onPageThemeChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value as PageTheme;

    setPageTheme(value);

    if (value === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', value);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        key={resetKey}
        {...colorModeReactConfig.flowProps}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Panel position="top-right">
          <label>
            Page theme (html data-theme)
            <select onChange={onPageThemeChange} value={pageTheme} data-testid="colormode-select">
              <option value="system">system</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
        </Panel>
      </ReactFlow>
    </div>
  );
}
