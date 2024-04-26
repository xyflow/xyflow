import cc from 'classcat';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useSolidFlow } from '../../hooks/useReactFlow';
import { Panel } from '../../components/Panel';
import { type SolidFlowState } from '../../types';

import { PlusIcon } from './Icons/Plus';
import { MinusIcon } from './Icons/Minus';
import { FitViewIcon } from './Icons/FitView';
import { LockIcon } from './Icons/Lock';
import { UnlockIcon } from './Icons/Unlock';
import { ControlButton } from './ControlButton';
import type { ControlProps } from './types';
import { Show, mergeProps, JSX } from 'solid-js';
import { PanelPosition } from '@xyflow/system';

const selector = (s: SolidFlowState) => ({
  isInteractive: () => s.nodesDraggable.get() || s.nodesConnectable.get() || s.elementsSelectable.get(),
  minZoomReached: () => s.transform.get()[2] <= s.minZoom.get(),
  maxZoomReached: () => s.transform.get()[2] >= s.maxZoom.get(),
});

function ControlsComponent(_p: ControlProps) {
  //   style,
  //   showZoom = true,
  //   showFitView = true,
  //   showInteractive = true,
  //   fitViewOptions,
  //   onZoomIn,
  //   onZoomOut,
  //   onFitView,
  //   onInteractiveChange,
  //   className,
  //   children,
  //   position = 'bottom-left',
  //   orientation = 'vertical',
  //   'aria-label': ariaLabel = 'React Flow controls',
  // }: ControlProps) {
  const p = mergeProps(
    {
      showZoom: true,
      showFitView: true,
      showInteractive: true,
      position: 'bottom-left' as PanelPosition,
      orientation: 'vertical',
      'aria-label': 'React Flow controls',
    },
    _p
  );

  const store = useStoreApi();
  const storeData = useStore(selector);
  const { zoomIn, zoomOut, fitView } = useSolidFlow();

  const onZoomInHandler = () => {
    zoomIn();
    p.onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut();
    p.onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView(p.fitViewOptions);
    p.onFitView?.();
  };

  const onToggleInteractivity = () => {
    store.batch((store) => {
      store.nodesDraggable.set(!storeData.isInteractive());
      store.nodesConnectable.set(!storeData.isInteractive());
      store.elementsSelectable.set(!storeData.isInteractive());
    });

    p.onInteractiveChange?.(!storeData.isInteractive());
  };

  const orientationClass = () => (p.orientation === 'horizontal' ? 'horizontal' : 'vertical');

  return (
    <Panel
      class={cc(['react-flow__controls', orientationClass, p.className])}
      position={p.position}
      style={p.style}
      data-testid="rf__controls"
      aria-label={p['aria-label']}
    >
      <Show when={p.showZoom}>
        <ControlButton
          onClick={onZoomInHandler}
          class="react-flow__controls-zoomin"
          title="zoom in"
          aria-label="zoom in"
          disabled={storeData.maxZoomReached()}
        >
          <PlusIcon />
        </ControlButton>
        <ControlButton
          onClick={onZoomOutHandler}
          class="react-flow__controls-zoomout"
          title="zoom out"
          aria-label="zoom out"
          disabled={storeData.minZoomReached()}
        >
          <MinusIcon />
        </ControlButton>
      </Show>
      <Show when={p.showFitView}>
        <ControlButton
          class="react-flow__controls-fitview"
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <FitViewIcon />
        </ControlButton>
      </Show>
      <Show when={p.showInteractive}>
        <ControlButton
          class="react-flow__controls-interactive"
          onClick={onToggleInteractivity}
          title="toggle interactivity"
          aria-label="toggle interactivity"
        >
          {storeData.isInteractive() ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      </Show>
      {p.children}
    </Panel>
  );
}

ControlsComponent.displayName = 'Controls';

/**
 * The `<Controls />` component renders a small panel that contains convenient
 * buttons to zoom in, zoom out, fit the view, and lock the viewport.
 *
 * @public
 * @example
 *```tsx
 *import { ReactFlow, Controls } from '@xyflow/solid'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls />
 *    </ReactFlow>
 *  )
 *}
 *```
 *
 * @remarks To extend or customise the controls, you can use the [`<ControlButton />`](/api-reference/components/control-button) component
 *
 */
export const Controls = ControlsComponent;
