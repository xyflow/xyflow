import config from './click-connect';

export default {
	...config,
	flowProps: { ...config.flowProps, selectionOnDrag: true, panOnDrag: [1, 2] }
} satisfies FlowConfig;
