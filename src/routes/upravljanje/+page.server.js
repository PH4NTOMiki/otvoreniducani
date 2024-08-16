import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	let query = db.from('stores').select('*, store_days (*)');
	if (locals.user.role !== 'admin') query = query.in('id', locals.user.stores_owned);
	
	/** @type {{data: {id: number, default_start: string | null[], default_end: string | null[], distance?: number, current_start?: string, current_end?: string, created_at: string, address: string, town: string, coordinate_x: number, coordinate_y: number, title: string, store_days: {id: number, store_id: number, date: string, start: string | null, end: string | null}[]}[]}} */
    // @ts-ignore
    const { data: stores } = await query;
    if (stores) {
		return {stores};
	}

	error(404, 'Not found');
}