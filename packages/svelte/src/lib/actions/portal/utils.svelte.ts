export function hideOnSSR(): { value: boolean } {
  let hide = $state(typeof window === 'undefined');
  if (hide) {
    const destroyEffect = $effect.root(() => {
      $effect(() => {
        hide = false;
        destroyEffect?.();
      });
    });
  }

  return {
    get value() {
      return hide;
    }
  };
}
