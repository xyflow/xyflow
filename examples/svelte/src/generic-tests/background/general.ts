import { BackgroundVariant } from '@xyflow/svelte';

export default {
	flowProps: {
		nodes: [],
		edges: []
	},
	backgroundProps: {
		id: 'background-test',
		variant: BackgroundVariant.Cross,
		gap: 24,
		size: 8,
		lineWidth: 2,
		patternColor: '#123456',
		bgColor: '#f8fafc',
		patternClass: 'background-test-pattern'
	}
} satisfies FlowConfig;
