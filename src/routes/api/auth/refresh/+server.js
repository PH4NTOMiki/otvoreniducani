import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';
import { findUserByUsername } from '$lib/user-server';
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    const refreshToken = cookies.get('refreshToken');

    if (!refreshToken) {
        return json({ error: 'No refresh token' }, {status: 401});
    }

    try {
        const decoded = jwt.verify(refreshToken, SECRET_KEY);
        // @ts-ignore
        const user = await findUserByUsername(decoded.username);
        const newToken = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });

        cookies.set('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes
            path: '/'
        });

        return json({ user: JSON.parse(Buffer.from(newToken.split('.')[1], 'base64').toString()) });
    } catch (error) {
        cookies.delete('token', { path: '/' });
        cookies.delete('refreshToken', { path: '/' });
        return json({ error: 'Invalid refresh token' }, {status: 401});
    }
}