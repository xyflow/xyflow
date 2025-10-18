import { Injectable, computed, inject } from '@angular/core';
import { HandleType, HandleConnection } from '@xyflow/system';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useHandleConnections hook.
 * Get all connections for a specific node's handle.
 */
@Injectable({
  providedIn: 'root'
})
export class HandleConnectionsService {
  private flowState = inject(FlowStateService);

  /**
   * Get all connections for a specific handle
   * @param nodeId - The ID of the node
   * @param handleType - The type of handle ('source' or 'target')
   * @param handleId - The ID of the handle (optional, defaults to null)
   * @returns Computed signal with connections for the handle
   */
  getHandleConnections(
    nodeId: string,
    handleType: HandleType,
    handleId: string | null = null
  ) {
    return computed(() => {
      const key = `${nodeId}-${handleType}${handleId ? `-${handleId}` : ''}`;
      const connections = this.flowState.connectionLookup.get(key);

      return connections ? Array.from(connections.values()) : [];
    });
  }

  /**
   * Get all source connections for a node's handle
   * @param nodeId - The ID of the node
   * @param handleId - The ID of the handle (optional)
   * @returns Computed signal with source connections
   */
  getSourceConnections(nodeId: string, handleId: string | null = null) {
    return this.getHandleConnections(nodeId, 'source', handleId);
  }

  /**
   * Get all target connections for a node's handle
   * @param nodeId - The ID of the node
   * @param handleId - The ID of the handle (optional)
   * @returns Computed signal with target connections
   */
  getTargetConnections(nodeId: string, handleId: string | null = null) {
    return this.getHandleConnections(nodeId, 'target', handleId);
  }

  /**
   * Check if a handle has any connections
   * @param nodeId - The ID of the node
   * @param handleType - The type of handle
   * @param handleId - The ID of the handle (optional)
   * @returns Computed signal with boolean indicating if handle has connections
   */
  hasConnections(
    nodeId: string,
    handleType: HandleType,
    handleId: string | null = null
  ) {
    return computed(() => {
      const connections = this.getHandleConnections(nodeId, handleType, handleId)();
      return connections.length > 0;
    });
  }

  /**
   * Get the count of connections for a handle
   * @param nodeId - The ID of the node
   * @param handleType - The type of handle
   * @param handleId - The ID of the handle (optional)
   * @returns Computed signal with connection count
   */
  getConnectionCount(
    nodeId: string,
    handleType: HandleType,
    handleId: string | null = null
  ) {
    return computed(() => {
      const connections = this.getHandleConnections(nodeId, handleType, handleId)();
      return connections.length;
    });
  }
}
