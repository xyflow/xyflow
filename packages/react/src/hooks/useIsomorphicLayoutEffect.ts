import { useEffect, useLayoutEffect } from 'react';

// we need this hook to prevent a warning when using react-flow in SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
