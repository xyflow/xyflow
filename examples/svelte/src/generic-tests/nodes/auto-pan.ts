export default {
	flowProps: {
		nodes: [
			{ id: 'dragged', position: { x: 100, y: 100 }, data: { label: 'Drag and delete' } },
			{ id: 'remaining', position: { x: 350, y: 250 }, data: { label: 'Remaining node' } }
		],
		edges: []
	}
} satisfies FlowConfig;
