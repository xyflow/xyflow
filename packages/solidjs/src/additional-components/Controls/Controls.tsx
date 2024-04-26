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
  const p = mergeProps({
    showZoom: true,
    showFitView: true,
    showInteractive: true,
    position: 'bottom-left' as PanelPosition,
    orientation: 'vertical',
    'aria-label': 'React Flow controls',
  }, _p);

  const store = useStoreApi();
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(selector);
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
      store.nodesDraggable.set(!isInteractive);
      store.nodesConnectable.set(!isInteractive);
      store.elementsSelectable.set(!isInteractive);
    })

    p.onInteractiveChange?.(!isInteractive);
  };

  const orientationClass = () => p.orientation === 'horizontal' ? 'horizontal' : 'vertical';

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
            disabled={maxZoomReached()}
          >
            <PlusIcon />
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            class="react-flow__controls-zoomout"
            title="zoom out"
            aria-label="zoom out"
            disabled={minZoomReached()}
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
          {isInteractive() ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      </Show>
      {p.children}
    </Panel>
  );
}

ControlsComponent.displayName = 'Controls';

export const Controls = ControlsComponent;
