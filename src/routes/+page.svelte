<script>
import {db} from '$lib/db';
import { onMount } from 'svelte';
import { distance } from '$lib/distance';
import dayjs from 'dayjs';

/** @type {import('./$types').PageData} */
export let data;
let { originalStores, stores } = data;
let selectedDate = new Date().toISOString().split('T')[0]; // default to today's date
/** @type {GeolocationCoordinates} */
let coords;
/** @type {L.Map} */
let map;

onMount(() => {
    // @ts-ignore
    window.db = db;
    // @ts-ignore
    map = L.map('map').setView([45.8081751, 15.9841489], 12);
    // @ts-ignore
    window.map = map;
    // @ts-ignore
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'}).addTo(map);
    navigator.geolocation.getCurrentPosition(async ({coords: userCoords}) => {
        coords = userCoords;
        // @ts-ignore
        L.marker([userCoords.latitude, userCoords.longitude], {icon: L.divIcon({className:'', html: '<svg height="50" width="50" xmlns="http://www.w3.org/2000/svg"><circle r="14" cx="25" cy="25" fill="#7272da" stroke="#52529f" stroke-width="7" /></svg>'})}).addTo(map);
        map.panTo([userCoords.latitude, userCoords.longitude]);
        //updateStoresAndMap();
    }, console.error);
    changeDate();
});

/** @param {{ target: { value: string; }; }} event */
function handleDateChange(event) {
    selectedDate = event.target.value;
    changeDate();
}

function changeDate() {console.log('selectedDate', selectedDate);
    stores = [...originalStores].filter(store => {
        return store.store_days.some(storeDate => {
            return storeDate.date === selectedDate
        });
    }).map(store => {
        store.distance = distance(coords.latitude, coords.longitude, store.coordinate_x, store.coordinate_y);
        return store;
    // @ts-ignore
    }).sort((a, b) => a.distance - b.distance);
}

</script>

<input type="date" value={selectedDate} on:change={handleDateChange}>

{#if stores.length}
<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        {#each stores as store}
            <tr>
                <td>{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>
                <td>{store.distance ? (store.distance.toFixed(2) + ' km') : ''}</td>
                <td>{store.closed ? 'Closed' : 'Open'}</td>
            </tr>
    {/each}
    </table>
    <div id="map" style="height: 500px; width: 100%;"></div>
</div>
{/if}