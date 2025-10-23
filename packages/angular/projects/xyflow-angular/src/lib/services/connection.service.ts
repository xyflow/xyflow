import { Injectable, computed, inject } from '@angular/core';
import type { ConnectionState, InternalNodeBase } from '@xyflow/system';
import { FlowStateService } from './flow-state.service';

/**
 * Angular service equivalent of React's useConnection hook.
 * Get the current connection state when a user is dragging a connection line.
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private flowState = inject(FlowStateService);

  /**
   * Get the current connection state
   * @param selector - Optional selector function to transform the connection state
   * @returns The current connection state or transformed value
   */
  getConnection<T = ConnectionState<InternalNodeBase>>(
    selector?: (connection: ConnectionState<InternalNodeBase>) => T
  ) {
    return computed(() => {
      const connection = this.flowState.connection;

      if (selector) {
        return selector(connection);
      }

      return connection as unknown as T;
    });
  }

  /**
   * Check if a connection is currently in progress
   */
  get isConnecting() {
    return computed(() => this.flowState.connection.inProgress);
  }

  /**
   * Get the current connection object (reactive)
   */
  get current() {
    return computed(() => this.flowState.connection);
  }
}
