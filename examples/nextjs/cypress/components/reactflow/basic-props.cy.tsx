import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
  ReactFlowProps,
  EdgeProps,
} from '@react-flow/bundle';

import * as simpleflow from '../../fixtures/simpleflow';

describe('<ReactFlow />: Basic Props', () => {
  describe('uses defaultNodes and defaultEdges', () => {
    beforeEach(() => {
      cy.mount(<ReactFlow defaultNodes={simpleflow.nodes} defaultEdges={simpleflow.edges} />);
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('drags a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: any) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
      });
    });
  });

  describe('uses nodes and edges', () => {
    beforeEach(() => {
      cy.mount(<Comp initialNodes={simpleflow.nodes} initialEdges={simpleflow.edges} />);
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('can not drag a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: any) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.equal(styleAfterDrag);
      });
    });
  });

  describe('uses onNodesChange handler', () => {
    beforeEach(() => {
      cy.mount(<Comp addOnNodeChangeHandler initialNodes={simpleflow.nodes} />);
    });

    it('mounts nodes', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', 0);
    });

    it('drags a node', () => {
      const styleBeforeDrag = Cypress.$('.react-flow__node:first').css('transform');

      cy.drag('.react-flow__node:first', { x: 200, y: 25 }).then(($el: any) => {
        const styleAfterDrag = $el.css('transform');
        expect(styleBeforeDrag).to.not.equal(styleAfterDrag);
      });
    });

    it('can not connect nodes', () => {
      cy.get('.react-flow__node').first().find('.react-flow__handle.source').trigger('mousedown', { button: 0 });

      cy.get('.react-flow__node')
        .last()
        .find('.react-flow__handle.target')
        .trigger('mousemove')
        .trigger('mouseup', { force: true });

      cy.get('.react-flow__edge').should('have.length', 0);
    });
  });

  describe('uses onEdgeChange handler', () => {
    beforeEach(() => {
      cy.mount(<Comp addOnEdgeChangeHandler initialNodes={simpleflow.nodes} initialEdges={simpleflow.edges} />);
    });

    it('mounts nodes and edges', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', simpleflow.edges.length);
    });

    it('selects an edge', () => {
      cy.get('.react-flow__edge').first().click().should('have.class', 'selected');
    });
  });

  describe('uses onConnect handlers', () => {
    beforeEach(() => {
      cy.mount(<Comp addOnConnectHandler initialNodes={simpleflow.nodes} />);
    });

    it('mounts nodes', () => {
      cy.get('.react-flow__node').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow__edge').should('have.length', 0);
    });

    it('connects nodes', () => {
      cy.get('.react-flow__node').first().find('.react-flow__handle.source').trigger('mousedown', { button: 0 });

      cy.get('.react-flow__node')
        .last()
        .find('.react-flow__handle.target')
        .trigger('mousemove')
        .trigger('mouseup', { force: true });

      cy.get('.react-flow__edge').should('have.length', 1);
    });
  });

  describe('uses nodeTypes', () => {
    it('renders custom nodes', () => {
      const nodeTypes = {
        custom: () => <div className="customnode">custom node</div>,
      };

      const initialNodes = simpleflow.nodes.map((n) => ({
        ...n,
        type: 'custom',
      }));

      cy.mount(<Comp nodeTypes={nodeTypes} initialNodes={initialNodes} />);

      cy.get('.react-flow__node-custom').should('have.length', simpleflow.nodes.length);
      cy.get('.react-flow').contains('custom node');
    });

    it('tries invalid node type - should fallback to default', () => {
      const initialNodes = simpleflow.nodes.map((n) => ({
        ...n,
        type: 'invalid',
      }));

      cy.mount(<Comp initialNodes={initialNodes} />);

      cy.get('.react-flow__node-invalid').should('have.length', 0);
      cy.get('.react-flow__node-default').should('have.length', simpleflow.nodes.length);
    });
  });

  describe('uses edgeTypes', () => {
    it('renders custom edge', () => {
      const edgeTypes = {
        custom: ({ sourceX, sourceY, targetX, targetY }: EdgeProps) => (
          <path d={`M${sourceX} ${sourceY} L${targetX} ${targetY}`} stroke="black" />
        ),
      };

      const initialEdges = simpleflow.edges.map((e) => ({
        ...e,
        type: 'custom',
      }));

      cy.mount(<Comp edgeTypes={edgeTypes} initialNodes={simpleflow.nodes} initialEdges={initialEdges} />);

      cy.get('.react-flow__edge-custom').should('have.length', simpleflow.edges.length);
    });

    it('tries invalid edge type - should fallback to default', () => {
      const initialEdges = simpleflow.edges.map((e) => ({
        ...e,
        type: 'invalid',
      }));

      cy.mount(<Comp initialNodes={simpleflow.nodes} initialEdges={initialEdges} />);

      cy.get('.react-flow__edge-invalid').should('have.length', 0);
      cy.get('.react-flow__edge-default').should('have.length', simpleflow.edges.length);
    });
  });

  it('uses style', () => {
    const styles = {
      backgroundColor: 'red',
    };

    cy.mount(<Comp style={styles} />);
    cy.get('.react-flow').should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('uses classname', () => {
    cy.mount(<Comp className="custom" />);
    cy.get('.react-flow').should('have.class', 'custom');
  });
});

// test specific helper component

function Comp({
  addOnNodeChangeHandler = false,
  addOnEdgeChangeHandler = false,
  addOnConnectHandler = false,
  initialNodes = [],
  initialEdges = [],
  ...rest
}: {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  addOnNodeChangeHandler?: boolean;
  addOnEdgeChangeHandler?: boolean;
  addOnConnectHandler?: boolean;
} & Partial<ReactFlowProps>) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handlers: {
    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;
    onConnect?: (params: Connection | Edge) => void;
  } = {};

  if (addOnNodeChangeHandler) {
    handlers.onNodesChange = onNodesChange;
  }

  if (addOnEdgeChangeHandler) {
    handlers.onEdgesChange = onEdgesChange;
  }

  if (addOnConnectHandler) {
    handlers.onConnect = onConnect;
  }

  return <ReactFlow nodes={nodes} edges={edges} {...handlers} {...rest} />;
}
