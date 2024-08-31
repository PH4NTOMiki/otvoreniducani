import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	let query = db.from('stores').select('*, store_days (*)');
	if (locals.user.role !== 'admin') query = query.in('id', locals.user.stores_owned);
	
	/** @type {{data: App.Store[]}} */
    // @ts-ignore
    const { data: stores } = await query;
    if (stores) {
		return {stores};
	}

	error(404, 'Not found');
}