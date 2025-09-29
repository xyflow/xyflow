import { Injectable, ApplicationRef, ComponentRef, ViewContainerRef, TemplateRef, EmbeddedViewRef } from '@angular/core';
import { FlowStateService } from '../../services/flow-state.service';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  constructor(
    private appRef: ApplicationRef,
    private flowState: FlowStateService
  ) {}

  /**
   * Creates a portal by appending the view to the flow renderer element
   */
  createPortal(viewRef: EmbeddedViewRef<any>): void {
    const domNode = this.flowState.domNode;
    const rendererElement = domNode?.querySelector('.xyflow__renderer');

    if (rendererElement && viewRef.rootNodes?.length) {
      // Append all root nodes to the renderer
      viewRef.rootNodes.forEach((node) => {
        rendererElement.appendChild(node);
      });

      // Attach to application ref for change detection
      this.appRef.attachView(viewRef);
    }
  }

  /**
   * Destroys the portal by removing the view
   */
  destroyPortal(viewRef: EmbeddedViewRef<any>): void {
    if (viewRef.rootNodes?.length) {
      // Remove all root nodes from DOM
      viewRef.rootNodes.forEach((node) => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    }

    // Detach from application ref
    this.appRef.detachView(viewRef);
    viewRef.destroy();
  }
}
