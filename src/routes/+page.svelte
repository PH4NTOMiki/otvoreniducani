<script>
import {db} from '$lib/db';
import { onMount } from 'svelte';
import { distance } from '$lib/distance';
import dayjs from 'dayjs';

/** @type {import('./$types').PageData} */
export let data;
let { stores } = data;
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
});

/** @param {{ target: { value: string; }; }} event */
async function handleDateChange(event) {
    selectedDate = event.target.value;
    //updateStoresAndMap();
}

async function updateStoresAndMap() {
    const response = await fetch(`/api/closest-store?date=${selectedDate}`, {method:'POST', body: JSON.stringify(coords)});
    const _stores = await response.json();

    // Clear existing markers and popups
    map.eachLayer(layer => {
        // @ts-ignore
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    stores = _stores.map((/** @type {{ distance: number; coordinate_x: number; coordinate_y: number; id: number; closed: boolean; }} */ store) => {
        store.distance = distance(coords.latitude, coords.longitude, store.coordinate_x, store.coordinate_y);

        // Query the store_hours table to determine whether the store is open or closed on the selected date
        const selectedDateObj = dayjs(selectedDate);
        return store;
        //const storeHours = await db.from('store_hours').select('open_time, close_time').eq('store_id', store.id).eq('date', selectedDateObj.format('YYYY-MM-DD'));

        if (storeHours.length === 0 || storeHours[0].open_time === null || storeHours[0].close_time === null) {
            store.closed = true;
        } else {
            const currentTime = dayjs();
            const openTime = dayjs(storeHours[0].open_time, 'HH:mm');
            const closeTime = dayjs(storeHours[0].close_time, 'HH:mm');

            if (currentTime.isBefore(openTime) || currentTime.isAfter(closeTime)) {
                store.closed = true;
            } else {
                store.closed = false;
            }
        }

        return store;
    }).sort((a, b) => a.distance - b.distance);

    // Add new markers and popups
    stores.forEach(store => {
        // @ts-ignore
        L.marker([store.coordinate_x, store.coordinate_y]).addTo(map).bindPopup(`${store.title}<br>${store.address}<br>${store.town}<br>${store.closed ? 'Closed' : 'Open'}`);
    });
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