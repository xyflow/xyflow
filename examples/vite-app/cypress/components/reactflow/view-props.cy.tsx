import { ReactFlow, ReactFlowProps, Viewport, useViewport, SnapGrid, CoordinateExtent, Node } from '@xyflow/react';

import ControlledFlow from '../../support/ControlledFlow';
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
    cy.mount(<Comp nodes={nodesOutsideOfView} fitView minZoom={0.2} />).wait(200);
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

  describe('uses defaultViewport', () => {
    it('defaultViewport: { x: 0, y: 0, zoom: 1 }', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: 1 };

      cy.mount(<Comp nodes={simpleflow.nodes} defaultViewport={defaultViewport} onChange={onChangeSpy} />).then(() => {
        expect(getLatestViewport(onChangeSpy)).to.be.eql(defaultViewport);
      });
    });

    it('defaultViewport: { x: 0, y: 0, zoom: 1.5 }', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

      cy.mount(<Comp nodes={simpleflow.nodes} defaultViewport={defaultViewport} onChange={onChangeSpy} />).then(() => {
        expect(getLatestViewport(onChangeSpy)).to.be.eql(defaultViewport);
      });
    });

    it('defaultViewport: { x: 100, y: 100, zoom: 1.5 }', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 100, y: 100, zoom: 1.5 };

      cy.mount(<Comp nodes={simpleflow.nodes} defaultViewport={defaultViewport} onChange={onChangeSpy} />).then(() => {
        expect(getLatestViewport(onChangeSpy)).to.be.eql(defaultViewport);
      });
    });

    it('defaultViewport: invalid { x: 0, y: 0, zoom: -1 }', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: -1 };

      cy.mount(<Comp nodes={simpleflow.nodes} defaultViewport={defaultViewport} onChange={onChangeSpy} />).then(() => {
        // this should be min zoom because zoom is clamped
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eql(0.5);
      });
    });

    it('defaultViewport: invalid { x: 0, y: 0, zoom: 100 }', () => {
      const onChangeSpy = cy.spy().as('onChangeSpy');
      const defaultViewport = { x: 0, y: 0, zoom: 100 };

      cy.mount(<Comp nodes={simpleflow.nodes} defaultViewport={defaultViewport} onChange={onChangeSpy} />).then(() => {
        // this should be max zoom because zoom is clamped
        expect(getLatestViewport(onChangeSpy).zoom).to.be.eql(2);
      });
    });
  });

  it('uses snapGrid and snapToGrid', () => {
    const snapGrid: SnapGrid = [100, 100];

    cy.mount(<ControlledFlow initialNodes={simpleflow.nodes} snapGrid={snapGrid} snapToGrid />).then(() => {
      cy.drag('.react-flow__node:first', { x: 125, y: 125 }).then(($el: any) => {
        const transformAfterDrag = $el.css('transform');
        const { m41: nodeX, m42: nodeY } = new DOMMatrixReadOnly(transformAfterDrag);
        expect([nodeX, nodeY]).to.eql(snapGrid);
      });
    });
  });

  describe('uses onlyRenderVisibleElements', () => {
    it('displays no nodes', () => {
      cy.mount(<ControlledFlow initialNodes={nodesOutsideOfView} onlyRenderVisibleElements />).then(() => {
        cy.get('.react-flow__node').should('have.length', 0);
      });
    });

    it('displays one node', () => {
      const nodes = nodesOutsideOfView.map((n) => {
        if (n.id === '1') {
          return { ...n, position: { x: 0, y: 0 } };
        }
        return n;
      });
      cy.mount(<ControlledFlow initialNodes={nodes} onlyRenderVisibleElements />).then(() => {
        cy.get('.react-flow__node').should('have.length', 1);
      });
    });
  });

  it('uses translateExtent', () => {
    const translateExtent: CoordinateExtent = [
      [0, 0],
      [1000, 1000],
    ];

    cy.mount(<ControlledFlow translateExtent={translateExtent} />).then(() => {
      const transformBeforeDrag = Cypress.$('.react-flow__viewport').css('transform');

      cy.dragPane({ from: { x: 0, y: 0 }, to: { x: 100, y: 100 } }).then(() => {
        const transformAfterDrag = Cypress.$('.react-flow__viewport').css('transform');
        expect(transformBeforeDrag).to.eql(transformAfterDrag);
      });
    });
  });

  it('uses nodeExtent', () => {
    const nodes: Node[] = [
      {
        id: '1',
        position: { x: 200, y: 200 },
        data: { label: '1' },
      },
    ];

    const nodeExtent: CoordinateExtent = [
      [0, 0],
      [50, 50],
    ];

    cy.mount(<ControlledFlow nodes={nodes} nodeExtent={nodeExtent} />)
      .wait(500)
      .then(() => {
        const transform = Cypress.$('.react-flow__node:first').css('transform');
        const { m41: nodeX, m42: nodeY } = new DOMMatrixReadOnly(transform);
        expect(nodeX).to.equal(50);
        expect(nodeY).to.equal(50);
      });
  });

  describe('uses preventScrolling', () => {
    function ScrollFlow({ preventScrolling }: { preventScrolling: boolean }) {
      return (
        <div className="wrapper" style={{ height: 2000 }}>
          <div className="inner" style={{ height: 500 }}>
            <ControlledFlow preventScrolling={preventScrolling} />
          </div>
        </div>
      );
    }

    it('lets user scroll', () => {
      cy.mount(<ScrollFlow preventScrolling={false} />).then(() => {
        cy.window().then((window) => {
          cy.get('.react-flow__pane').trigger('wheel', {
            wheelDelta: 240,
            wheelDeltaX: 0,
            wheelDeltaY: 240,
            eventConstructor: 'WheelEvent',
            view: window,
          });

          // @TODO: why is this not working?
          // it seems that the event is somehow broken. This works fine when using the mouse.
          // cy.window().its('scrollY').should('be.gt', 0);
        });
      });
    });

    it('does not user scroll', () => {
      cy.mount(<ScrollFlow preventScrolling={true} />).then(() => {
        cy.window().then((window) => {
          cy.get('.react-flow__pane').trigger('wheel', {
            wheelDelta: 240,
            wheelDeltaX: 0,
            wheelDeltaY: 240,
            eventConstructor: 'WheelEvent',
            view: window,
          });

          cy.window().its('scrollY').should('be.equal', 0);
        });
      });
    });
  });

  describe('uses attributionPosition', () => {
    it('displays it on the bottom right', () => {
      cy.mount(<ControlledFlow />).then(() => {
        cy.get('.react-flow__attribution').then(($el) => {
          const { left, top, width, height } = $el[0].getBoundingClientRect();

          expect(left).equal(window.innerWidth - width);
          expect(top).equal(window.innerHeight - height);
        });
      });
    });

    it('displays it on the top left', () => {
      cy.mount(<ControlledFlow attributionPosition="top-left" />).then(() => {
        cy.get('.react-flow__attribution').then(($el) => {
          const { left, top } = $el[0].getBoundingClientRect();

          expect(left).equal(0);
          expect(top).equal(0);
        });
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
