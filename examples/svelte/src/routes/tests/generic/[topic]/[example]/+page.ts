import { error } from '@sveltejs/kit';

const flowConfigs = import.meta.glob<FlowConfig>('/src/generic-tests/**/*.ts', {
	eager: true,
	import: 'default'
});

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const flowConfig = flowConfigs[`/src/generic-tests/${params.topic}/${params.example}.ts`];

	if (!flowConfig) {
		throw error(404, 'Not found');
	}

	return {
		flowConfig
	};
}
