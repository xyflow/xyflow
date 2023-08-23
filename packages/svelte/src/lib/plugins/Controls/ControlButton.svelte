<script lang="ts">
  import cc from 'classcat';

  let className: string;
  let bgColor: string | undefined = undefined;
  let bgColorHover: string | undefined = undefined;
  let color: string | undefined = undefined;
  let colorHover: string | undefined = undefined;
  let borderColor: string | undefined = undefined;

  export { className as class };
</script>

<button
  type="button"
  on:click
  class={cc(['svelte-flow__controls-button', className])}
  style:--controls-button-background-color-props={bgColor}
  style:--controls-button-background-color-hover-props={bgColorHover}
  style:--controls-button-color-props={color}
  style:--controls-button-color-hover-props={colorHover}
  style:--controls-button-border-color-props={borderColor}
  {...$$restProps}
>
  <slot class="button-svg" />
</button>
