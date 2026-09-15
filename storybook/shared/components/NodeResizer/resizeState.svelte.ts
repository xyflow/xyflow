export const RESIZE_CONTEXT = Symbol('resize-state');
export function createResizeState() {
  let keepAspectRatio = $state(false);

  return {
    get keepAspectRatio() {
      return keepAspectRatio;
    },
    set keepAspectRatio(value: boolean) {
      keepAspectRatio = value;
    },
  };
}
