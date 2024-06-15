<script>
// @ts-nocheck
import { onMount } from 'svelte';
import { distance } from '$lib/distance';

/** @type {import('./$types').PageData} */
export let data;
let { stores } = data;

onMount(() => {
    var map = L.map('map').setView([45.8081751, 15.9841489], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    stores.forEach(store => {
        L.marker([store.coordinate_x, store.coordinate_y]).addTo(map).bindPopup(`${store.title}<br>${store.address}<br>${store.town}`);
    });
    
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
        console.log(coords);
        L.marker([coords.latitude,coords.longitude], {icon: L.icon({iconUrl:'https://cdn-icons-png.freepik.com/512/5683/5683273.png',iconSize:[38,48]})}).addTo(map);
        //alert(JSON.stringify({latitude:coords.latitude,longitude:coords.longitude,accuracy:coords.accuracy}));
        //const a = await (await fetch('/api/closest-store', {method:'POST', body: JSON.stringify(coords)})).json();
        //console.log(a);

        stores = stores.map(store => {
            store.distance = distance(store.coordinate_x, store.coordinate_y, coords.latitude, coords.longitude);
            return store;
        }).sort((store1, store2) => (store1.distance - store2.distance));
    }, console.error);
});
</script>

{#if stores.length}
<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        {#each stores as store}
            <tr>
                <td>{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>
                <td>{store.distance ? (store.distance.toFixed(2) + ' km') : ''}</td>
            </tr>
    {/each}
    </table>
    <div id="map" style="height: 500px; width: 100%;"></div>
</div>
{/if}