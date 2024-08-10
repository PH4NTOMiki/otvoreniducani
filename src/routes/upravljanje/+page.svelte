<script>
    export let data;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/upravljanje/prijava';
    }
</script>

<h1 class="font-bold">Dobrodošli, {data.user.username}!</h1>
<button class="btn btn-primary" on:click={handleLogout}>Odjavite se</button>