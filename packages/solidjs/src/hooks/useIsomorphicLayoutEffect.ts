// import { useEffect, useLayoutEffect } from 'react';

import { createEffect } from "solid-js";

// we need this hook to prevent a warning when using react-flow in SSR
// TODO: maybe we need to update this?
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? createEffect : createEffect;
