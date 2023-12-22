import { get } from 'svelte/store';
import { useSvelteFlow } from './useSvelteFlow';

export type RenderElement = {
  render: () => void;
  hit: (x: number, y: number) => boolean;
};

let intialized = false;
let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D;
const elements = new Map<string, RenderElement>();

function initRenderer() {
  if (intialized) {
    return;
  }

  canvas = document.querySelector('.svelte-flow__edge-canvas');
  if (!canvas) {
    return;
  }

  const id = Math.random().toString(36);

  let dpr = 1;
  if (window) {
    dpr = window.devicePixelRatio || 1;
  }
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  intialized = true;
  console.log('canvas', canvas.width, canvas.height);
  console.info('renderer intiialised', id);

  const { viewport } = useSvelteFlow();

  function renderLoop() {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    const view = get(viewport);
    ctx.setTransform(view.zoom * dpr, 0, 0, view.zoom * dpr, view.x * dpr, view.y * dpr);
    elements.forEach((elem) => elem.render());
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    window.requestAnimationFrame(renderLoop);
  }

  window.requestAnimationFrame(renderLoop);
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
