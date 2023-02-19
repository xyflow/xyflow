<script lang="ts">
  import cc from 'classcat';

  import DotPattern from './DotPattern.svelte';
  import LinePattern from './LinePattern.svelte';
  import { useStore } from '$lib/store';
	import { BackgroundVariant } from './types';

  export let variant: BackgroundVariant = BackgroundVariant.Dots;
  export let gap = 20;
  export let size: number = 1;
  export let lineWidth = 1;
  export let color: string = '#ccc';

  let className: string = '';
  export { className as class };

  const defaultColor = {
    [BackgroundVariant.Dots]: '#91919a',
    [BackgroundVariant.Lines]: '#eee',
    [BackgroundVariant.Cross]: '#e2e2e2',
  };

  const defaultSize = {
    [BackgroundVariant.Dots]: 1,
    [BackgroundVariant.Lines]: 1,
    [BackgroundVariant.Cross]: 6,
  };

  const { transformStore, idStore } = useStore();
  const patternColor = color || defaultColor[variant];
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: number[] = Array.isArray(gap) ? gap : [gap, gap];

  $: patternId = `background-pattern-${$idStore}`;
  $: scaledGap = [gapXY[0] * $transformStore[2] || 1, gapXY[1] * $transformStore[2] || 1];
  $: scaledSize = patternSize * $transformStore[2];
  $: patternDimensions = (isCross ? [scaledSize, scaledSize] : scaledGap) as [number, number];
  $: patternOffset = isDots
    ? [scaledSize / 2, scaledSize / 2]
    : [patternDimensions[0] / 2, patternDimensions[1] / 2];
</script>

<svg class={cc(['react-flow__background', className])} >
  <pattern
    id={patternId}
    x={$transformStore[0] % scaledGap[0]}
    y={$transformStore[1] % scaledGap[1]}
    width={scaledGap[0]}
    height={scaledGap[1]}
    patternUnits="userSpaceOnUse"
    patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
  >
    {#if isDots}
      <DotPattern color={patternColor} radius={scaledSize / 2} />
    {:else}
      <LinePattern dimensions={patternDimensions } color={patternColor} lineWidth={lineWidth} />
    {/if}
  </pattern>
  <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
</svg>

<style>
  .react-flow__background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1;
  }
</style>