import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SECRET_KEY } from '$env/static/private';
import { findUserByUsername } from '$lib/user-server';

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();

    const user = await findUserByUsername(username);
    if(!user)return new Response(JSON.stringify({ error: 'No user' }), {headers: { 'Content-Type': 'application/json' }, status: 401});
    if(!(await bcrypt.compare(password, user.password)))return new Response(JSON.stringify({ error: 'Wrong password' }), {headers: { 'Content-Type': 'application/json' }, status: 401});
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

    return new Response(JSON.stringify({token, refreshToken, user }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}