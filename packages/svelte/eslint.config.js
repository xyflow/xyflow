import createConfig from '@xyflow/eslint/svelte';
import { loadConfig } from '@sveltejs/load-config';

const svelteConfig = (await loadConfig('./', { traverse: false }))?.config;

export default createConfig({ svelteConfig, tsconfigRootDir: import.meta.dirname });
