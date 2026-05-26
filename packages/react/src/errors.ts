import { createErrorReporter } from '@xyflow/system';

export const { defaultOnError, reportError, toError } = createErrorReporter({
  lib: 'React Flow',
  helpUrl: 'https://reactflow.dev/',
});
