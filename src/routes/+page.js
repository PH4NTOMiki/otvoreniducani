import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load() {
	/** @type {{data: App.Store[]}} */
	// @ts-ignore
	const { data: stores } = await db.from('stores').select('*, store_days (*)');
    if (stores) {
		//console.log(stores);
		return {stores};
	}

	error(404);
}