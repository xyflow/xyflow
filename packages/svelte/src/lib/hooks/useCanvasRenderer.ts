import { get } from 'svelte/store';
import { useSvelteFlow } from './useSvelteFlow';

export type RenderElement = {
  render: () => void;
  hit: (x: number, y: number) => boolean;
};

let intialized = false;
let firstRender = true;
let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D;
const elements = new Map<string, RenderElement>();

function initRenderer() {
  if (intialized) {
    return;
  }

  // Get the canvas element - does it make sense to put it in the store?
  canvas = document.querySelector('.svelte-flow__edge-canvas');
  if (!canvas) {
    return;
  }
  // There will be multiple contexts, there is miniscule perf gain if we cache it
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { viewport } = useSvelteFlow();

  // Temporary id for development to check that not multiple renderers are created
  const id = Math.random().toString(36);
  console.info('renderer created', id);

  // Figure out if we need to scale the canvas
  // maybe window check is uneccessary?
  let dpr = 1;
  if (window) {
    dpr = window.devicePixelRatio || 1;
  }

  function renderLoop() {
    // If all elements are cleared we stop the render loop
    if (elements.size === 0 && !firstRender) {
      intialized = false;
      firstRender = true;
      return;
    }

    // Luckily requestAnimationFrame waits for the first element to be added
    // This might not be reliable so we wait with the first render until the first element is added
    if (firstRender && elements.size > 0) {
      firstRender = false;
    }

    // Reset context transform so clearRect can do its job
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Optimization: only redraw the part that changed? (unlikely to be faster)
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    // Optimization: Wait for Svelte 5 to phase out get()
    const view = get(viewport);

    // Set global transform for the canvas based on viewport
    ctx.setTransform(view.zoom * dpr, 0, 0, view.zoom * dpr, view.x * dpr, view.y * dpr);

    // Call render functions on all elements
    elements.forEach((elem) => elem.render());

    window.requestAnimationFrame(renderLoop);
  }

  window.requestAnimationFrame(renderLoop);
  intialized = true;
}

export function useCanvasRenderer() {
  initRenderer();

  return {
    ctx,
    addElement: (id: string, element: RenderElement) => {
      elements.set(id, element);
    },
    removeElement: (id: string) => {
      console.log('remove element', id);
      elements.delete(id);
    },
    updateElement: () => {}
  };
}
