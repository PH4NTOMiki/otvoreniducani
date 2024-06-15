<script>
import { onMount } from 'svelte';
import { distance } from '$lib/distance';

/** @type {import('./$types').PageData} */
export let data;
let { stores } = data;

onMount(() => {
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
        console.log(coords);
        //alert(JSON.stringify({latitude:coords.latitude,longitude:coords.longitude,accuracy:coords.accuracy}));
        //const a = await (await fetch('/api/closest-store', {method:'POST', body: JSON.stringify(coords)})).json();
        //console.log(a);

        stores = stores.map(store => {
            store.distance = distance(store.coordinate_x, store.coordinate_y, coords.latitude, coords.longitude);
        // @ts-ignore
        }).sort((store1, store2) => (store1.distance - store2.distance));
    }, console.error);
});
</script>

<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        {#each stores as store}
            <tr>
                <td>{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>
                <td>{store.distance || ''}</td>
            </tr>
    {/each}
    </table>
</div>