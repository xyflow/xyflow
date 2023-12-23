import { get } from 'svelte/store';
import { useSvelteFlow } from './useSvelteFlow';
import type { Viewport } from '@xyflow/system';

// import { Quadtree } from '@timohausmann/quadtree-ts';
// should yield surprisingly good performance especially for implmenting hover
// even though it is not a infinite quadtree implementation,
// performance seems very fast even when rebuilding the tree every frame
// new function needed getBounds() -> returns {x, y, width, height}

export type RenderElement = {
  render: () => void;
  hit: (x: number, y: number) => boolean;
  click?: (e: MouseEvent) => void;
};

// Singleton pattern -> Maybe more elegant as a clojure?
let intialized = false;
let firstRender = true;
let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D;
let view: Viewport;
let viewChanged = false;
let elementHovered: string | null = null;

let lastPointerEvent = {
  changed: false,
  x: 0,
  y: 0
};

const elements = new Map<string, RenderElement>();
const updatedElements = new Set<string>();

function initRenderer() {
  if (intialized) {
    return;
  }

  // Get the canvas element - does it make sense to put it in the store?
  // FIXME: this might be a point of failure if canvas not mounted yet. Is it even possible?
  canvas = document.querySelector('.svelte-flow__edge-canvas');
  if (!canvas) {
    return;
  }

  // There will be multiple contexts in future (webgl)
  // there is miniscule perf gain if we cache it here maybe relevant at 120Hz
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const { viewport } = useSvelteFlow();
  viewport.subscribe((_view) => {
    view = _view;
    viewChanged = true;
  });

  view = get(viewport);
  viewChanged = true;

  // Figure out if we need to scale the canvas
  // maybe window check is uneccessary?
  let dpr = 1;
  if (window) {
    dpr = window.devicePixelRatio || 1;
  }

  function pointerMove(e: PointerEvent) {
    // console.log(e);
    lastPointerEvent.changed = true;
    lastPointerEvent.x = e.offsetX;
    lastPointerEvent.y = e.offsetY;
  }

  function click(e: MouseEvent) {
    for (const [id, element] of elements) {
      if (element.hit(lastPointerEvent.x * dpr, lastPointerEvent.y * dpr)) {
        // TODO: implement hover
        // Optimization: only call hover on elements that are in view
        console.log('clicked', id);
        break;
      }
    }
  }

  function renderLoop() {
    // If all elements are cleared we stop the render loop
    // This is also very important for hot reloading during development
    if (elements.size === 0 && !firstRender) {
      // this is essentially acts as a destructor
      intialized = false;
      firstRender = true;
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('click', click);
      return;
    }

    // Luckily requestAnimationFrame waits for the first element to be added
    // This might not be reliable so we wait with the first render until the first element is added
    if (firstRender && elements.size > 0) {
      firstRender = false;
    }

    // Handle hover events
    if (lastPointerEvent.changed) {
      lastPointerEvent.changed = false;
      let hitSomething = false;
      for (const [id, element] of elements) {
        if (element.hit(lastPointerEvent.x * dpr, lastPointerEvent.y * dpr)) {
          // TODO: implement hover
          // Optimization: only call hover on elements that are in view
          //   console.log('hit', id);
          hitSomething = true;
          if (elementHovered !== id) {
            if (elementHovered) {
              console.log('hover end', elementHovered);
            }
            elementHovered = id;
            console.log('hover start', id);
          }
          break;
        }
      }
      if (!hitSomething && elementHovered) {
        console.log('hover end', elementHovered);
        elementHovered = null;
      }
    }

    if (viewChanged || updatedElements.size > 0) {
      // Reset context transform so clearRect can do its job
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Optimization: only redraw the part that changed? (unlikely to be faster)
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Set global transform for the canvas based on viewport
      ctx.setTransform(view.zoom * dpr, 0, 0, view.zoom * dpr, view.x * dpr, view.y * dpr);

      // Call render functions on all elements
      // Optimization: only call render on elements that are in view
      elements.forEach((elem) => elem.render());

      // Reset flags
      viewChanged = false;
      updatedElements.clear();
    }

    window.requestAnimationFrame(renderLoop);
  }

  document.addEventListener('pointermove', pointerMove);
  document.addEventListener('click', click);

  // Start the render loop
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
    updateElement: (id: string) => {
      updatedElements.add(id);
    }
  };
}
