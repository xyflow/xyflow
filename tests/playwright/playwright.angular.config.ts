import { defineConfig } from '@playwright/test';
import { sharedConfigWithPort } from './playwright.shared.config';

export default defineConfig(sharedConfigWithPort({ port: 4200, framework: 'angular' }));