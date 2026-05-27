import { createErrorReporter } from '@xyflow/system';

export const { defaultOnError, reportError, toError } = createErrorReporter({
  lib: 'Svelte Flow',
  helpUrl: 'https://svelteflow.dev/',
});
