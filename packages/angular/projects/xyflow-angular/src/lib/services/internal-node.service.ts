import { Injectable, computed, inject } from '@angular/core';
import type { InternalNodeBase } from '@xyflow/system';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useInternalNode hook.
 * Get the internal node object by ID.
 */
@Injectable({
  providedIn: 'root'
})
export class InternalNodeService {
  private flowState = inject(FlowStateService);

  /**
   * Get internal node by ID
   * @param nodeId - The ID of the node
   * @returns Computed signal with the internal node or undefined
   */
  getInternalNode<T extends InternalNodeBase = InternalNodeBase>(nodeId: string) {
    return computed(() => {
      return this.flowState.nodeLookup.get(nodeId) as T | undefined;
    });
  }

  /**
   * Check if a node exists
   * @param nodeId - The ID of the node
   * @returns Computed signal with boolean indicating if node exists
   */
  nodeExists(nodeId: string) {
    return computed(() => {
      return this.flowState.nodeLookup.has(nodeId);
    });
  }

  /**
   * Get node dimensions
   * @param nodeId - The ID of the node
   * @returns Computed signal with node dimensions or null
   */
  getNodeDimensions(nodeId: string) {
    return computed(() => {
      const node = this.flowState.nodeLookup.get(nodeId);

      if (!node || node.measured.width === null || node.measured.height === null) {
        return null;
      }

      return {
        width: node.measured.width,
        height: node.measured.height
      };
    });
  }

  /**
   * Get node position
   * @param nodeId - The ID of the node
   * @returns Computed signal with node position
   */
  getNodePosition(nodeId: string) {
    return computed(() => {
      const node = this.flowState.nodeLookup.get(nodeId);

      if (!node) {
        return { x: 0, y: 0 };
      }

      return {
        x: node.internals.positionAbsolute.x,
        y: node.internals.positionAbsolute.y
      };
    });
  }

  /**
   * Get node handle bounds
   * @param nodeId - The ID of the node
   * @returns Computed signal with handle bounds or null
   */
  getNodeHandleBounds(nodeId: string) {
    return computed(() => {
      const node = this.flowState.nodeLookup.get(nodeId);
      return node?.internals.handleBounds || null;
    });
  }

  /**
   * Check if node is initialized (has dimensions and handle bounds)
   * @param nodeId - The ID of the node
   * @returns Computed signal with boolean indicating if node is initialized
   */
  isNodeInitialized(nodeId: string) {
    return computed(() => {
      const node = this.flowState.nodeLookup.get(nodeId);

      if (!node) {
        return false;
      }

      return !!(
        node.internals.handleBounds &&
        node.measured.width !== null &&
        node.measured.height !== null
      );
    });
  }
}
