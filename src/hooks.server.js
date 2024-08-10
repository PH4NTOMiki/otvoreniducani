import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';

export async function handle({ event, resolve }) {
    const token = event.cookies.get('token');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            event.locals.user = decoded;
        } catch (err) {
            // Token is invalid, clear it
            event.cookies.delete('token', { path: '/' });
        }
    }
    
    return resolve(event);
}