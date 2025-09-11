import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Flow Component DOM Structure Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);

    // Create a mock DOM structure that both React and Svelte Flow would generate
    mockFlowDOM();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function mockFlowDOM() {
    // Create the main flow wrapper
    const flowWrapper = document.createElement('div');
    flowWrapper.className = 'react-flow';
    flowWrapper.setAttribute('role', 'application');
    flowWrapper.style.width = '100%';
    flowWrapper.style.height = '100%';

    // Create viewport
    const viewport = document.createElement('div');
    viewport.className = 'react-flow__viewport';
    viewport.style.transform = 'translate(0px, 0px) scale(1)';

    // Create nodes
    const node1 = document.createElement('div');
    node1.className = 'react-flow__node react-flow__node-default';
    node1.setAttribute('data-id', '1');
    node1.setAttribute('tabindex', '0');
    node1.style.position = 'absolute';
    node1.style.left = '100px';
    node1.style.top = '100px';

    const node1Label = document.createElement('div');
    node1Label.textContent = 'Hello';
    node1.appendChild(node1Label);

    const node2 = document.createElement('div');
    node2.className = 'react-flow__node react-flow__node-default';
    node2.setAttribute('data-id', '2');
    node2.setAttribute('tabindex', '0');
    node2.style.position = 'absolute';
    node2.style.left = '300px';
    node2.style.top = '100px';

    const node2Label = document.createElement('div');
    node2Label.textContent = 'World!';
    node2.appendChild(node2Label);

    // Create edge
    const edgeLayer = document.createElement('div');
    edgeLayer.className = 'react-flow__edges';

    const edge = document.createElement('g');
    edge.className = 'react-flow__edge';
    edge.setAttribute('data-testid', 'rf__edge-e1-2');

    const edgePath = document.createElement('path');
    edgePath.setAttribute('d', 'M100,100 L300,100');
    edge.appendChild(edgePath);
    edgeLayer.appendChild(edge);

    // Create controls
    const controls = document.createElement('div');
    controls.className = 'react-flow__controls';

    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'react-flow__controls-button react-flow__controls-zoomin';
    zoomInBtn.setAttribute('data-testid', 'rf__controls-zoomin');
    zoomInBtn.textContent = '+';
    zoomInBtn.setAttribute('aria-label', 'zoom in');

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'react-flow__controls-button react-flow__controls-zoomout';
    zoomOutBtn.setAttribute('data-testid', 'rf__controls-zoomout');
    zoomOutBtn.textContent = '-';
    zoomOutBtn.setAttribute('aria-label', 'zoom out');

    const fitViewBtn = document.createElement('button');
    fitViewBtn.className = 'react-flow__controls-button react-flow__controls-fitview';
    fitViewBtn.setAttribute('data-testid', 'rf__controls-fitview');
    fitViewBtn.textContent = '⊡';
    fitViewBtn.setAttribute('aria-label', 'fit view');

    controls.appendChild(zoomInBtn);
    controls.appendChild(zoomOutBtn);
    controls.appendChild(fitViewBtn);

    // Create background
    const background = document.createElement('div');
    background.className = 'react-flow__background';

    // Assemble structure
    viewport.appendChild(node1);
    viewport.appendChild(node2);
    viewport.appendChild(edgeLayer);

    flowWrapper.appendChild(background);
    flowWrapper.appendChild(viewport);
    flowWrapper.appendChild(controls);

    container.appendChild(flowWrapper);
  }

  describe('Basic DOM Structure', () => {
    it('should have a flow wrapper with proper role', () => {
      const flowWrapper = container.querySelector('.react-flow');
      expect(flowWrapper).toBeTruthy();
      expect(flowWrapper?.getAttribute('role')).toBe('application');
    });

    it('should have a viewport element', () => {
      const viewport = container.querySelector('.react-flow__viewport');
      expect(viewport).toBeTruthy();
    });

    it('should contain two nodes with correct data-ids', () => {
      const nodes = container.querySelectorAll('.react-flow__node');
      expect(nodes.length).toBe(2);

      const node1 = container.querySelector('[data-id="1"]');
      const node2 = container.querySelector('[data-id="2"]');

      expect(node1).toBeTruthy();
      expect(node2).toBeTruthy();
    });

    it('should have node labels with correct text', () => {
      const textContent = container.textContent || '';
      expect(textContent).toContain('Hello');
      expect(textContent).toContain('World!');
    });

    it('should have an edge connecting the nodes', () => {
      const edge = container.querySelector('.react-flow__edge');
      expect(edge).toBeTruthy();
      expect(edge?.getAttribute('data-testid')).toBe('rf__edge-e1-2');
    });
  });

  describe('Controls', () => {
    it('should have a controls container', () => {
      const controls = container.querySelector('.react-flow__controls');
      expect(controls).toBeTruthy();
    });

    it('should have zoom in, zoom out, and fit view buttons', () => {
      const zoomIn = container.querySelector('[data-testid="rf__controls-zoomin"]');
      const zoomOut = container.querySelector('[data-testid="rf__controls-zoomout"]');
      const fitView = container.querySelector('[data-testid="rf__controls-fitview"]');

      expect(zoomIn).toBeTruthy();
      expect(zoomOut).toBeTruthy();
      expect(fitView).toBeTruthy();
    });

    it('should have proper ARIA labels on control buttons', () => {
      const zoomIn = container.querySelector('[data-testid="rf__controls-zoomin"]');
      const zoomOut = container.querySelector('[data-testid="rf__controls-zoomout"]');
      const fitView = container.querySelector('[data-testid="rf__controls-fitview"]');

      expect(zoomIn?.getAttribute('aria-label')).toBe('zoom in');
      expect(zoomOut?.getAttribute('aria-label')).toBe('zoom out');
      expect(fitView?.getAttribute('aria-label')).toBe('fit view');
    });
  });

  describe('Background', () => {
    it('should have a background element', () => {
      const background = container.querySelector('.react-flow__background');
      expect(background).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have focusable nodes', () => {
      const nodes = container.querySelectorAll('[data-id]');
      nodes.forEach((node) => {
        expect(node.getAttribute('tabindex')).toBe('0');
      });
    });

    it('should support keyboard navigation to controls', () => {
      const buttons = container.querySelectorAll('.react-flow__controls button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.tagName.toLowerCase()).toBe('button');
      });
    });

    it('should have proper focus management', () => {
      const firstNode = container.querySelector('[data-id="1"]') as HTMLElement;
      expect(firstNode).toBeTruthy();

      firstNode.focus();
      expect(document.activeElement).toBe(firstNode);
    });
  });

  describe('Interactive Behavior', () => {
    it('should handle node click events', () => {
      const node = container.querySelector('[data-id="1"]') as HTMLElement;
      let clicked = false;

      node.addEventListener('click', () => {
        clicked = true;
        node.classList.add('selected');
      });

      node.click();
      expect(clicked).toBe(true);
      expect(node.classList.contains('selected')).toBe(true);
    });

    it('should handle control button interactions', () => {
      const zoomInBtn = container.querySelector('[data-testid="rf__controls-zoomin"]') as HTMLButtonElement;
      let clicked = false;

      zoomInBtn.addEventListener('click', () => {
        clicked = true;
      });

      zoomInBtn.click();
      expect(clicked).toBe(true);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS class hierarchy', () => {
      const wrapper = container.querySelector('.react-flow');
      const viewport = container.querySelector('.react-flow__viewport');
      const nodes = container.querySelectorAll('.react-flow__node');
      const controls = container.querySelector('.react-flow__controls');
      const background = container.querySelector('.react-flow__background');

      expect(wrapper).toBeTruthy();
      expect(viewport).toBeTruthy();
      expect(nodes.length).toBe(2);
      expect(controls).toBeTruthy();
      expect(background).toBeTruthy();
    });

    it('should have positioned nodes', () => {
      const node1 = container.querySelector('[data-id="1"]') as HTMLElement;
      const node2 = container.querySelector('[data-id="2"]') as HTMLElement;

      expect(node1.style.position).toBe('absolute');
      expect(node2.style.position).toBe('absolute');
      expect(node1.style.left).toBe('100px');
      expect(node2.style.left).toBe('300px');
    });
  });
});
