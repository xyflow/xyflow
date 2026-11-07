import { getSmoothStepPath, Position } from '@xyflow/system';

const rightToLeft = (targetX: number, targetY: number) =>
  getSmoothStepPath({
    sourceX: 0,
    sourceY: 0,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
    borderRadius: 20,
  })[0];

describe('getSmoothStepPath', () => {
  it('uses the full borderRadius for bends next to the source and target', () => {
    // the bends sit at x = 30, so the straight runs to the source and target are 30px long
    const path = rightToLeft(60, 200);

    expect(path).to.contain('L 10,0Q 30,0 30,20');
    expect(path).to.contain('L 30,180Q 30,200 50,200');
  });

  it('keeps borderRadius independent of the distance between the nodes', () => {
    expect(rightToLeft(50, 200)).to.contain('L 5,0Q 25,0 25,20');
    expect(rightToLeft(60, 200)).to.contain('L 10,0Q 30,0 30,20');
    expect(rightToLeft(100, 200)).to.contain('L 30,0Q 50,0 50,20');
  });

  it('still halves a segment that is shared by two bends', () => {
    // the vertical segment between the two bends is only 30px long, so each bend gets 15px
    const path = rightToLeft(60, 30);

    expect(path).to.contain('L 15,0Q 30,0 30,15');
    expect(path).to.contain('L 30,15Q 30,30 45,30');
  });
});

export {};
