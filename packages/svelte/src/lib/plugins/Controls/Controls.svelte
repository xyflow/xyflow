<script lang="ts">
  import Panel from '$lib/container/Panel/Panel.svelte';
  import { useStore } from '$lib/store';
  import ControlButton from './ControlButton.svelte';
  import PlusIcon from './Icons/Plus.svelte';
  import MinusIcon from './Icons/Minus.svelte';
  import FitViewIcon from './Icons/Fit.svelte';
  import LockIcon from './Icons/Lock.svelte';
  import UnlockIcon from './Icons/Unlock.svelte';

  import type { ControlsProps } from './types';

  type $$Props = ControlsProps;

  export let position: $$Props['position'] = 'bottom-left';
  export let showZoom: $$Props['showZoom'] = true;
  export let showFitView: $$Props['showFitView'] = true;
  export let showLock: $$Props['showLock'] = true;
  export let buttonBgColor: $$Props['buttonBgColor'] = undefined;
  export let buttonBgColorHover: $$Props['buttonBgColorHover'] = undefined;
  export let buttonColor: $$Props['buttonColor'] = undefined;
  export let buttonColorHover: $$Props['buttonColorHover'] = undefined;
  export let buttonBorderColor: $$Props['buttonColorHover'] = undefined;
  export let ariaLabel: $$Props['aria-label'] = undefined;

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

  $: isInteractive = $nodesDraggable || $nodesConnectable || $elementsSelectable;
  $: minZoomReached = $viewport.zoom <= $minZoom;
  $: maxZoomReached = $viewport.zoom >= $maxZoom;

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
  class="svelte-flow__controls"
  {position}
  data-testid="svelte-flow__controls"
  aria-label={ariaLabel ?? 'Svelte Flow controls'}
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
