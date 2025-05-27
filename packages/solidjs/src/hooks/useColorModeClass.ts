import type { ColorMode, ColorModeClass } from '@xyflow/system';
import { createEffect, createSignal } from 'solid-js';

function getMediaQuery() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
}

/**
 * Hook for receiving the current color mode class 'dark' or 'light'.
 *
 * @internal
 * @param colorMode - The color mode to use ('dark', 'light' or 'system')
 */
export function useColorModeClass(colorMode: () => ColorMode): () => ColorModeClass {
  const initialColorMode = () => { 
    const mode = colorMode();
    if (mode === 'system') {
      return null
    } else { 
      return mode
    }
  }

  const [colorModeClass, setColorModeClass] = createSignal<ColorModeClass | null>(
    initialColorMode()
  );

  createEffect(() => {
    const mode = colorMode();
    if (mode !== 'system') {
      setColorModeClass(mode);
      return;
    }

    const mediaQuery = getMediaQuery();
    const updateColorModeClass = () => setColorModeClass(mediaQuery?.matches ? 'dark' : 'light');

    updateColorModeClass();
    mediaQuery?.addEventListener('change', updateColorModeClass);

    return () => {
      mediaQuery?.removeEventListener('change', updateColorModeClass);
    };
  });

  return () => {
    const colorModeClassValue = colorModeClass();
    return colorModeClassValue !== null ? colorModeClassValue : getMediaQuery()?.matches ? 'dark' : 'light' }
}
