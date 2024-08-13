import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';
import { fetchCache } from '$lib/db';

export async function handle({ event, resolve }) {
    fetchCache._ = {};
    const token = event.cookies.get('token');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            // @ts-ignore
            event.locals.user = decoded;
        } catch (err) {
            // Token is invalid, clear it
            //event.cookies.delete('token', { path: '/' });
        }
    }
    
    return resolve(event);
}