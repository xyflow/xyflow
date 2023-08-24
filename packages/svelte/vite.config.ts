import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  css: {
    postcss: './../../tooling/postcss-config/'
  }
};

export default config;
