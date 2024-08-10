export function POST({ cookies }) {
    cookies.delete('token', { path: '/' });
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}