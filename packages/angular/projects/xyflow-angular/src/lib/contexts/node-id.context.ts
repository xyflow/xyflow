import { Injectable, InjectionToken } from '@angular/core';

export const NODE_ID_TOKEN = new InjectionToken<string>('NodeId');

/**
 * Context service to provide the current node ID within node components.
 * This is equivalent to React's NodeIdContext.
 */
@Injectable({
  providedIn: 'root'
})
export class NodeIdContext {
  private _nodeId?: string;

  get nodeId(): string | undefined {
    return this._nodeId;
  }

  setNodeId(nodeId: string | undefined): void {
    this._nodeId = nodeId;
  }
}
