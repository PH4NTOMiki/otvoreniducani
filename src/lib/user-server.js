import { db } from '$lib/db-server';

/**
 * @param {string} username
 * @returns {Promise<App.Locals["user"]>}
 */
export async function findUserByUsername(username) {
    const { data: user } = await db.from('store_users').select('*').eq('username', username).limit(1).single();
    return user;
}