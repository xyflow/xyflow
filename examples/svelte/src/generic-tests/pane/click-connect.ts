export default {
	flowProps: {
		fitView: true,
		nodes: [
			{ id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Source' } },
			{ id: '2', position: { x: 0, y: 150 }, data: { label: 'Target' } }
		],
		edges: [],
		onpaneclick: () => console.log('pane-click'),
		onclickconnectstart: () => console.log('click-connect-start'),
		onclickconnectend: (_event, connection) =>
			console.log('click-connect-end', JSON.stringify(connection))
	}
} satisfies FlowConfig;
