export default {
	flowProps: {
		panOnScroll: true,
		initialViewport: { x: 1.23, y: 9.87, zoom: 1.234 },
		autoPanOnConnect: false,
		autoPanOnNodeDrag: false,
		nodes: [
			{
				id: '1',
				data: { label: '1' },
				position: { x: 0, y: 0 },
				type: 'input'
			},
			{
				id: '2',
				data: { label: '2' },
				position: { x: -100, y: 100 }
			},
			{
				id: '3',
				data: { label: '3' },
				position: { x: 100, y: 100 }
			}
		],
		edges: [
			{
				id: 'first-edge',
				source: '1',
				target: '2'
			},
			{
				id: 'second-edge',
				source: '1',
				target: '3'
			}
		]
	}
} satisfies FlowConfig;
