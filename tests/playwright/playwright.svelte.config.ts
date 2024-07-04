import { defineConfig } from '@playwright/test';
import { sharedConfigWithPort } from './playwright.shared.config';

export default defineConfig(sharedConfigWithPort({ port: 5173, framework: 'svelte' }));
