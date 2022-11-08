import ReactFlow, { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, ReactFlowProvider } from 'reactflow';
import * as simpleflow from '../../fixtures/simpleflow';

function CustomEdge(props: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath(props);
  return (
    <>
      <BaseEdge path={path} labelX={labelX} labelY={labelY} />
      <EdgeLabelRenderer>
        <div className="label">{props.id}</div>
      </EdgeLabelRenderer>
    </>
  );
}

const simpleflow1 = { ...simpleflow };
simpleflow1.edges = [...simpleflow1.edges];
simpleflow1.edges[0] = { ...simpleflow1.edges[0], id: 'edge1' };

const simpleflow2 = { ...simpleflow };
simpleflow2.edges = [...simpleflow2.edges];
simpleflow2.edges[0] = { ...simpleflow2.edges[0], id: 'edge2' };

describe('<ReactFlow />: Multiple Instances', () => {
  describe('render EdgeLabelRenderer', () => {
    beforeEach(() => {
      cy.mount(
        <>
          <ReactFlowProvider>
            <ReactFlow
              defaultNodes={simpleflow1.nodes}
              edgeTypes={{ default: CustomEdge }}
              defaultEdges={simpleflow1.edges}
              id="reactflow-a"
            />
          </ReactFlowProvider>
          <ReactFlowProvider>
            <ReactFlow
              defaultNodes={simpleflow2.nodes}
              edgeTypes={{ default: CustomEdge }}
              defaultEdges={simpleflow2.edges}
              id="reactflow-b"
            />
          </ReactFlowProvider>
        </>
      );
    });

    it('Each ReactFlow instance has its EdgeLabelRenderer DOM element without conflict', () => {
      cy.get('#edgelabel-portal-reactflow-a').should('have.length', 1);
      cy.get('#edgelabel-portal-reactflow-b').should('have.length', 1);
    });

    it('Each ReactFlow instance has one edge label in EdgeLabelRenderer', () => {
      cy.get('#edgelabel-portal-reactflow-a .label').should('have.length', 1);
      cy.get('#edgelabel-portal-reactflow-a .label').should('contain.text', 'edge1');
      cy.get('#edgelabel-portal-reactflow-b .label').should('have.length', 1);
      cy.get('#edgelabel-portal-reactflow-b .label').should('contain.text', 'edge2');
    });
  });
});
