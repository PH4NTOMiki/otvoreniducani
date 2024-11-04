<script>
    
    import { fade, fly } from 'svelte/transition';
    import { Users, Search, UserPlus } from 'lucide-svelte';
    /**
     * @typedef {Object} Props
     * @property {import('./$types').PageData} data
     */

    /** @type {Props} */
    let { data } = $props();
    
    let searchTerm = $state('');

    let filteredUsers = $derived(data.users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ));
</script>

<div class="min-h-screen bg-base-200 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
        <div class="bg-base-100 shadow-xl rounded-box p-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-4xl font-extrabold text-primary flex items-center">
                    <Users class="mr-4" size={36} />
                    Upravljanje korisnicima
                </h2>
                <a href="/admin/users/new" class="btn btn-primary">
                    <UserPlus class="mr-2" size={20} />
                    Dodaj novog korisnika
                </a>
            </div>

            <div class="form-control mb-6">
                <div class="input-group">
                    <input 
                        bind:value={searchTerm}
                        type="text" 
                        placeholder="Pretraži korisnike..." 
                        class="input input-bordered flex-grow"
                    />
                    <button class="btn btn-square">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th class="bg-base-200">Korisničko ime</th>
                            <th class="bg-base-200">Email</th>
                            <th class="bg-base-200">Uloga</th>
                            <th class="bg-base-200">Dućani</th>
                            <th class="bg-base-200">Radnje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each filteredUsers as user, index (user.id)}
                            <tr 
                                class="hover:bg-base-200 transition-all duration-200"
                                in:fade={{delay: 50 * index, duration: 200}}
                                out:fly={{y: 50, duration: 200}}
                            >
                                <td class="font-medium">{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span class="badge {user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}">
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.stores_owned.length}</td>
                                <td>
                                    <a 
                                        href={`/upravljanje/korisnici/${user.id}`}
                                        class="btn btn-sm btn-outline btn-primary"
                                    >
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="5" class="text-center py-4">Nema korisnika sa traženim parametrima.</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>