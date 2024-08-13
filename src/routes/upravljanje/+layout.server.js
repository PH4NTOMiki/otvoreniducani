import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ url, locals }) {
	if (!locals.user) {
        if(url.pathname!='/upravljanje/prijava')redirect(302, '/upravljanje/prijava');
    } else {
        if(url.pathname=='/upravljanje/prijava')redirect(302, '/upravljanje');
    }
	return {user: locals.user};
}