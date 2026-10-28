import { expect, test } from '@playwright/test';
import { reconnectEdge } from '../../../packages/system/src/utils/edges/general';

const oldEdge = {
  id: 'old-edge',
  source: 'a',
  target: 'b',
};

const nextConnection = {
  source: 'a',
  target: 'c',
  sourceHandle: null,
  targetHandle: null,
};

test.describe('reconnectEdge', () => {
  test('replaces the id when no options are passed', () => {
    const edges = reconnectEdge(oldEdge, nextConnection, [oldEdge]);

    expect(edges.map((edge) => edge.id)).toEqual(['xy-edge__a-c']);
  });

  test('keeps the id when shouldReplaceId is false', () => {
    const edges = reconnectEdge(oldEdge, nextConnection, [oldEdge], { shouldReplaceId: false });

    expect(edges.map((edge) => edge.id)).toEqual(['old-edge']);
    expect(edges[0]).toMatchObject({ source: 'a', target: 'c' });
  });

  test('replaces the id with getEdgeId when shouldReplaceId is omitted', () => {
    const edges = reconnectEdge(oldEdge, nextConnection, [oldEdge], {
      getEdgeId: (connection) => `custom-${connection.source}-${connection.target}`,
    });

    expect(edges.map((edge) => edge.id)).toEqual(['custom-a-c']);
  });

  test('replaces the id when only onError is passed', () => {
    const edges = reconnectEdge(oldEdge, nextConnection, [oldEdge], {
      onError: () => undefined,
    });

    expect(edges.map((edge) => edge.id)).toEqual(['xy-edge__a-c']);
  });
});
