import { getSmoothStepPath, Position } from '@xyflow/system';

describe('getSmoothStepPath', () => {
  it('keeps borderRadius independent of collinear gap points', () => {
    const [path] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 200,
      targetPosition: Position.Left,
      borderRadius: 20,
    });

    expect(path).to.contain('L 30,0Q 50,0 50,20');
    expect(path).to.contain('L 50,180Q 50,200 70,200');
  });
});

export {};
