<script>
	import { goto, invalidate } from '$app/navigation';
    import { fade } from 'svelte/transition';

    let formData = {
        title: '',
        address: '',
        town: '',
        coordinate_x: '',
        coordinate_y: ''
    };

    let formError = '';
    let formSuccess = false;

    async function handleSubmit() {
        formError = '';
        formSuccess = false;
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
            formSuccess = true;
            formData = {
                title: '',
                address: '',
                town: '',
                coordinate_x: '',
                coordinate_y: ''
            };
            await invalidate('/upravljanje');
            goto(`/upravljanje/${_data.data.id}`);
        } else {
            formError = _data.message || 'Došlo je do greške prilikom slanja podataka.';
        }
    }
</script>

<div class="container mx-auto px-4 py-12 max-w-2xl">
    <h2 class="text-4xl font-extrabold text-center mb-8 text-base-content">
        Dodaj novi <span class="italic text-primary">dućan</span>
    </h2>

    <form method="POST" on:submit|preventDefault={handleSubmit} class="bg-base-200 shadow-xl rounded-lg p-6">
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

        <button type="submit" class="btn btn-primary w-full">Dodaj dućan</button>

        {#if formError}
            <p class="text-error mt-4" in:fade>
                {formError}
            </p>
        {/if}

        {#if formSuccess}
            <p class="text-success mt-4" in:fade>
                Dućan je uspješno dodan!
            </p>
        {/if}
    </form>

    <div class="mt-8 text-center">
        <a href="/" class="btn btn-outline btn-secondary">
            Povratak na popis dućana
        </a>
    </div>
</div>