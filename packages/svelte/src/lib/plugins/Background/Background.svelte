<script labg="ts" context="module">
  const defaultColor = {
    [BackgroundVariant.Dots]: '#91919a',
    [BackgroundVariant.Lines]: '#eee',
    [BackgroundVariant.Cross]: '#e2e2e2'
  };

  const defaultSize = {
    [BackgroundVariant.Dots]: 1,
    [BackgroundVariant.Lines]: 1,
    [BackgroundVariant.Cross]: 6
  };
</script>

<script lang="ts">
  import cc from 'classcat';

  import DotPattern from './DotPattern.svelte';
  import LinePattern from './LinePattern.svelte';
  import { useStore } from '$lib/store';
  import { BackgroundVariant, type BackgroundProps } from './types';

  type $$Props = BackgroundProps; 

  export let variant: $$Props['variant'] = BackgroundVariant.Dots;
  export let gap: $$Props['gap'] = 20;
  export let size: $$Props['size'] = 1;
  export let lineWidth: $$Props['lineWidth'] = 1;
  export let color: $$Props['color'] = '#ccc';
  export let style: $$Props['style'] = '';
  let className: $$Props['class'] = '';
  export { className as class };

  const { transform, id } = useStore();
  const patternColor = color || defaultColor[variant!];
  const patternSize = size || defaultSize[variant!];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: number[] = Array.isArray(gap!) ? gap! : [gap!, gap!];

  $: patternId = `background-pattern-${$id}`;
  $: scaledGap = [gapXY[0] * $transform[2] || 1, gapXY[1] * $transform[2] || 1];
  $: scaledSize = patternSize * $transform[2];
  $: patternDimensions = (isCross ? [scaledSize, scaledSize] : scaledGap) as [number, number];
  $: patternOffset = isDots
    ? [scaledSize / 2, scaledSize / 2]
    : [patternDimensions[0] / 2, patternDimensions[1] / 2];
</script>

<svg class={cc(['svelte-flow__background', className])} {style} data-testid="svelte-flow__background">
  <pattern
    id={patternId}
    x={$transform[0] % scaledGap[0]}
    y={$transform[1] % scaledGap[1]}
    width={scaledGap[0]}
    height={scaledGap[1]}
    patternUnits="userSpaceOnUse"
    patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
  >
    {#if isDots}
      <DotPattern color={patternColor} radius={scaledSize / 2} />
    {:else}
      <LinePattern dimensions={patternDimensions} color={patternColor} {lineWidth} />
    {/if}
  </pattern>
  <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
</svg>

<style>
  .svelte-flow__background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1;
  }
</style>
