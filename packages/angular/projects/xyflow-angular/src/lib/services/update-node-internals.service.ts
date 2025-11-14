import { Injectable, inject } from '@angular/core';
import type { InternalNodeUpdate } from '@xyflow/system';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useUpdateNodeInternals hook.
 * Update node internals (dimensions, handle bounds).
 */
@Injectable({
  providedIn: 'root'
})
export class UpdateNodeInternalsService {
  private flowState = inject(FlowStateService);

  /**
   * Update node internals for a specific node
   * @param nodeId - The ID of the node to update
   */
  updateNodeInternals(nodeId: string): void {
    const nodeElement = this.getNodeDomElement(nodeId);

    if (nodeElement) {
      const updates = new Map<string, InternalNodeUpdate>();
      updates.set(nodeId, {
        id: nodeId,
        nodeElement: nodeElement as HTMLDivElement,
        force: true
      });

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        this.flowState.updateNodeInternals(updates);
      });
    }
  }

  /**
   * Update internals for multiple nodes
   * @param nodeIds - Array of node IDs to update
   */
  updateNodesInternals(nodeIds: string[]): void {
    const updates = new Map<string, InternalNodeUpdate>();

    nodeIds.forEach((nodeId) => {
      const nodeElement = this.getNodeDomElement(nodeId);
      if (nodeElement) {
        updates.set(nodeId, {
          id: nodeId,
          nodeElement: nodeElement as HTMLDivElement,
          force: true
        });
      }
    });

    if (updates.size > 0) {
      requestAnimationFrame(() => {
        this.flowState.updateNodeInternals(updates);
      });
    }
  }

  /**
   * Update internals for all nodes
   */
  updateAllNodeInternals(): void {
    const nodeIds = Array.from(this.flowState.nodeLookup.keys());
    this.updateNodesInternals(nodeIds);
  }

  /**
   * Get the DOM element for a specific node
   * @private
   */
  private getNodeDomElement(nodeId: string): Element | null {
    // Look for Angular Flow node selector first, then XYFlow fallback
    return document.querySelector(`[data-id="${nodeId}"]`) ||
           document.querySelector(`.angular-flow__node[data-id="${nodeId}"]`) ||
           document.querySelector(`.xyflow__node[data-id="${nodeId}"]`);
  }

  /**
   * Force update of node dimensions and handle bounds
   * This is useful when nodes have been resized or their content has changed
   * @param nodeId - Optional specific node ID, if not provided updates all nodes
   */
  forceUpdate(nodeId?: string): void {
    if (nodeId) {
      this.updateNodeInternals(nodeId);
    } else {
      this.updateAllNodeInternals();
    }
  }

  /**
   * Update node internals when the next frame is rendered
   * This is useful for updates that need to happen after DOM changes
   * @param nodeId - The ID of the node to update
   */
  updateNodeInternalsNextFrame(nodeId: string): void {
    requestAnimationFrame(() => {
      this.updateNodeInternals(nodeId);
    });
  }

  /**
   * Update internals for nodes after a delay
   * Useful when waiting for animations or transitions to complete
   * @param nodeIds - Array of node IDs to update
   * @param delay - Delay in milliseconds (default: 100ms)
   */
  updateNodeInternalsDelayed(nodeIds: string[], delay: number = 100): void {
    setTimeout(() => {
      this.updateNodesInternals(nodeIds);
    }, delay);
  }
}
