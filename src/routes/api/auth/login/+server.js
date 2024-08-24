import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SECRET_KEY } from '$env/static/private';
import { findUserByUsernameWithPassword } from '$lib/user-server';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();

    const user = await findUserByUsernameWithPassword(username);
    if(!user)return json({ error: 'No user' }, {status: 401});
    // @ts-ignore
    if(!(await bcrypt.compare(password, user.password)))return json({ error: 'Wrong password' }, {status: 401});
    // @ts-ignore
    delete user.password;
    
    
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });
    
    cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
    });

    cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
    });

    return json({user: JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())})
}