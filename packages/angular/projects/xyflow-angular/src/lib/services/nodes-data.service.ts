import { Injectable, computed, inject } from '@angular/core';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useNodesData hook.
 * Get data from multiple nodes by their ids.
 */
@Injectable({
  providedIn: 'root'
})
export class NodesDataService {
  private flowState = inject(FlowStateService);

  /**
   * Get node data for one or multiple node IDs
   * @param nodeIds - Single node ID or array of node IDs
   * @returns Node data objects with id, type, and data properties
   */
  getNodesData<T = any>(nodeIds: string | string[]) {
    return computed(() => {
      const nodeLookup = this.flowState.nodeLookup;
      const data: Array<{ id: string; type?: string; data: T }> = [];
      const isArrayOfIds = Array.isArray(nodeIds);
      const _nodeIds = isArrayOfIds ? nodeIds : [nodeIds];

      for (const nodeId of _nodeIds) {
        const node = nodeLookup.get(nodeId);
        if (node) {
          data.push({
            id: node.id,
            type: node.type,
            data: node.data as T,
          });
        }
      }

      return isArrayOfIds ? data : data[0] ?? null;
    });
  }
}
