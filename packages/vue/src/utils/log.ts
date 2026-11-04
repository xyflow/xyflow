import { createDevWarn } from '@xyflow/system';

/** Shared dev-only `OnError`: logs the message with a link to the matching entry in the error reference. */
export const devWarn = createDevWarn('Vue Flow', 'https://vueflow.dev/');

const productionEnvs = ['production', 'prod'];

export function warn(message: string, ...args: unknown[]) {
  if (isDev()) {
    console.warn(`[Vue Flow]: ${message}`, ...args);
  }
}

export function isDev() {
  return !productionEnvs.includes(__ENV__ || '');
}
