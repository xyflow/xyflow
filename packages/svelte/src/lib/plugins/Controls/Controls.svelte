<script lang="ts">
  import { useStore } from '$lib/store';
  import Panel from '$lib/container/Panel/Panel.svelte';
  import ControlButton from './ControlButton.svelte';
  import PlusIcon from './Icons/Plus.svelte';
  import MinusIcon from './Icons/Minus.svelte';
  import FitViewIcon from './Icons/Fit.svelte';
  import LockIcon from './Icons/Lock.svelte';
  import UnlockIcon from './Icons/Unlock.svelte';

  import type { ControlsProps } from './types';

  let {
    position = 'bottom-left',
    orientation = 'vertical',
    showZoom = true,
    showFitView = true,
    showLock = true,
    style,
    class: className,
    buttonBgColor,
    buttonBgColorHover,
    buttonColor,
    buttonColorHover,
    buttonBorderColor,
    fitViewOptions,
    children,
    before,
    after,
    ...rest
  }: ControlsProps = $props();

  let store = $derived(useStore());

  const buttonProps = {
    bgColor: buttonBgColor,
    bgColorHover: buttonBgColorHover,
    color: buttonColor,
    colorHover: buttonColorHover,
    borderColor: buttonBorderColor
  };

  let isInteractive = $derived(
    store.nodesDraggable || store.nodesConnectable || store.elementsSelectable
  );
  let minZoomReached = $derived(store.viewport.zoom <= store.minZoom);
  let maxZoomReached = $derived(store.viewport.zoom >= store.maxZoom);
  let ariaLabelConfig = $derived(store.ariaLabelConfig);
  let orientationClass = $derived(orientation === 'horizontal' ? 'horizontal' : 'vertical');

  const onZoomInHandler = () => {
    store.zoomIn();
  };

  const onZoomOutHandler = () => {
    store.zoomOut();
  };

  const onFitViewHandler = () => {
    store.fitView(fitViewOptions);
  };

  const onToggleInteractivity = () => {
    let interactive = !isInteractive;
    store.nodesDraggable = interactive;
    store.nodesConnectable = interactive;
    store.elementsSelectable = interactive;
  };
</script>

<Panel
  class={['svelte-flow__controls', orientationClass, className]}
  {position}
  data-testid="svelte-flow__controls"
  aria-label={ariaLabelConfig['controls.ariaLabel']}
  {style}
  {...rest}
>
  {#if before}
    {@render before()}
  {/if}
  {#if showZoom}
    <ControlButton
      onclick={onZoomInHandler}
      class="svelte-flow__controls-zoomin"
      title={ariaLabelConfig['controls.zoomIn.ariaLabel']}
      aria-label={ariaLabelConfig['controls.zoomIn.ariaLabel']}
      disabled={maxZoomReached}
      {...buttonProps}
    >
      <PlusIcon />
    </ControlButton>
    <ControlButton
      onclick={onZoomOutHandler}
      class="svelte-flow__controls-zoomout"
      title={ariaLabelConfig['controls.zoomOut.ariaLabel']}
      aria-label={ariaLabelConfig['controls.zoomOut.ariaLabel']}
      disabled={minZoomReached}
      {...buttonProps}
    >
      <MinusIcon />
    </ControlButton>
  {/if}
  {#if showFitView}
    <ControlButton
      class="svelte-flow__controls-fitview"
      onclick={onFitViewHandler}
      title={ariaLabelConfig['controls.fitView.ariaLabel']}
      aria-label={ariaLabelConfig['controls.fitView.ariaLabel']}
      {...buttonProps}
    >
      <FitViewIcon />
    </ControlButton>
  {/if}
  {#if showLock}
    <ControlButton
      class="svelte-flow__controls-interactive"
      onclick={onToggleInteractivity}
      title={ariaLabelConfig['controls.interactive.ariaLabel']}
      aria-label={ariaLabelConfig['controls.interactive.ariaLabel']}
      {...buttonProps}
    >
      {#if isInteractive}<UnlockIcon />{:else}<LockIcon />{/if}
    </ControlButton>
  {/if}
  {#if children}
    {@render children()}
  {/if}
  {#if after}
    {@render after()}
  {/if}
</Panel>
