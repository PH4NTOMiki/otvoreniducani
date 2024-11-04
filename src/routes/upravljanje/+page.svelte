<script>
	import { CirclePlus } from 'lucide-svelte';
    
    import { fade, fly } from 'svelte/transition';
    /**
     * @typedef {Object} Props
     * @property {import('./$types').PageData} data
     */

    /** @type {Props} */
    let { data } = $props();
    let searchTerm = $state('');
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
    <h2 class="text-4xl font-extrabold text-center mb-8 text-base-content">
        Najbliži <span class="italic text-primary">otvoreni</span> dućani
    </h2>

    <div class="mb-6 flex items-center space-x-4">
        <input 
            bind:value={searchTerm}
            type="text" 
            placeholder="Pretraži dućane..." 
            class="input input-bordered input-primary w-full max-w-xs"
        />
        {#if data.user.role === 'admin'}
            <a href="/upravljanje/ducan/dodaj" class="btn btn-primary inline-flex items-center"><CirclePlus class="mr-1" size={18} />Dodaj dućan</a>
        {/if}
    </div>

    <div class="overflow-x-auto shadow-2xl rounded-lg bg-base-100">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-base-200">
                    <th class="hidden"></th>
                    <th class="text-lg font-semibold">Dućan</th>
                    <th class="text-lg font-semibold">Lokacija</th>
                </tr>
            </thead>
            <tbody>
                {#each data.stores.filter(store => 
                    store.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    store.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    store.town.toLowerCase().includes(searchTerm.toLowerCase())
                ) as store, index (store.id)}
                    <tr 
                        class="hover:bg-base-200 transition-colors duration-200"
                        in:fade={{delay: 50 * index, duration: 200}}
                        out:fly={{y: 50, duration: 200}}
                    >
                        <td class="hidden">{store.id}</td>
                        <td>
                            <a 
                                href={`/upravljanje/${store.id}`} 
                                class="text-primary hover:text-primary-focus font-medium transition-colors duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                                </svg>
                                {store.title}
                            </a>
                        </td>
                        <td class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            {store.address}, {store.town}
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="2" class="text-center py-4">Nema rezultata za pretragu.</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>