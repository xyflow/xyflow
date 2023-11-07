import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	try {
		const genericTestCases = import.meta.glob<GenericTestCase>('/src/generic-tests/**/*.ts', {
			eager: true,
			import: 'default'
		});

		const generic = genericTestCases[`/src/generic-tests/${params.topic}/${params.example}.ts`];
		if (generic) {
			return {
				generic
			};
		}
	} catch (e) {
		console.error(e);
	}

	throw error(404, 'Not found');
}
