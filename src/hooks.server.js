import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';
import { fetchCache } from '$lib/db';
import { findUserByUsername } from '$lib/user-server';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    fetchCache._ = {};
    const token = event.cookies.get('token');
    const refreshToken = event.cookies.get('refreshToken');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            // @ts-ignore
            event.locals.user = decoded;
        } catch (err) {
            // Token is invalid, clear it
            //event.cookies.delete('token', { path: '/' });
        }
    } else if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, SECRET_KEY);
            // @ts-ignore
            const user = await findUserByUsername(decoded.username);
            // @ts-ignore
            delete user.password;
            const newToken = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
            event.locals.user = JSON.parse(Buffer.from(newToken.split('.')[1], 'base64').toString());
    
            event.cookies.set('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60, // 15 minutes
                path: '/'
            });
        } catch (error) {
            event.cookies.delete('refreshToken', { path: '/' });
            return new Response(JSON.stringify({ error: 'Invalid refresh token' }), {
                status: 401
            });
        }
    }
    
    return resolve(event);
}