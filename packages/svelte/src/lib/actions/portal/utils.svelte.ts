export function hideDuringSSR(): { display: 'none' | undefined } {
  let display = $state(typeof window === 'undefined' ? ('none' as const) : undefined);
  if (display) {
    const destroyEffect = $effect.root(() => {
      $effect(() => {
        display = undefined;
        destroyEffect?.();
      });
    });
  }

  return {
    get display() {
      return display;
    }
  };
}
