<script lang="ts">
	import type { PanelPosition } from '@reactflow/system';

  import Panel from '$lib/container/Panel/index.svelte';
  import { useStore } from '$lib/store';
  import ControlButton from './ControlButton.svelte';
  import PlusIcon from './Icons/Plus.svelte';
  import MinusIcon from './Icons/Minus.svelte';
  import FitViewIcon from './Icons/Fit.svelte';
  import LockIcon from './Icons/Lock.svelte';
  import UnlockIcon from './Icons/Unlock.svelte';

  export let position: PanelPosition = 'bottom-left';
  export let showZoom = true;
  export let showFitView = true;
  export let showInteractive = true;

  const { zoomIn, zoomOut, fitView } = useStore();

  const isInteractive = true;

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
    // store.setState({
    //   nodesDraggable: !isInteractive,
    //   nodesConnectable: !isInteractive,
    //   elementsSelectable: !isInteractive,
    // });

    // onInteractiveChange?.(!isInteractive);
  };

</script>

<Panel class="react-flow__controls" position={position}>
  {#if showZoom}
    <ControlButton
      on:click={onZoomInHandler}
      class="react-flow__controls-zoomin"
      title="zoom in"
      aria-label="zoom in"
    >
      <PlusIcon />
    </ControlButton>
    <svelte:component
      this={ControlButton}
      on:click={onZoomOutHandler}
      class="react-flow__controls-zoomout"
      title="zoom out"
      aria-label="zoom out"
    >
      <MinusIcon />
    </svelte:component>
  {/if}
  {#if showFitView}
    <svelte:component
      this={ControlButton}
      class="react-flow__controls-fitview"
      on:click={onFitViewHandler}
      title="fit view"
      aria-label="fit view"
    >
      <FitViewIcon />
    </svelte:component>
  {/if}
  {#if showInteractive}
    <svelte:component
      this={ControlButton}
      class="react-flow__controls-interactive"
      on:click={onToggleInteractivity}
      title="toggle interactivity"
      aria-label="toggle interactivity"
    >
      {#if isInteractive}<UnlockIcon />{:else}<LockIcon />{/if}
    </svelte:component>
  {/if}
</Panel>