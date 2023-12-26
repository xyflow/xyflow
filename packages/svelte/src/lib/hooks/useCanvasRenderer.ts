import { get } from 'svelte/store';
import { useSvelteFlow } from './useSvelteFlow';
import type { Position, Rect, Viewport } from '@xyflow/system';

import { Quadtree, Rectangle } from '@timohausmann/quadtree-ts';
import { useStore } from '$lib/store';

export type RenderElement = {
  render: () => void;
  hit: (x: number, y: number) => boolean;
  click?: (e: MouseEvent) => void;
  getBounds: () => Rect;
};

// Singleton pattern -> Maybe more elegant as a clojure?
let intialized = false;
let firstRender = true;
let canvas: HTMLCanvasElement | null;
let ctx: CanvasRenderingContext2D;
let view: Viewport;
let viewChanged = false;
let canvasResized = false;
let elementHovered: string | null = null;
// FIXME: Quadtree size should be dynamic & infinite
let quadtree: Quadtree<any> = new Quadtree({
  width: 20000,
  height: 20000,
  x: -10000,
  y: -10000,
  maxLevels: 8
});
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

  // Subscribe to changes of viewport
  const { viewport, screenToFlowPosition } = useSvelteFlow();
  viewport.subscribe((_view) => {
    view = _view;
    viewChanged = true;
  });

  view = get(viewport);
  viewChanged = true;

  // Subscribe to resize events
  const { domNode } = useStore();
  const resizeObserver = new ResizeObserver(() => {
    canvasResized = true;
  });
  resizeObserver.observe(get(domNode)!);

  // Figure out if we need to scale the canvas
  // maybe window check is uneccessary?
  let dpr = 1;
  if (window) {
    dpr = window.devicePixelRatio || 1;
  }

  function pointerMove(e: PointerEvent) {
    const flowPosition = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    lastPointerEvent.changed = true;
    lastPointerEvent.x = flowPosition.x;
    lastPointerEvent.y = flowPosition.y;
  }

  function click(e: MouseEvent) {
    // Only check hits on elements that are in proximity of the pointer
    const closeElements = quadtree.retrieve(
      new Rectangle({
        x: lastPointerEvent.x,
        y: lastPointerEvent.y,
        width: 1,
        height: 1
      })
    );

    // Wild: the transform needs to be reset otherwise isPointInStroke does not work (???)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    for (const element of closeElements) {
      const id = element.data;
      const _element = elements.get(element.data);
      if (_element && _element.hit(lastPointerEvent.x, lastPointerEvent.y)) {
        // TODO: implement hover
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

      // Only check hits on elements that are in proximity of the pointer
      const closeElements = quadtree.retrieve(
        new Rectangle({
          x: lastPointerEvent.x,
          y: lastPointerEvent.y,
          width: 1,
          height: 1
        })
      );

      for (const element of closeElements) {
        const id = element.data;
        const _element = elements.get(id);

        // Wild: the transform needs to be reset otherwise isPointInStroke does not work (???)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (_element && _element.hit(lastPointerEvent.x, lastPointerEvent.y)) {
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

    if (viewChanged || updatedElements.size > 0 || canvasResized) {
      // Reset context transform so clearRect can do its job
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Optimization: only redraw the part that changed? (unlikely to be faster)
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Set global transform for the canvas based on viewport
      ctx.setTransform(view.zoom * dpr, 0, 0, view.zoom * dpr, view.x * dpr, view.y * dpr);

      // Reset quadtree if elements have been updated
      if (updatedElements.size > 0) {
        quadtree.clear();
      }

      // Call render functions on all elements
      // Optimization: only call render on elements that are in view
      elements.forEach((elem, key) => {
        if (updatedElements.size > 0) {
          const bounds = elem.getBounds() as Rectangle<string>;
          bounds.data = key;
          quadtree.insert(new Rectangle(bounds));
        }
        elem.render();
      });

      // Reset flags
      viewChanged = false;
      canvasResized = false;
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
