import { Component, inject, OnInit, OnDestroy, ElementRef } from '@angular/core';

export interface EdgeLabelRendererProps {
  children?: any;
}

/**
 * Edges are SVG-based. If you want to render more complex labels you can use the
 * EdgeLabelRenderer component to access a div based renderer. This component
 * is a portal that renders the label in a div that is positioned on top of
 * the edges.
 *
 * @example
 * ```html
 * <xy-edge-label-renderer>
 *   <div style="position: absolute; transform: translate(-50%, -50%) translate(100px, 50px);
 *               background: #ffcc00; padding: 10px;" class="nodrag nopan">
 *     Custom Edge Label
 *   </div>
 * </xy-edge-label-renderer>
 * ```
 *
 * @remarks The EdgeLabelRenderer has no pointer events by default. If you want to
 * add mouse interactions you need to set the style `pointer-events: all` and add
 * the `nopan` class on the label or the element you want to interact with.
 */
@Component({
  selector: 'xy-edge-label-renderer',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class EdgeLabelRendererComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private portalTarget?: Element;

  ngOnInit() {
    // Find the edge label renderer container in the DOM
    const edgeLabelContainer = document.querySelector('.xyflow__edgelabel-renderer, .react-flow__edgelabel-renderer');

    if (edgeLabelContainer) {
      this.portalTarget = edgeLabelContainer;
      // Move this component's content to the edge label renderer
      const element = this.elementRef.nativeElement;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      edgeLabelContainer.appendChild(element);
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
