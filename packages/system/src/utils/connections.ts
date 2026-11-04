import type { ConnectionLookup, HandleType, NodeConnection } from '../types';

/**
 * Returns the key under which the connections of a node are stored in the connection lookup.
 * Without a handle type, the key covers all connections of the node. A handle id is only used
 * together with a handle type, because handle ids are only unique per handle type.
 *
 * @internal
 */
export function getConnectionLookupKey(nodeId: string, handleType?: HandleType | null, handleId?: string | null) {
  if (!handleType) {
    return nodeId;
  }

  return handleId ? `${nodeId}-${handleType}-${handleId}` : `${nodeId}-${handleType}`;
}

/**
 * Returns the connections of a node, optionally filtered by handle type and handle id.
 *
 * @internal
 */
export function getConnectionsFromLookup(
  connectionLookup: ConnectionLookup,
  {
    nodeId,
    type,
    handleId,
  }: {
    nodeId: string;
    type?: HandleType | null;
    handleId?: string | null;
  }
): NodeConnection[] {
  return Array.from(connectionLookup.get(getConnectionLookupKey(nodeId, type, handleId))?.values() ?? []);
}

/**
 * @internal
 */
export function areConnectionMapsEqual(a?: Map<string, NodeConnection>, b?: Map<string, NodeConnection>) {
  if (a === b) {
    return true;
  }

  if (!a || !b || a.size !== b.size) {
    return false;
  }

  if (!a.size && !b.size) {
    return true;
  }

  for (const [key, connection] of a) {
    if (b.get(key) !== connection) {
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
  a: Map<string, NodeConnection>,
  b: Map<string, NodeConnection>,
  cb?: (diff: NodeConnection[]) => void
) {
  if (!cb) {
    return;
  }

  const diff: NodeConnection[] = [];

  a.forEach((connection, key) => {
    if (b?.get(key) !== connection) {
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
