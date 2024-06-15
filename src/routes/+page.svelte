<script>
import { onMount } from 'svelte';

/** @type {import('./$types').PageData} */
export let data;

onMount(() => {
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
        console.log(coords);
        alert(JSON.stringify({latitude:coords.latitude,longitude:coords.longitude,accuracy:coords.accuracy}));
        //const a = await (await fetch('/api/closest-store', {method:'POST', body: JSON.stringify(coords)})).json();
        //console.log(a);
    }, console.error);
});
</script>

<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        {#each data.stores as store}
            <tr>
                <td>{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>

            </tr>
    {/each}
    </table>
</div>