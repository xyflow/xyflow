export default {
	flowProps: {
		nodeOrigin: [0.5, 0.5],
		snapGrid: [20, 20],
		nodeDragThreshold: 0,
		autoPanOnNodeDrag: false,
		multiSelectionKey: 's',
		initialViewport: { x: 200, y: 100, zoom: 1 },
		nodes: [
			{ id: 'center', position: { x: 0, y: 0 }, data: { label: 'Center' }, width: 100, height: 30 },
			{
				id: 'top-left',
				position: { x: 200, y: 0 },
				origin: [0, 0],
				data: { label: 'Top left' },
				width: 100,
				height: 30
			},
			{
				id: 'bottom-right',
				position: { x: 400, y: 0 },
				origin: [1, 1],
				data: { label: 'Bottom right' },
				width: 100,
				height: 30
			},
			{
				id: 'odd-size',
				position: { x: 0, y: 160 },
				data: { label: 'Odd size' },
				width: 101,
				height: 31
			},
			{
				id: 'other',
				position: { x: 200, y: 165 },
				data: { label: 'Other' },
				width: 80,
				height: 40
			},
			{
				id: 'parent',
				type: 'group',
				position: { x: 450, y: 200 },
				origin: [0, 0],
				data: {},
				width: 175,
				height: 120
			},
			{
				id: 'child',
				parentId: 'parent',
				extent: 'parent',
				position: { x: 70, y: 60 },
				data: { label: 'Child' },
				width: 100,
				height: 30
			}
		],
		edges: []
	}
} satisfies FlowConfig;
