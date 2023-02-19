<script lang="ts">
  import cc from 'classcat';

  let className: string;

  export { className as class }
</script>

<button type="button" on:click class={cc(['react-flow__controls-button', className])} {...$$restProps} >
  <slot class="button-svg" />
</button>

<style>
  .react-flow__controls-button {
    border: none;
    background: #fefefe;
    border-bottom: 1px solid #eee;
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

  .react-flow__controls-button :global(svg) {
    width: 100%;
    max-width: 12px;
    max-height: 12px;
  }
</style>