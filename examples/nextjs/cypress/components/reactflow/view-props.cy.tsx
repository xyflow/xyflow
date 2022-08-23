import { ReactFlow, ReactFlowProps, Viewport, useViewport } from '@react-flow/bundle';

import * as simpleflow from '../../fixtures/simpleflow';

const nodesOutsideOfView = [
  {
    ...simpleflow.nodes[0],
    position: {
      x: -500,
      y: 0,
    },
  },
  {
    ...simpleflow.nodes[1],
    position: {
      x: 500,
      y: 0,
    },
  },
];

describe('<ReactFlow />: View Props', () => {
  it('uses fitView', () => {
    cy.mount(<Comp nodes={nodesOutsideOfView} fitView minZoom={0.2} />);
    cy.get('.react-flow__node:first').isWithinViewport();
  });

  it('uses fitViewOptions', () => {
    const fitViewOptions = { padding: 0.5 };

    cy.mount(<ReactFlow nodes={[nodesOutsideOfView[0]]} fitView fitViewOptions={fitViewOptions} />).wait(200);
    cy.get('.react-flow__node:first').isWithinViewport();
  });

  describe('uses minZoom', () => {
    it('minZoom: 0.2', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');

      cy.mount(<Comp minZoom={0.2} onChange={onChangeSpy} />);

      cy.zoomPane(10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(0.2);
      });
    });

    it('minZoom: 1', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');

      cy.mount(<Comp minZoom={1} onChange={onChangeSpy} />);

      cy.zoomPane(10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(1);
      });
    });

    it('sets invalid defaultZoom', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: 0.2 };

      cy.mount(<Comp minZoom={1} defaultViewport={defaultViewport} onChange={onChangeSpy} />);

      cy.zoomPane(10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(1);
      });
    });
  });

  describe('uses maxZoom', () => {
    it('maxZoom: 1', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');

      cy.mount(<Comp maxZoom={1} onChange={onChangeSpy} />);

      cy.zoomPane(-10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(1);
      });
    });

    it('maxZoom: 2', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');

      cy.mount(<Comp maxZoom={2} onChange={onChangeSpy} />);

      cy.zoomPane(-10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(2);
      });
    });

    it('sets invalid defaultZoom', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: 2 };

      cy.mount(<Comp maxZoom={1.5} defaultViewport={defaultViewport} onChange={onChangeSpy} />);

      cy.zoomPane(-10000).then(() => {
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eq(1.5);
      });
    });
  });
});

// test specific helpers

type CompProps = {
  onChange?: (vp: Viewport) => void;
};

function InnerComp({ onChange }: CompProps) {
  const viewport = useViewport();

  onChange?.(viewport);

  return null;
}

function Comp({ onChange, ...rest }: CompProps & ReactFlowProps) {
  return (
    <ReactFlow {...rest}>
      <InnerComp onChange={onChange} />
    </ReactFlow>
  );
}

function getLatestViewport(onChangeSpy: any) {
  return onChangeSpy.lastCall.args[0] as unknown as Viewport;
}
