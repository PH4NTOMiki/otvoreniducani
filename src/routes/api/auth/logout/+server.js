import { json } from '@sveltejs/kit';

export function POST({ cookies }) {
    cookies.delete('token', { path: '/' });
    cookies.delete('refreshToken', { path: '/' });
    return json({ success: true });
}