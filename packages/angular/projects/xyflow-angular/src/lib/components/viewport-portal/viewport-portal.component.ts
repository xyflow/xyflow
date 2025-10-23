import { Component, input, inject, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { PortalService } from '../node-toolbar/portal.service';

export interface ViewportPortalProps {
  children?: any;
}

/**
 * The ViewportPortal component can be used to add components to the same viewport
 * of the flow where nodes and edges are rendered. This is useful when you want to render
 * your own components that adhere to the same coordinate system as the nodes & edges
 * and are also affected by zooming and panning.
 *
 * @example
 * ```html
 * <xy-viewport-portal>
 *   <div style="transform: translate(100px, 100px); position: absolute;">
 *     This div is positioned at [100, 100] on the flow.
 *   </div>
 * </xy-viewport-portal>
 * ```
 */
@Component({
  selector: 'xy-viewport-portal',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ViewportPortalComponent implements OnInit, OnDestroy {
  private portalService = inject(PortalService);
  private elementRef = inject(ElementRef);
  private portalTarget?: Element;

  ngOnInit() {
    // Find the viewport portal container in the DOM
    const flowContainer = document.querySelector('.xyflow__viewport-portal, .react-flow__viewport-portal');

    if (flowContainer) {
      this.portalTarget = flowContainer;
      // Move this component's content to the viewport portal
      const element = this.elementRef.nativeElement;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      flowContainer.appendChild(element);
    }
  }

  ngOnDestroy() {
    // Clean up - remove from portal target
    const element = this.elementRef.nativeElement;
    if (element.parentNode && this.portalTarget) {
      element.parentNode.removeChild(element);
    }
  }
}
