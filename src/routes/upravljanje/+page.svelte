<script>
    export let data;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/upravljanje/prijava';
    }
</script>

<h1>Welcome, {data.user.username}!</h1>
<button on:click={handleLogout}>Logout</button>