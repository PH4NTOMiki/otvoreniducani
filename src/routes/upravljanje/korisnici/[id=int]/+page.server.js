import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    /** @type {{data: App.Locals["user"]}} */
    // @ts-ignore
    const { data: user } = await db.from('store_users').select('*').eq('id', params.id).limit(1).single();
    if (user) {
		return {user};
	}

	error(404, 'Not found');
}