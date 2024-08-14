import { db } from '$lib/db-server';

/**
 * @param {string} username
 * @returns {Promise<App.Locals["user"]>}
 */
export async function findUserByUsernameWithPassword(username) {
    const { data: user } = await db.from('store_users').select('*').eq('username', username).limit(1).single();
    return user;
}

/**
 * @param {string} username
 */
export async function findUserByUsername(username) {
    const user = await findUserByUsernameWithPassword(username);
    // @ts-ignore
    if(user?.password) delete user.password;
    return user;
}