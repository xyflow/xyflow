import { useEffect, useState } from 'react';
import type { ColorMode, ColorModeClass } from '@xyflow/system';

function getMediaQuery() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
}

function getSystemColorMode(colorModeSSR: ColorModeClass): ColorModeClass {
  const mediaQuery = getMediaQuery();

  if (!mediaQuery) {
    return colorModeSSR;
  }

  return mediaQuery.matches ? 'dark' : 'light';
}

function getInitialColorModeClass(colorMode: ColorMode, colorModeSSR: ColorModeClass): ColorModeClass {
  if (colorMode === 'system') {
    return getSystemColorMode(colorModeSSR);
  }

  return colorMode;
}

/**
 * Hook for receiving the current color mode class 'dark' or 'light'.
 *
 * @internal
 * @param colorMode - The color mode to use ('dark', 'light' or 'system')
 * @param colorModeSSR - Fallback color mode when colorMode is 'system' and matchMedia is unavailable (SSR)
 */
export function useColorModeClass(colorMode: ColorMode, colorModeSSR: ColorModeClass = 'light'): ColorModeClass {
  const [colorModeClass, setColorModeClass] = useState<ColorModeClass>(() =>
    getInitialColorModeClass(colorMode, colorModeSSR)
  );

  useEffect(() => {
    if (colorMode !== 'system') {
      setColorModeClass(colorMode);
      return;
    }

    const mediaQuery = getMediaQuery();
    const updateColorModeClass = () => setColorModeClass(mediaQuery?.matches ? 'dark' : 'light');

    updateColorModeClass();
    mediaQuery?.addEventListener('change', updateColorModeClass);

    return () => {
      mediaQuery?.removeEventListener('change', updateColorModeClass);
    };
  }, [colorMode]);

  return colorModeClass;
}
