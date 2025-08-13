import { MarkerType } from '@xyflow/react';

export default {
  flowProps: {
    fitView: true,
    selectionKeyCode: 's',
    multiSelectionKeyCode: 's',
    deleteKeyCode: 'd',
    nodes: [
      {
        id: '1',
        data: { label: '1' },
        position: { x: 0, y: 0 },
        type: 'input',
      },
      {
        id: '2',
        data: { label: '2' },
        position: { x: -100, y: 100 },
      },
      {
        id: '3',
        data: { label: '3' },
        position: { x: 100, y: 100 },
      },
      {
        id: '4',
        data: { label: '4' },
        position: { x: -100, y: 200 },
      },
      {
        id: '5',
        data: { label: '5' },
        position: { x: 100, y: 200 },
      },
      {
        id: '6',
        data: { label: '6' },
        position: { x: -100, y: 300 },
      },
      {
        id: '7',
        data: { label: '7' },
        position: { x: 100, y: 300 },
      },
      {
        id: '8',
        data: { label: '8' },
        position: { x: -100, y: 400 },
      },
      {
        id: '9',
        data: { label: '9' },
        position: { x: 100, y: 400 },
      },
      {
        id: '10',
        data: { label: '10' },
        position: { x: -100, y: 500 },
      },
      {
        id: '11',
        data: { label: '11' },
        position: { x: 100, y: 500 },
      },
      {
        id: '12',
        data: { label: '12' },
        position: { x: 100, y: 600 },
        width: 200,
        height: 100,
      },
      {
        id: '12-a',
        parentId: '12',
        data: { label: '12-a' },
        position: { x: 10, y: 20 },
        width: 50,
        height: 50,
      },
      {
        id: '12-b',
        parentId: '12',
        data: { label: '12-b' },
        position: { x: 140, y: 20 },
        width: 50,
        height: 50,
      },
      // {
      // 	id: '12',
      // 	data: { label: '12' },
      // 	position: { x: -100, y: 600 }
      // },
      // {
      // 	id: '13',
      // 	data: { label: '13' },
      // 	position: { x: 100, y: 600 }
      // }
    ],
    edges: [
      {
        id: 'edge-with-class',
        source: '1',
        target: '2',
        className: 'edge-class-test',
      },
      {
        id: 'edge-with-style',
        source: '1',
        target: '3',
        style: {
          stroke: 'red',
        },
      },
      {
        id: 'hidden-edge',
        source: '2',
        target: '4',
        label: 'hidden',
        hidden: true,
      },
      {
        id: 'animated-edge',
        source: '3',
        target: '5',
        label: 'animated',
        animated: true,
      },
      {
        id: 'not-selectable-edge',
        source: '4',
        target: '6',
        label: 'not-selectable',
        selectable: false,
      },
      {
        id: 'not-deletable',
        source: '5',
        target: '7',
        label: 'not-deletable',
        deletable: false,
      },
      {
        id: 'z-index',
        source: '6',
        target: '8',
        label: 'z-index',
        zIndex: 3141592,
      },
      {
        id: 'aria-label',
        source: '7',
        target: '9',
        label: 'aria-label',
        ariaLabel: 'aria-label-test',
      },
      {
        id: 'interaction-width',
        source: '8',
        target: '10',
        label: 'interaction-width',
        interactionWidth: 42,
      },
      {
        id: 'markers',
        source: '9',
        target: '11',
        label: 'markers',
        markerEnd: { type: MarkerType.Arrow },
        markerStart: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'subflow-edge',
        source: '11',
        target: '12-a',
      },
      {
        id: 'subflow-edge-2',
        source: '12-a',
        target: '12-b',
      },
      {
        id: 'multi-edge-1',
        source: '10',
        target: '11',
        label: 'first edge',
      },
      {
        id: 'multi-edge-2',
        source: '10',
        target: '11',
        label: 'second edge',
        type: 'step',
      },
      // {
      // 	id: 'updatable',
      // 	source: '9',
      // 	target: '11',
      // 	label: 'focusable',
      // 	reconnectable: true
      // },
      // {
      // 	id: 'not-focusable',
      //
      // 	source: '5',
      // 	target: '7',
      // 	label: 'not-focusable',
      // 	focusable: false
      // },
    ],
  },
} satisfies FlowConfig;
