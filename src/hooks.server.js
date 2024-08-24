import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';
import { clearFetchCache } from '$lib/db';
import { findUserByUsername } from '$lib/user-server';
import { user } from '$lib/auth';
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    clearFetchCache();
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
            const tempUser = await findUserByUsername(decoded.username);
            const newToken = jwt.sign(tempUser, SECRET_KEY, { expiresIn: '15m' });
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
            return json({ error: 'Invalid refresh token' }, { status: 401 });
        }
    }
    
    if (event.url.pathname.startsWith('/upravljanje')) {
        if (!event.locals.user) {
            if(event.url.pathname!='/upravljanje/prijava') return Response.redirect(event.url.href.split('/').slice(0,3).join('/') + '/upravljanje/prijava'+(event.url.pathname.length>12?('?to=' + event.url.pathname.slice(12) + event.url.search):''), 302);
        } else {
            if(event.url.pathname=='/upravljanje/prijava') return Response.redirect(event.url.href.split('/').slice(0,3).join('/') + '/upravljanje', 302);
        }
    }

    user.set(event.locals.user ?? null);
    const response = await resolve(event);
    return response;
}