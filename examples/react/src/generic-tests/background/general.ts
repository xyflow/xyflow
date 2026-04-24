import { BackgroundVariant } from '@xyflow/react';

export default {
  flowProps: {
    nodes: [],
    edges: [],
  },
  backgroundProps: {
    id: 'background-test',
    variant: BackgroundVariant.Cross,
    gap: 24,
    size: 8,
    lineWidth: 2,
    color: '#123456',
    bgColor: '#f8fafc',
    patternClassName: 'background-test-pattern',
  },
} satisfies FlowConfig;
