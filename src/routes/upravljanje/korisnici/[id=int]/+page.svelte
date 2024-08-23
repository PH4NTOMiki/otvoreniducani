<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import { goto } from '$app/navigation';
    import { User, Mail, Shield, Store, Save, Trash2, ArrowLeft, Plus, X } from 'lucide-svelte';

    let user = { ...data.user, stores_owned: [...data.user.stores_owned] };
    let isLoading = false;
    let errorMessage = '';
    let newStore = '';

    function addStore() {
        // @ts-ignore
        if (newStore && !user.stores_owned.includes(newStore)) {
            // @ts-ignore
            user.stores_owned = [...user.stores_owned, newStore];
            newStore = '';
        }
    }

    /**
	 * @param {number} store
	 */
    function removeStore(store) {
        user.stores_owned = user.stores_owned.filter(s => s !== store);
    }

    async function saveUser() {
        isLoading = true;
        errorMessage = '';

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            goto('/admin/users');
        } catch (error) {
            // @ts-ignore
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    async function deleteUser() {
        if (!confirm('Sigurno želite izbrisati korisnika?')) return;

        isLoading = true;
        errorMessage = '';

        try {
            const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            goto('/admin/users');
        } catch (error) {
            // @ts-ignore
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="min-h-screen bg-base-200 py-12">
    <div class="container mx-auto px-4 max-w-2xl">
        <div class="bg-base-100 shadow-xl rounded-box p-8">
            <h2 class="text-3xl font-bold text-primary mb-8 flex items-center">
                <User class="mr-4" size={32} />
                Uredi korisnika: {user.username}
            </h2>

            <form on:submit|preventDefault={saveUser} class="space-y-6">
                <div class="form-control">
                    <label for="username" class="label">
                        <span class="label-text flex items-center">
                            <User class="mr-2" size={18} />
                            Korisničko ime
                        </span>
                    </label>
                    <input id="username" bind:value={user.username} class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label for="email" class="label">
                        <span class="label-text flex items-center">
                            <Mail class="mr-2" size={18} />
                            Email
                        </span>
                    </label>
                    <input id="email" type="email" bind:value={user.email} class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label for="role" class="label">
                        <span class="label-text flex items-center">
                            <Shield class="mr-2" size={18} />
                            Uloga
                        </span>
                    </label>
                    <select id="role" bind:value={user.role} class="select select-bordered w-full">
                        <option value="user">Korisnik</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label" for="new-store">
                        <span class="label-text flex items-center">
                            <Store class="mr-2" size={18} />
                            Dućani
                        </span>
                    </label>
                    <div class="flex flex-wrap gap-2 mb-2">
                        {#each user.stores_owned as store}
                            <div class="badge badge-primary badge-lg gap-2">
                                {store}
                                <button type="button" class="btn btn-ghost btn-xs" on:click={() => removeStore(store)}>
                                    <X size={14} />
                                </button>
                            </div>
                        {/each}
                    </div>
                    <div class="input-group">
                        <input 
                            type="text" 
                            id="new-store" 
                            bind:value={newStore} 
                            placeholder="Dodaj dućan..." 
                            class="input input-bordered flex-grow"
                        />
                        <button type="button" class="btn btn-primary" on:click={addStore}>
                            <Plus size={18} />
                            Dodaj
                        </button>
                    </div>
                </div>

                {#if errorMessage}
                    <div class="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{errorMessage}</span>
                    </div>
                {/if}

                <div class="flex justify-between items-center pt-4">
                    <button type="button" on:click={deleteUser} class="btn btn-error" disabled={isLoading}>
                        <Trash2 class="mr-2" size={18} />
                        Izbriši korisnika
                    </button>
                    <div class="space-x-2">
                        <a href="/upravljanje/korisnici" class="btn btn-ghost">
                            <ArrowLeft class="mr-2" size={18} />
                            Nazad
                        </a>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            <Save class="mr-2" size={18} />
                            {isLoading ? 'Spremanje...' : 'Spremi'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>