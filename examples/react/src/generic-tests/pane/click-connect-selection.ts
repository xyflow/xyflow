import config from './click-connect';

export default {
  ...config,
  flowProps: { ...config.flowProps, panOnDrag: false, selectionOnDrag: true },
} satisfies FlowConfig;
