<script lang="ts">
  import { useCanvasRenderer } from '$lib/hooks/useCanvasRenderer';
  import type { Rect } from '@xyflow/system';
  import { onMount } from 'svelte';

  export let id: string;
  export let path: string;
  export let strokeWidth: number = 1;
  export let interactionWidth: number = 20;
  export let strokeColor: string = '#b1b1b7';
  export let bounds: Rect;

  const { ctx, updateElement, addElement, removeElement } = useCanvasRenderer();

  $: path2D = new Path2D(path);
  $: {
    path2D; // reactivity trigger
    updateElement(id);
  }

  function render() {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke(path2D);
  }

  function hit(x: number, y: number) {
    ctx.lineWidth = interactionWidth;
    return ctx.isPointInStroke(path2D, x, y);
  }

  function getBounds() {
    return bounds;
  }

  onMount(() => {
    addElement(id, {
      render,
      hit,
      getBounds
    });

    return () => {
      removeElement(id);
    };
  });
</script>
