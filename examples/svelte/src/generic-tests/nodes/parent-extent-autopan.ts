export default {
	flowProps: {
		nodes: [
			{
				id: 'parent',
				type: 'group',
				position: { x: 80, y: 60 },
				width: 320,
				height: 1000,
				data: {}
			},
			{
				id: 'child',
				parentId: 'parent',
				extent: 'parent',
				position: { x: 60, y: 50 },
				width: 80,
				height: 50,
				data: { label: 'child' }
			}
		],
		edges: []
	}
} satisfies FlowConfig;
