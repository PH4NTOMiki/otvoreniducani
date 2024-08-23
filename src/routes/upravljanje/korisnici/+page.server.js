import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    /** @type {{data: App.Locals["user"][]}} */
    // @ts-ignore
    const { data: users } = await db.from('store_users').select('*');
    if (users) {
		return {users};
	}

	error(404, 'Not found');
}