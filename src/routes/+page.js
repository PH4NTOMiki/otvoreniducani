import {db} from '$lib/db';
import {error} from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load() {
	/** @type {{data: {id: number, default_start: string | null[], default_end: string | null[], distance?: number, closed?: boolean, created_at: string, address: string, town: string, coordinate_x: number, coordinate_y: number, title: string, store_days: {id: number, store_id: number, date: string, start: string | null, end: string | null}[]}[]}} */
	// @ts-ignore
	const { data: originalStores } = await db.from('stores').select('*, store_days (*)');
    if (originalStores) {
		console.log(originalStores);
		return {originalStores};
	}

	error(404);
}