import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    if (params.id === 'dodaj') return {};
	/** @type {{data: App.Store}} */
    // @ts-ignore
    const { data: store } = await db.from('stores').select('*, store_days (*)').eq('id', params.id).limit(1).single();
    if (store) {
		return {store};
	}

	error(404, 'Not found');
}