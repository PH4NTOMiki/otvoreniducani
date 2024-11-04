<script>
import {db} from '$lib/db';
import { onMount } from 'svelte';
import { distance } from '$lib/distance';

let mounted = false;
/** @type {GeolocationCoordinates?} */
// @ts-ignore
let coords = $state();
let selectedDate = new Date().toISOString().split('T')[0]; // default to today's date
/** @type {L.Map} */
let map;
/** @type {L.LayerGroup} */
let mapLayerGroup;

    /**
     * @typedef {Object} Props
     * @property {import('./$types').PageData} data
     */

    /** @type {Props} */
    let { data } = $props();
let { stores } = $state(data);
/** @type {typeof stores} */
let originalStores = JSON.parse(JSON.stringify(stores));
// @ts-ignore
let storesToShow = $derived(stores.map(store => {if(coords?.latitude){store.distance = distance(coords.latitude, coords.longitude, store.coordinate_x, store.coordinate_y)};return store;}).sort((a, b) => a.distance - b.distance));

onMount(() => {
    // @ts-ignore
    window.db = db;
    // @ts-ignore
    window.map = map = L.map('map').setView([45.8081751, 15.9841489], 12);
    // @ts-ignore
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'}).addTo(map);
    // @ts-ignore
    mapLayerGroup = L.layerGroup().addTo(map);
    navigator.geolocation.getCurrentPosition((_c) => {
        coords = _c.coords;
        // @ts-ignore
        L.marker([coords.latitude, coords.longitude], {icon: L.divIcon({className:'', html: '<svg height="50" width="50" xmlns="http://www.w3.org/2000/svg"><circle r="14" cx="25" cy="25" fill="#7272da" stroke="#52529f" stroke-width="7" /></svg>'})}).addTo(map);
        map.panTo([coords.latitude, coords.longitude]);
        //updateStoresAndMap();
    }, console.error, {enableHighAccuracy: true});
    mounted = true;
    changeDate();
});

// @ts-ignore
function handleDateChange(event) {
    selectedDate = event.target.value;
    changeDate();
}

function changeDate() {
    const dayOfWeek = (new Date(selectedDate).getDay() + 6) % 7;
    //console.log(dayOfWeek);
    /** @type {typeof stores} */
    const tempStores = JSON.parse(JSON.stringify(originalStores));
    stores = tempStores.filter(store => {
        const storeOpen = store.store_days.some(storeDate => {
            return storeDate.date === selectedDate
        }) || store.default_start[dayOfWeek];
        //console.log(storeOpen);
        return storeOpen;
    }).map(store => {
        const storeDay = store.store_days.find(storeDate => {
            return storeDate.date === selectedDate
        });
        if(storeDay){
            // @ts-ignore
            store.current_start = storeDay.start;
            //console.log('store.current_start', store.current_start);
            // @ts-ignore
            store.current_end = storeDay.end;
            //console.log('store.current_end', store.current_end);
        } else {
            // @ts-ignore
            store.current_start = store.default_start[dayOfWeek];
            //console.log('store.current_start', store.current_start);
            // @ts-ignore
            store.current_end = store.default_end[dayOfWeek];
            //console.log('store.current_end', store.current_end);
        }
        return store;
    });
    
    if (mounted) {
        mapLayerGroup.clearLayers();
        stores.forEach(store => {
            // @ts-ignore
            L.marker([store.coordinate_x, store.coordinate_y]).addTo(mapLayerGroup).bindPopup(`${store.title}<br>${store.address}<br>${store.town}<br>Radno vrijeme: <br>${store.current_start?.slice(0, -3)} - ${store.current_end?.slice(0, -3)}`);
        });
    }
}

changeDate();
</script>

<label class="input input-bordered input-error flex items-center gap-2 w-[208px]">
    Datum
    <input type="date" class="grow" value={new Date().toISOString().split('T')[0]} onchange={handleDateChange}>
</label>

<div class="overflow-x-auto">
    <div id="map" style="height: 500px; width: 100%;"></div>
    <table class="table mx-auto lg:w-4/5"><tbody>
        <tr>
            <th class="hidden"></th>
            <th>Najbliži <i>otvoreni</i> dućani</th>
            <th>Adresa</th>
            <th>Razdaljina</th>
            <th>Radno vrijeme</th>
        </tr>
        {#each storesToShow as store}
            <tr>
                <td class="hidden">{store.id}</td>
                <td>{store.title}</td>
                <td>{store.address}</td>
                <td>{store.distance ? (store.distance.toFixed(2) + ' km') : ''}</td>
                <td>{store.current_start?.slice(0, -3)} - {store.current_end?.slice(0, -3)}</td>
            </tr>
    {/each}
    </tbody></table>
</div>
