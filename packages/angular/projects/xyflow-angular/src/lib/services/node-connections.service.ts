import { Injectable, computed, signal, inject } from '@angular/core';
import type { NodeConnection, HandleType, HandleConnection } from '@xyflow/system';
import { areConnectionMapsEqual, handleConnectionChange } from '@xyflow/system';
import { FlowStateService } from './flow-state.service';

export interface UseNodeConnectionsParams {
  /** ID of the node */
  id?: string;
  /** What type of handle connections do you want to observe? */
  handleType?: HandleType;
  /** Filter by handle id (this is only needed if the node has multiple handles of the same type) */
  handleId?: string;
  /** Gets called when a connection is established */
  onConnect?: (connections: HandleConnection[]) => void;
  /** Gets called when a connection is removed */
  onDisconnect?: (connections: HandleConnection[]) => void;
}

/**
 * Angular service equivalent of React's useNodeConnections hook.
 * Returns an array of connections on a specific node, handle type ('source', 'target') or handle ID.
 */
@Injectable({
  providedIn: 'root'
})
export class NodeConnectionsService {
  private flowState = inject(FlowStateService);

  private connectionMaps = signal<{
    previous: Map<string, NodeConnection>;
    next: Map<string, NodeConnection>;
  }>({
    previous: new Map(),
    next: new Map()
  });

  /**
   * Get node connections for a specific node and handle configuration
   */
  getNodeConnections(params: UseNodeConnectionsParams = {}) {
    const { id, handleType, handleId, onConnect, onDisconnect } = params;

    return computed(() => {
      const connectionLookup = this.flowState.connectionLookup;
      const nodeId = id;

      if (!nodeId) {
        return [];
      }

      // Build the lookup key
      const lookupKey = `${nodeId}${handleType ? (handleId ? `-${handleType}-${handleId}` : `-${handleType}`) : ''}`;
      const connections = connectionLookup.get(lookupKey) ?? new Map();

      // Handle connection change detection and callbacks
      const currentMaps = this.connectionMaps();
      const prevConnections = currentMaps.next;

      if (!areConnectionMapsEqual(connections, prevConnections)) {
        const newMaps = {
          previous: prevConnections,
          next: connections
        };
        this.connectionMaps.set(newMaps);

        // Trigger callbacks if provided
        if (onConnect) {
          handleConnectionChange(connections, prevConnections, onConnect);
        }
        if (onDisconnect) {
          handleConnectionChange(prevConnections, connections, onDisconnect);
        }
      }

      return Array.from(connections.values());
    });
  }
}
