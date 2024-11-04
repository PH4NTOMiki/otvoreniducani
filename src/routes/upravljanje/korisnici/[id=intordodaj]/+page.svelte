<script>
    import { preventDefault } from 'svelte/legacy';

    // @ts-nocheck
    
    import { goto } from '$app/navigation';
    import { User, Mail, Shield, Store, Save, Trash2, ArrowLeft, Plus, X, Lock } from 'lucide-svelte';
    /**
     * @typedef {Object} Props
     * @property {import('./$types').PageData} data
     */

    /** @type {Props} */
    let { data } = $props();

    let userEdit = $state(data.userEdit ? { ...data.userEdit, stores_owned: [...data.userEdit.stores_owned] } : { username: '', email: '', role: 'user', stores_owned: [] });
    let isLoading = $state(false);
    let errorMessage = $state('');
    let newStore = $state('');
    let isAddMode = !data.userEdit;
    let newPassword = $state('');
    let confirmPassword = $state('');

    function addStore() {
        if (newStore && !userEdit.stores_owned.includes(newStore)) {
            userEdit.stores_owned = [...userEdit.stores_owned, newStore];
            newStore = '';
        }
    }

    /**
     * @param {string} store
     */
    function removeStore(store) {
        userEdit.stores_owned = userEdit.stores_owned.filter(s => s !== store);
    }

    async function saveUser() {
        isLoading = true;
        errorMessage = '';

        if (newPassword !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            isLoading = false;
            return;
        }

        try {
            const userData = {
                ...userEdit,
                password: newPassword || undefined // Only include password if it's been changed
            };

            const response = await fetch('/api/edit-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(isAddMode ? 'Failed to add user' : 'Failed to update user');
            }

            goto('/upravljanje/korisnici');
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
            const response = await fetch('/api/edit-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: userEdit.id, delete: true})
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            goto('/upravljanje/korisnici');
        } catch (error) {
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
                {isAddMode ? 'Dodaj novog korisnika' : `Uredi korisnika: ${userEdit.username}`}
            </h2>

            <form onsubmit={preventDefault(saveUser)} class="space-y-6">
                <div class="form-control">
                    <label for="username" class="label">
                        <span class="label-text flex items-center">
                            <User class="mr-2" size={18} />
                            Korisničko ime
                        </span>
                    </label>
                    <input id="username" bind:value={userEdit.username} class="input input-bordered w-full" required />
                </div>

                <div class="form-control">
                    <label for="email" class="label">
                        <span class="label-text flex items-center">
                            <Mail class="mr-2" size={18} />
                            Email
                        </span>
                    </label>
                    <input id="email" type="email" bind:value={userEdit.email} class="input input-bordered w-full" required />
                </div>

                <div class="form-control">
                    <label for="new-password" class="label">
                        <span class="label-text flex items-center">
                            <Lock class="mr-2" size={18} />
                            {isAddMode ? 'Lozinka' : 'Nova lozinka (ostavite prazno ako ne želite promijeniti)'}
                        </span>
                    </label>
                    <input id="new-password" type="password" bind:value={newPassword} class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label for="confirm-password" class="label">
                        <span class="label-text flex items-center">
                            <Lock class="mr-2" size={18} />
                            Potvrdite lozinku
                        </span>
                    </label>
                    <input id="confirm-password" type="password" bind:value={confirmPassword} class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label for="role" class="label">
                        <span class="label-text flex items-center">
                            <Shield class="mr-2" size={18} />
                            Uloga
                        </span>
                    </label>
                    <select id="role" bind:value={userEdit.role} class="select select-bordered w-full">
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
                        {#each userEdit.stores_owned as store}
                            <div class="badge badge-primary badge-lg gap-2">
                                {store}
                                <button type="button" class="btn btn-ghost btn-xs" onclick={() => removeStore(store)}>
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
                        <button type="button" class="btn btn-primary" onclick={addStore}>
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
                    {#if !isAddMode}
                        <button type="button" onclick={deleteUser} class="btn btn-error" disabled={isLoading}>
                            <Trash2 class="mr-2" size={18} />
                            Izbriši korisnika
                        </button>
                    {:else}
                        <div></div>
                    {/if}
                    <div class="space-x-2">
                        <a href="/upravljanje/korisnici" class="btn btn-ghost">
                            <ArrowLeft class="mr-2" size={18} />
                            Nazad
                        </a>
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            <Save class="mr-2" size={18} />
                            {isLoading ? 'Spremanje...' : (isAddMode ? 'Dodaj' : 'Spremi')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>