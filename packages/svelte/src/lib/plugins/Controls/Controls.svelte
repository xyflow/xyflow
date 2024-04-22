<script lang="ts">
  import cc from 'classcat';

  import Panel from '$lib/container/Panel/Panel.svelte';
  import { useStore } from '$lib/store';
  import ControlButton from './ControlButton.svelte';
  import PlusIcon from './Icons/Plus.svelte';
  import MinusIcon from './Icons/Minus.svelte';
  import FitViewIcon from './Icons/Fit.svelte';
  import LockIcon from './Icons/Lock.svelte';
  import UnlockIcon from './Icons/Unlock.svelte';

  import type { ControlsProps } from './types';

  let {
    position = 'bottom-left',
    showZoom = true,
    showFitView = true,
    showLock = true,
    buttonBgColor,
    buttonBgColorHover,
    buttonColor,
    buttonColorHover,
    buttonBorderColor,
    'aria-label': ariaLabel,
    style,
    orientation = 'vertical',
    class: className
  }: ControlsProps = $props();

  const {
    zoomIn,
    zoomOut,
    fitView,
    viewport,
    minZoom,
    maxZoom,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable
  } = useStore();

  const buttonProps = {
    bgColor: buttonBgColor,
    bgColorHover: buttonBgColorHover,
    color: buttonColor,
    colorHover: buttonColorHover,
    borderColor: buttonBorderColor
  };

  let isInteractive = $state($nodesDraggable || $nodesConnectable || $elementsSelectable);
  let minZoomReached = $derived($viewport.zoom <= $minZoom);
  let maxZoomReached = $derived($viewport.zoom >= $maxZoom);
  let orientationClass = $derived(orientation === 'horizontal' ? 'horizontal' : 'vertical');

  const onZoomInHandler = () => {
    zoomIn();
  };

  const onZoomOutHandler = () => {
    zoomOut();
  };

  const onFitViewHandler = () => {
    fitView();
  };

  const onToggleInteractivity = () => {
    isInteractive = !isInteractive;

    nodesDraggable.set(isInteractive);
    nodesConnectable.set(isInteractive);
    elementsSelectable.set(isInteractive);
  };
</script>

<Panel
  class={cc(['svelte-flow__controls', orientationClass, className])}
  {position}
  data-testid="svelte-flow__controls"
  aria-label={ariaLabel ?? 'Svelte Flow controls'}
  {style}
>
  <slot name="before" />
  {#if showZoom}
    <ControlButton
      on:click={onZoomInHandler}
      class="svelte-flow__controls-zoomin"
      title="zoom in"
      aria-label="zoom in"
      disabled={maxZoomReached}
      {...buttonProps}
    >
      <PlusIcon />
    </ControlButton>
    <ControlButton
      on:click={onZoomOutHandler}
      class="svelte-flow__controls-zoomout"
      title="zoom out"
      aria-label="zoom out"
      disabled={minZoomReached}
      {...buttonProps}
    >
      <MinusIcon />
    </ControlButton>
  {/if}
  {#if showFitView}
    <ControlButton
      class="svelte-flow__controls-fitview"
      on:click={onFitViewHandler}
      title="fit view"
      aria-label="fit view"
      {...buttonProps}
    >
      <FitViewIcon />
    </ControlButton>
  {/if}
  {#if showLock}
    <ControlButton
      class="svelte-flow__controls-interactive"
      on:click={onToggleInteractivity}
      title="toggle interactivity"
      aria-label="toggle interactivity"
      {...buttonProps}
    >
      {#if isInteractive}<UnlockIcon />{:else}<LockIcon />{/if}
    </ControlButton>
  {/if}
  <slot />
  <slot name="after" />
</Panel>
