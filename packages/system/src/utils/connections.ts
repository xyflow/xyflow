import { HandleConnection } from '../types';

/**
 * @internal
 */
export function areConnectionMapsEqual(a?: Map<string, HandleConnection>, b?: Map<string, HandleConnection>) {
  if (!a && !b) {
    return true;
  }

  if (!a || !b || a.size !== b.size) {
    return false;
  }

  if (!a.size && !b.size) {
    return true;
  }

  for (const key of a.keys()) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

/**
 * We call the callback for all connections in a that are not in b
 *
 * @internal
 */
export function handleConnectionChange(
  a: Map<string, HandleConnection>,
  b: Map<string, HandleConnection>,
  cb?: (diff: HandleConnection[]) => void
) {
  if (!cb) {
    return;
  }

  const diff: HandleConnection[] = [];

  a.forEach((connection, key) => {
    if (!b?.has(key)) {
      diff.push(connection);
    }
  });

  if (diff.length) {
    cb(diff);
  }
}

export function getConnectionStatus(isValid: boolean | null) {
  return isValid === null ? null : isValid ? 'valid' : 'invalid';
}
