import { D3SelectionInstance, Viewport } from '@reactflow/system';

export const viewChanged = (prevViewport: Viewport, eventViewport: any): boolean =>
  prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;

export const eventToFlowTransform = (eventViewport: any): Viewport => ({
  x: eventViewport.x,
  y: eventViewport.y,
  zoom: eventViewport.k,
});

export const isWrappedWithClass = (event: any, className: string | undefined) => event.target.closest(`.${className}`);

export const isRightClickPan = (panOnDrag: boolean | number[], usedButton: number) =>
  usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);

export const getD3Transition = (selection: D3SelectionInstance, duration = 0) => {
  return selection.transition().duration(duration);
};

export function Updater() {
  const updateCbs: Record<number, Array<unknown>> = {};
  let index = 0;

  function onChange(callback: () => void, deps: Array<unknown>) {
    const oldDeps = updateCbs[index];
    let depsChanged = true;

    if (oldDeps) {
      depsChanged = deps.some((d: unknown, i: number) => !Object.is(d, oldDeps[i]));
    }

    if (depsChanged) {
      callback();
    }

    updateCbs[index] = deps;
    index++;
  }

  return {
    onChange,
  };
}
