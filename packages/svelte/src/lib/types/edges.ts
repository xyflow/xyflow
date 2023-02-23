import type { SvelteComponentTyped } from 'svelte';
import type { EdgeProps } from '$lib/types';

export type EdgeTypes = Record<string, typeof SvelteComponentTyped<EdgeProps>>;
