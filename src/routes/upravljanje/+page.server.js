import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { data: stores } = await db.from('stores').select('*, store_days (*)').in('id', locals.user.stores_owned);
    if (stores) {
		return {stores};
	}

	error(404, 'Not found');
}