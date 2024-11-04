<script>
    import { preventDefault } from 'svelte/legacy';

    import { goto, invalidate } from '$app/navigation';
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let { data } = $props();

    let formData = $state({
        id: null,
        title: '',
        address: '',
        town: '',
        coordinate_x: '',
        coordinate_y: ''
    });

    // If provided, we're in edit mode
    // @ts-ignore
    if(data.store?.id) formData = data.store;

    let formError = $state('');
    let formSuccess = $state('');
    let isDeleteModalOpen = $state($page.url.hash === '#izbrisi');

    onMount(() => {
        // now using $page.url.hash instead of location.hash when setting isDeleteModalOpen
        //if (location.hash === '#izbrisi') isDeleteModalOpen = true;
    });

    async function handleSubmit() {
        formError = '';
        formSuccess = '';
        if (!formData.title || !formData.address || !formData.town || !formData.coordinate_x || !formData.coordinate_y) {
            formError = 'Molimo popunite sva polja.';
            return;
        }
        // Validacija koordinata
        const coordinateRegex = /^-?\d+(\.\d+)?$/;
        if (!coordinateRegex.test(formData.coordinate_x) || !coordinateRegex.test(formData.coordinate_y)) {
            formError = 'Koordinate moraju biti brojevne vrijednosti.';
            return;
        }

        const response = await fetch('/api/edit-store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const _data = await response.json();
        if (response.ok) {
            formSuccess = data.store?.id ? 'Dućan je uspješno ažuriran!' : 'Dućan je uspješno dodan!';
            await invalidate('/upravljanje');
            if (!data.store?.id) {
                goto(`/upravljanje/${_data.data.id}`);
            }
        } else {
            formError = _data.message || 'Došlo je do greške prilikom slanja podataka.';
        }
    }

    async function handleDelete() {
        const response = await fetch('/api/edit-store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.store?.id,
                delete: true
            })
        });
        if (response.ok) {
            await invalidate('/upravljanje');
            goto('/upravljanje');
        } else {
            formError = 'Došlo je do greške prilikom brisanja dućana.';
        }
        isDeleteModalOpen = false;
    }

    function closeDeleteModal() {
        if (location.hash === '#izbrisi') history.replaceState(history.state, document.title, location.href.split('#')[0]);
        isDeleteModalOpen = false;
    }
</script>

<div class="container mx-auto px-4 py-12 max-w-2xl">
    <h2 class="text-4xl font-extrabold text-center mb-8 text-base-content">
        {data.store?.id ? 'Uredi' : 'Dodaj novi'} <span class="italic text-primary">dućan</span>
    </h2>

    <form method="POST" onsubmit={preventDefault(handleSubmit)} class="bg-base-200 shadow-xl rounded-lg p-6">
        <div class="form-control w-full mb-4">
            <label for="title" class="label">
                <span class="label-text">Naziv dućana</span>
            </label>
            <input
                id="title"
                bind:value={formData.title}
                type="text"
                placeholder="Unesite naziv dućana"
                class="input input-bordered input-primary w-full"
                required
            />
        </div>

        <div class="form-control w-full mb-4">
            <label for="address" class="label">
                <span class="label-text">Adresa</span>
            </label>
            <input
                id="address"
                bind:value={formData.address}
                type="text"
                placeholder="Unesite adresu dućana"
                class="input input-bordered input-primary w-full"
                required
            />
        </div>

        <div class="form-control w-full mb-6">
            <label for="town" class="label">
                <span class="label-text">Grad</span>
            </label>
            <input
                id="town"
                bind:value={formData.town}
                type="text"
                placeholder="Unesite grad"
                class="input input-bordered input-primary w-full"
                required
            />
        </div>

        <div class="form-control w-full mb-4">
            <label for="coordinate_x" class="label">
                <span class="label-text">X Koordinata</span>
            </label>
            <input
                id="coordinate_x"
                bind:value={formData.coordinate_x}
                type="number"
                placeholder="Unesite X koordinatu"
                class="input input-bordered input-primary w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
            />
        </div>

        <div class="form-control w-full mb-4">
            <label for="coordinate_y" class="label">
                <span class="label-text">Y Koordinata</span>
            </label>
            <input
                id="coordinate_y"
                bind:value={formData.coordinate_y}
                type="number"
                placeholder="Unesite Y koordinatu"
                class="input input-bordered input-primary w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
            />
        </div>

        <button type="submit" class="btn btn-primary w-full">
            {data.store?.id ? 'Ažuriraj dućan' : 'Dodaj dućan'}
        </button>

        {#if data.store?.id}
            <button type="button" class="btn btn-error w-full mt-4" onclick={() => isDeleteModalOpen = true}>
                Obriši dućan
            </button>
        {/if}

        {#if formError}
            <p class="text-error mt-4" in:fade>
                {formError}
            </p>
        {/if}

        {#if formSuccess}
            <p class="text-success mt-4" in:fade>
                {formSuccess}
            </p>
        {/if}
    </form>

    <div class="mt-8 text-center">
        <a href="/upravljanje" class="btn btn-outline btn-secondary">
            Povratak na popis dućana
        </a>
    </div>
</div>

{#if isDeleteModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-base-100 p-6 rounded-lg">
            <h3 class="text-lg font-bold mb-4">Jeste li sigurni da želite obrisati ovaj dućan?</h3>
            <div class="flex justify-end">
                <button class="btn btn-outline mr-2" onclick={closeDeleteModal}>Odustani</button>
                <button class="btn btn-error" onclick={handleDelete}>Obriši</button>
            </div>
        </div>
    </div>
{/if}