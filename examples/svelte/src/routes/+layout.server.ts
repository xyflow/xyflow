import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ route }) {
	console.log(route);
	if (route.id === '/') {
		throw redirect(307, '/examples/overview');
	}
}
