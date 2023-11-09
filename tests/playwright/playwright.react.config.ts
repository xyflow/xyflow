import { defineConfig } from '@playwright/test';
import { sharedConfigWithPort } from './playwright.shared.config';

export default defineConfig(sharedConfigWithPort({ port: 3000, framework: 'react' }));
