import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { data: stores } = await db.from('stores').select();
    if (stores) {
		return {stores};
	}

	error(404, 'Not found');
}