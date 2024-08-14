<script>
    export let data;
</script>


<div class="overflow-x-auto">
    <table class="table mx-auto lg:w-4/5">
        <tr>
            <th class="hidden"></th>
            <th>Najbliži <i>otvoreni</i> dućani</th>
            <th>Adresa</th>
        </tr>
        {#each data.stores as store}
            <tr>
                <td class="hidden">{store.id}</td>
                <td><a class="text-red-500" href={`/upravljanje/${store.id}`}>{store.title}</a></td>
                <td>{store.address}</td>
            </tr>
    {/each}
    </table>
</div>