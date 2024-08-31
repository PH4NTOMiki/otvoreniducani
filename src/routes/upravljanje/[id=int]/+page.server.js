import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	console.log('role', locals.user.role);
	if(!locals.user.stores_owned.includes(parseInt(params.id)) && locals.user.role !== 'admin') error(401, 'Unauthorized');
	/** @type {{data: App.Store}} */
    // @ts-ignore
    const { data: store } = await db.from('stores').select('*, store_days (*)').eq('id', params.id).limit(1).single();
    if (store) {
		return {store};
	}

	error(404, 'Not found');
}