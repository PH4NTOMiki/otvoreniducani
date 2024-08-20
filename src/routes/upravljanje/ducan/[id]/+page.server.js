import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    // @ts-ignore
    if (!(params.id === 'dodaj' || !isNaN(params.id))) error(404, 'err');
	if (params.id === 'dodaj') return {};
	/** @type {{data: {id: number, default_start: string | null[], default_end: string | null[], distance?: number, current_start?: string, current_end?: string, created_at: string, address: string, town: string, coordinate_x: number, coordinate_y: number, title: string, store_days: {id: number, store_id: number, date: string, start: string | null, end: string | null}[]}}} */
    // @ts-ignore
    const { data: store } = await db.from('stores').select('*, store_days (*)').eq('id', params.id).limit(1).single();
    if (store) {
		return {store};
	}

	error(404, 'Not found');
}