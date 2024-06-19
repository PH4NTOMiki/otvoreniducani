import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load() {
	const { data: stores } = await db.from('stores').select('*, store_days (*)');
    if (stores) {
		console.log(stores);
		return {stores};
	}

	error(404, 'Not found');
}