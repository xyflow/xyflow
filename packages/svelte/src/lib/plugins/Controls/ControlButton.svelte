<script lang="ts">
  import cc from 'classcat';

  import type { ControlButtonProps } from './types';

  type $$Props = ControlButtonProps;

  let className: $$Props['class'] = undefined;
  let bgColor: $$Props['bgColor'] = undefined;
  let bgColorHover: $$Props['bgColorHover'] = undefined;
  let color: $$Props['color'] = undefined;
  let colorHover: $$Props['colorHover'] = undefined;
  let borderColor: $$Props['borderColor'] = undefined;

  export { className as class };
</script>

<button
  type="button"
  on:click
  class={cc(['svelte-flow__controls-button', className])}
  style:--xy-controls-button-background-color-props={bgColor}
  style:--xy-controls-button-background-color-hover-props={bgColorHover}
  style:--xy-controls-button-color-props={color}
  style:--xy-controls-button-color-hover-props={colorHover}
  style:--xy-controls-button-border-color-props={borderColor}
  {...$$restProps}
>
  <slot class="button-svg" />
</button>
