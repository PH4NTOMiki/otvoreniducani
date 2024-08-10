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
<div class="justify-center text-center">
<form on:submit|preventDefault={handleSubmit}>
    <input class="input input-bordered" bind:value={username} placeholder="Username" required>
    <br>
    <input class="input input-bordered" bind:value={password} type="password" placeholder="Password" required>
    <br>
    <button class="btn btn-primary" type="submit">Login</button>
</form>
</div>