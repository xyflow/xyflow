import { Node, Edge } from '@xyflow/react';

export interface ResourceData {
  type: string;
  name: string;
  status: 'Healthy' | 'Failed' | 'Pending' | 'Unknown';
  message?: string;
  label?: string; // For the graph node display
}

export const initialNodes: Node<ResourceData>[] = [
  {
    id: 'rt-1',
    type: 'resource',
    data: { 
      type: 'ResourceTemplate', 
      name: 'nginx-deployment', 
      status: 'Healthy',
      label: 'Recall Template\nnginx-deployment'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'pp-1',
    type: 'resource',
    data: { 
      type: 'PropagationPolicy', 
      name: 'policy-nginx', 
      status: 'Healthy',
      label: 'Policy\npolicy-nginx'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'rb-1',
    type: 'resource',
    data: { 
      type: 'ResourceBinding', 
      name: 'nginx-binding', 
      status: 'Healthy',
      label: 'Binding\nnginx-binding'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'w-1',
    type: 'resource',
    data: { 
      type: 'Work', 
      name: 'work-member1', 
      status: 'Healthy',
      label: 'Work\nwork-member1'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'w-2',
    type: 'resource',
    data: { 
      type: 'Work', 
      name: 'work-member2', 
      status: 'Failed', 
      message: 'Insufficient GPU resources on node worker-3',
      label: 'Work\nwork-member2'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'c-1',
    type: 'resource',
    data: { 
      type: 'Cluster', 
      name: 'member1', 
      status: 'Healthy',
      label: 'Cluster\nmember1'
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'c-2',
    type: 'resource',
    data: { 
      type: 'Cluster', 
      name: 'member2', 
      status: 'Healthy',
      label: 'Cluster\nmember2'
    },
    position: { x: 0, y: 0 },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'rt-1', target: 'pp-1', animated: true, style: { stroke: '#b0b0b0' } },
  { id: 'e2-3', source: 'pp-1', target: 'rb-1', animated: true, style: { stroke: '#b0b0b0' } },
  { id: 'e3-4', source: 'rb-1', target: 'w-1', animated: true, style: { stroke: '#52c41a' } }, // Green path
  { id: 'e3-5', source: 'rb-1', target: 'w-2', animated: true, style: { stroke: '#ff4d4f' } }, // Red path
  { id: 'e4-6', source: 'w-1', target: 'c-1', animated: true, style: { stroke: '#b0b0b0' } },
  { id: 'e5-7', source: 'w-2', target: 'c-2', animated: true, style: { stroke: '#b0b0b0' } },
];
