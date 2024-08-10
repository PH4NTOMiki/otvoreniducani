<script>
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';

    async function handleSubmit() {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
            goto('/upravljanje');
        } else {
            alert('Login failed');
        }
    }
</script>
<svelte:head>
    <title>Upravljanje - Prijava</title>
</svelte:head>
<form on:submit|preventDefault={handleSubmit}>
    <input bind:value={username} placeholder="Username" required>
    <input bind:value={password} type="password" placeholder="Password" required>
    <button type="submit">Login</button>
</form>