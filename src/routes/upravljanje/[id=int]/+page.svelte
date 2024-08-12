<script>
	export let data;
</script>

<svelte:head>
	<title>{data.store.title}</title>
</svelte:head>

<div class="lg:w-4/5 mx-auto">
	<h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">{data.store.title}</h2>
	<h3 class="mt-4 text-lg text-gray-600 md:text-xl lg:text-2xl">{data.store.address}, {data.store.town}</h3>
	<div>
		Ponedjeljak: {data.store.default_start[0]?.slice(0, -3)} - {data.store.default_end[0]?.slice(0, -3)}
		<br>
		Utorak: {data.store.default_start[1]?.slice(0, -3)} - {data.store.default_end[1]?.slice(0, -3)}
		<br>
		Srijeda: {data.store.default_start[2]?.slice(0, -3)} - {data.store.default_end[2]?.slice(0, -3)}
		<br>
		Četvrtak: {data.store.default_start[3]?.slice(0, -3)} - {data.store.default_end[3]?.slice(0, -3)}
		<br>
		Petak: {data.store.default_start[4]?.slice(0, -3)} - {data.store.default_end[4]?.slice(0, -3)}
		<br>
		Subota: {data.store.default_start[5]?.slice(0, -3)} - {data.store.default_end[5]?.slice(0, -3)}
		<br>
		Nedjelja: {data.store.default_start[6]?.slice(0, -3)} - {data.store.default_end[6]?.slice(0, -3)}
	</div>

	<div class="overflow-x-auto">
		<table class="table">
			<tr>
				<th class="hidden"></th>
				<th>Datum</th>
				<th>Razdaljina</th>
			</tr>
			{#each data.store.store_days as storeDay}
				<tr>
					<td class="hidden">{storeDay.id}</td>
					<td>{storeDay.date}</td>
					<td>{storeDay.start?.slice(0, -3)} - {storeDay.end?.slice(0, -3)}</td>
				</tr>
		{/each}
		</table>
	</div>
</div>