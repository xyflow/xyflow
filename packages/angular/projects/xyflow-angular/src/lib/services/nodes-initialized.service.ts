import { Injectable, computed, inject } from '@angular/core';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useNodesInitialized hook.
 * Check if all nodes have been initialized (measured).
 */
@Injectable({
  providedIn: 'root'
})
export class NodesInitializedService {
  private flowState = inject(FlowStateService);

  /**
   * Check if all nodes have been initialized (measured and have dimensions)
   * @returns Computed signal with boolean indicating if all nodes are initialized
   */
  get areNodesInitialized() {
    return computed(() => {
      const nodes = this.flowState.nodeLookup;

      if (nodes.size === 0) {
        return false;
      }

      for (const node of nodes.values()) {
        if (!node.internals.handleBounds || node.measured.width === null || node.measured.height === null) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get the count of initialized nodes
   * @returns Computed signal with count of initialized nodes
   */
  get initializedNodeCount() {
    return computed(() => {
      const nodes = this.flowState.nodeLookup;
      let count = 0;

      for (const node of nodes.values()) {
        if (node.internals.handleBounds && node.measured.width !== null && node.measured.height !== null) {
          count++;
        }
      }

      return count;
    });
  }

  /**
   * Get the total count of nodes
   * @returns Computed signal with total node count
   */
  get totalNodeCount() {
    return computed(() => this.flowState.nodeLookup.size);
  }

  /**
   * Get initialization progress as percentage
   * @returns Computed signal with initialization progress (0-100)
   */
  get initializationProgress() {
    return computed(() => {
      const total = this.totalNodeCount();
      const initialized = this.initializedNodeCount();

      if (total === 0) {
        return 0;
      }

      return Math.round((initialized / total) * 100);
    });
  }
}
