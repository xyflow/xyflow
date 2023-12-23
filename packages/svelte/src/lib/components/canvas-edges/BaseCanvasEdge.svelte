<script lang="ts">
  import { useCanvasRenderer } from '$lib/hooks/useCanvasRenderer';
  import { onMount } from 'svelte';

  export let id: string;
  export let path: string;
  export let strokeWidth: number = 1;
  export let interactionWidth: number = 20;
  export let strokeColor: string = '#b1b1b7';

  const canvasRenderer = useCanvasRenderer();

  $: path2D = new Path2D(path);
  $: {
    path2D; // reactivity trigger
    canvasRenderer.updateElement(id);
  }

  function render() {
    const ctx = canvasRenderer.ctx;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke(path2D);
  }

  function hit(x: number, y: number) {
    // console.log(x, y);
    // console.log(path);
    const ctx = canvasRenderer.ctx;
    ctx.lineWidth = interactionWidth;

    // ctx.stroke(path2D);
    return ctx.isPointInStroke(path2D, x, y);
  }

  onMount(() => {
    canvasRenderer.addElement(id, {
      render,
      hit
    });

    return () => {
      canvasRenderer.removeElement(id);
    };
  });
</script>
