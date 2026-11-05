import test from 'node:test';
import assert from 'node:assert/strict';

import { getSmoothStepPath, Position } from '../../packages/system/dist/esm/index.mjs';

const BORDER_RADIUS = 20;
const OFFSET = 40;
const EPSILON = 1e-6;

function parsePath(path) {
  return path.match(/[MLQ][^MLQ]*/g).map((command) => {
    const type = command[0];
    // The path generator uses both whitespace and commas to separate coordinates.
    const values = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    assert.equal(values.length, type === 'Q' ? 4 : 2, `Invalid path command: ${command}`);
    assert.ok(values.every(Number.isFinite), `Invalid path coordinates: ${command}`);
    return { type, values };
  });
}

function direction(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  return length <= EPSILON ? null : [dx / length, dy / length];
}

function assertRoundedPath(path, radius) {
  let current;
  let previousDirection;
  let bends = 0;

  const assertTangent = (nextDirection) => {
    if (previousDirection && nextDirection) {
      assert.ok(
        previousDirection.every((value, index) => Math.abs(value - nextDirection[index]) < EPSILON),
        `Found a sharp corner in path: ${path}`
      );
    }
  };

  for (const { type, values } of parsePath(path)) {
    const point = { x: values[0], y: values[1] };
    if (type === 'M') {
      current = point;
      continue;
    }

    const entryDirection = direction(current, point);
    assertTangent(entryDirection);

    if (type === 'L') {
      // A zero-length line must not hide a direction change at the next segment.
      previousDirection = entryDirection ?? previousDirection;
      current = point;
      continue;
    }

    const end = { x: values[2], y: values[3] };
    const exitDirection = direction(point, end);
    const entrySize = Math.hypot(point.x - current.x, point.y - current.y);
    const exitSize = Math.hypot(end.x - point.x, end.y - point.y);
    assert.ok(entrySize > 0 && entrySize <= radius + EPSILON, `Invalid bend radius in: ${path}`);
    assert.ok(Math.abs(entrySize - exitSize) < EPSILON, `Unequal bend sizes in: ${path}`);
    assert.ok(Math.abs(entryDirection[0] * exitDirection[0] + entryDirection[1] * exitDirection[1]) < EPSILON);
    previousDirection = exitDirection;
    current = end;
    bends++;
  }

  return bends;
}

function params(position, distance, perpendicular = false) {
  const horizontal = position === Position.Left || position === Position.Right;
  return {
    sourceX: 100,
    sourceY: 100,
    targetX: 100 + (horizontal !== perpendicular ? distance : 0),
    targetY: 100 + (horizontal !== perpendicular ? 0 : distance),
    sourcePosition: position,
    targetPosition: position,
    borderRadius: BORDER_RADIUS,
    offset: OFFSET,
  };
}

for (const position of Object.values(Position)) {
  for (const distance of [-300, -10, 10, 300]) {
    test(`rounds aligned ${position}/${position} handles separated by ${distance}`, () => {
      const options = params(position, distance);
      const [path, labelX, labelY] = getSmoothStepPath(options);
      assert.equal(assertRoundedPath(path, BORDER_RADIUS), 4);

      const commands = parsePath(path);
      assert.deepEqual(commands[0].values, [options.sourceX, options.sourceY]);
      assert.deepEqual(commands.at(-1).values, [options.targetX, options.targetY]);

      const horizontal = position === Position.Left || position === Position.Right;
      const labelOffset = Math.abs((horizontal ? labelY : labelX) - 100);
      assert.equal(labelOffset, OFFSET, 'Keep the label on the perpendicular detour');
    });
  }

  for (const distance of [-200, 200]) {
    test(`preserves rounding for perpendicular alignment of ${position}/${position} handles (${distance})`, () => {
      const [path] = getSmoothStepPath(params(position, distance, true));
      assert.equal(assertRoundedPath(path, BORDER_RADIUS), 2);
    });
  }

  test(`supports zero borderRadius for aligned ${position}/${position} handles`, () => {
    const options = { ...params(position, 300), borderRadius: 0 };
    const [path] = getSmoothStepPath(options);
    const commands = parsePath(path);
    for (const { type, values } of commands) {
      if (type === 'Q') {
        assert.deepEqual(values.slice(0, 2), values.slice(2));
      }
    }
    assert.deepEqual(commands.at(-1).values, [options.targetX, options.targetY]);
  });

  test(`keeps degenerate ${position}/${position} inputs finite`, () => {
    for (const options of [{ ...params(position, 300), offset: 0 }, params(position, 0)]) {
      const [path, ...coordinates] = getSmoothStepPath(options);
      parsePath(path);
      assert.ok(coordinates.every(Number.isFinite));
    }
  });
}

test('preserves a straight path between opposite facing handles', () => {
  const [path] = getSmoothStepPath({ ...params(Position.Right, 300), targetPosition: Position.Left });
  assert.equal(path, 'M100 100L400 100');
});
