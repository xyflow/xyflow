import { TestBed } from '@angular/core/testing';
import { FlowStateService } from '../flow-state.service';
import type { Node, Edge, Viewport } from '../../types/general';

describe('FlowStateService', () => {
  let service: FlowStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlowStateService]
    });
    service = TestBed.inject(FlowStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a unique flow ID', () => {
    expect(service.flowId).toBeTruthy();
    expect(typeof service.flowId).toBe('string');
    expect(service.flowId.length).toBeGreaterThan(0);
  });

  it('should initialize with empty nodes and edges', (done) => {
    service.nodes$.subscribe(nodes => {
      expect(nodes).toEqual([]);
      done();
    });
  });

  it('should update nodes when setNodes is called', (done) => {
    const testNodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
      { id: '2', position: { x: 100, y: 100 }, data: { label: 'Node 2' } }
    ];

    service.setNodes(testNodes);
    
    service.nodes$.subscribe(nodes => {
      expect(nodes).toEqual(testNodes);
      done();
    });
  });

  it('should update edges when setEdges is called', (done) => {
    const testEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' }
    ];

    service.setEdges(testEdges);
    
    service.edges$.subscribe(edges => {
      expect(edges).toEqual(testEdges);
      done();
    });
  });

  it('should update viewport when setViewport is called', (done) => {
    const testViewport: Viewport = { x: 100, y: 200, zoom: 1.5 };

    service.setViewport(testViewport);
    
    service.viewport$.subscribe(viewport => {
      expect(viewport).toEqual(testViewport);
      done();
    });
  });

  it('should handle node changes correctly', () => {
    const initialNodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }
    ];
    
    service.setNodes(initialNodes);
    
    const nodeChange = {
      id: '1',
      type: 'position' as const,
      position: { x: 50, y: 50 }
    };
    
    service.applyNodeChanges([nodeChange]);
    
    service.nodes$.subscribe(nodes => {
      expect(nodes[0].position).toEqual({ x: 50, y: 50 });
    });
  });

  it('should handle edge changes correctly', () => {
    const initialEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' }
    ];
    
    service.setEdges(initialEdges);
    
    const edgeChange = {
      id: 'e1-2',
      type: 'select' as const,
      selected: true
    };
    
    service.applyEdgeChanges([edgeChange]);
    
    service.edges$.subscribe(edges => {
      expect(edges[0].selected).toBe(true);
    });
  });

  it('should track selected nodes', (done) => {
    const nodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, selected: true },
      { id: '2', position: { x: 100, y: 100 }, data: { label: 'Node 2' }, selected: false }
    ];
    
    service.setNodes(nodes);
    
    service.selectedNodes$.subscribe(selectedNodes => {
      expect(selectedNodes).toHaveLength(1);
      expect(selectedNodes[0].id).toBe('1');
      done();
    });
  });

  it('should track selected edges', (done) => {
    const edges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2', selected: true },
      { id: 'e2-3', source: '2', target: '3', selected: false }
    ];
    
    service.setEdges(edges);
    
    service.selectedEdges$.subscribe(selectedEdges => {
      expect(selectedEdges).toHaveLength(1);
      expect(selectedEdges[0].id).toBe('e1-2');
      done();
    });
  });
});