import { db } from '$lib/db-server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if (locals.user.role !== 'admin') error(401, 'Unauthorized');
  if (params.id === 'dodaj') return {};
    
  /** @type {{data: App.Locals["user"]}} */
  // @ts-ignore
  const { data: userEdit } = await db.from('store_users').select('*').eq('id', params.id).limit(1).single();
  if (userEdit) {
    // @ts-ignore
    delete userEdit.password;
    return {userEdit};
	}

	error(404, 'Not found');
}