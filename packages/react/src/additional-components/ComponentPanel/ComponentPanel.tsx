import { memo, useState, useCallback, DragEvent } from 'react';
import cc from 'classcat';
import type { ComponentPanelProps, ComponentDefinition } from './types';

function ComponentPanelComponent({
  components = [],
  style,
  className,
  position = 'top-left',
  searchPlaceholder = 'Search components...',
  emptyMessage = 'No components found',
  onComponentDragStart,
}: ComponentPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = components.filter((component) =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = useCallback(
    (event: DragEvent, component: ComponentDefinition) => {
      event.dataTransfer.setData('application/reactflow', component.type);
      event.dataTransfer.effectAllowed = 'move';
      onComponentDragStart?.(event, component);
    },
    [onComponentDragStart]
  );

  return (
    <div
      className={cc(['react-flow__component-panel', className])}
      style={{
        position: 'absolute',
        zIndex: 5,
        ...style,
        ...(position === 'top-left' && { top: 10, left: 10 }),
        ...(position === 'top-right' && { top: 10, right: 10 }),
        ...(position === 'bottom-left' && { bottom: 10, left: 10 }),
        ...(position === 'bottom-right' && { bottom: 10, right: 10 }),
      }}
      data-testid="rf__component-panel"
    >
      <div className="react-flow__component-panel-header">
        <h3 className="react-flow__component-panel-title">Components</h3>
        <input
          type="text"
          className="react-flow__component-panel-search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="react-flow__component-panel-content">
        {filteredComponents.length === 0 ? (
          <div className="react-flow__component-panel-empty">{emptyMessage}</div>
        ) : (
          filteredComponents.map((component) => (
            <div
              key={component.type}
              className="react-flow__component-panel-item"
              draggable
              onDragStart={(event) => handleDragStart(event, component)}
              style={{
                backgroundColor: component.color,
              }}
            >
              {component.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ComponentPanelComponent.displayName = 'ComponentPanel';

/**
 * The `<ComponentPanel />` component renders a searchable panel with draggable components
 * that can be added to the canvas.
 *
 * @public
 * @example
 * ```tsx
 * import { ReactFlow, ComponentPanel } from '@xyflow/react'
 *
 * const components = [
 *   { type: 'led', label: 'LED', color: '#ff0000' },
 *   { type: 'resistor', label: 'Resistor', color: '#d5b597' },
 * ]
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow nodes={[...]} edges={[...]}>
 *       <ComponentPanel components={components} />
 *     </ReactFlow>
 *   )
 * }
 * ```
 */
export const ComponentPanel = memo(ComponentPanelComponent);
