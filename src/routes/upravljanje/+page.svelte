<script>
    import { goto } from '$app/navigation';
	import { logout } from '$lib/auth.js';
    
    export let data;

    async function handleLogout() {
        await logout();
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
        </tr>
        {#each data.stores as store}
            <tr>
                <td class="hidden">{store.id}</td>
                <td><a class="text-red-500" href={`/upravljanje/${store.id}`}>{store.title}</a></td>
                <td>{store.address}</td>
            </tr>
    {/each}
    </table>
</div>