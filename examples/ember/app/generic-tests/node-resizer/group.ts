import ResizableNode from './components/resizable-node';
import { Position } from '@xyflow/ember';
import type { FlowConfig } from '../types';

export default {
  flowProps: {
    fitView: true,
    autoPanOnNodeDrag: false,
    nodeTypes: {
      ResizableNode,
    },
    nodes: [
      {
        id: 'group',
        type: 'ResizableNode',
        data: { label: 'Group' },
        position: { x: 0, y: 0 },
        width: 280,
        height: 180,
        selected: true,
        className: 'ember-flow__node-default resizable-test-node',
      },
      {
        id: 'group-child',
        parentId: 'group',
        extent: 'parent',
        data: { label: 'Child' },
        position: { x: 175, y: 110 },
        width: 70,
        height: 46,
        className: 'ember-flow__node-default',
      },
      {
        id: 'group-target',
        data: { label: 'Target' },
        position: { x: 410, y: 95 },
        targetPosition: Position.Left,
      },
    ],
    edges: [
      {
        id: 'group-child-target',
        source: 'group-child',
        target: 'group-target',
      },
    ],
  },
} satisfies FlowConfig;
