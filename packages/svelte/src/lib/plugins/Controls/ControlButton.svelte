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

<style>
  .svelte-flow__controls-button {
    border: none;
    background: var(
      --controls-button-background-color-props,
      var(--controls-button-background-color, var(--controls-button-background-color-default))
    );
    border-bottom: 1px solid
      var(
        --controls-button-border-color-props,
        var(--controls-button-border-color, var(--controls-button-border-color-default))
      );
    color: var(
      --controls-button-color-props,
      var(--controls-button-color, var(--controls-button-color-default))
    );
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    cursor: pointer;
    user-select: none;
    padding: 5px;
  }

  .svelte-flow__controls-button:hover {
    background: var(
      --controls-button-background-color-hover-props,
      var(
        --controls-button-background-color-hover,
        var(--controls-button-background-color-hover-default)
      )
    );
    color: var(
      --controls-button-color-hover-props,
      var(--controls-button-hover-color, var(--controls-button-hover-color-default))
    );
  }

  .svelte-flow__controls-button :global(svg) {
    width: 100%;
    max-width: 12px;
    max-height: 12px;
  }

  .svelte-flow__controls-button:disabled {
    pointer-events: none;
  }

  .svelte-flow__controls-button:disabled :global(svg) {
    fill-opacity: 0.4;
  }
</style>
