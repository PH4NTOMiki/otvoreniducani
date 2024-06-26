import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load() {
	/** @type {{data: {id: number, distance?: number, closed?: boolean, created_at: string, address: string, town: string, coordinate_x: number, coordinate_y: number, title: string, store_days: {id: number, store_id: number, date: string, start: string, end: string}[]}[]}} */
	// @ts-ignore
	const { data: stores } = await db.from('stores').select('*, store_days (*)');
    if (stores) {
		console.log(stores);
		return {originalStores: stores, stores: [...stores]};
	}

	error(404);
}