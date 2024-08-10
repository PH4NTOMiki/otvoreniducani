<script>
    import { goto } from '$app/navigation';
    
    export let data;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        goto('/upravljanje/prijava');
    }
</script>

<h1 class="font-bold">Dobrodošli, {data.user.username}!</h1>
<button class="btn btn-primary" on:click={handleLogout}>Odjavite se</button>

<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        <tr>
            <th class="hidden"></th>
            <th>Najbliži <i>otvoreni</i> dućani</th>
            <th>Adresa</th>
            <th>Radno vrijeme</th>
        </tr>
        {#each data.stores as store}
            <tr>
                <td class="hidden">{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>
                <td>{store.current_start?.slice(0, -3)} - {store.current_end?.slice(0, -3)}</td>
            </tr>
    {/each}
    </table>
</div>