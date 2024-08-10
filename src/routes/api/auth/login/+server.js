import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();
    
    // Here you would typically check the username and password against your database
    if (username === 'user' && password === 'password') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        
        // Set the token in a secure, HttpOnly cookie
        cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
            path: '/'
        });

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401
    });
}