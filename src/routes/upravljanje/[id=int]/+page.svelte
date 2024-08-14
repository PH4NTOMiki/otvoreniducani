<script>
// @ts-nocheck

	const inputClass = 'input input-bordered';
	const dayNames = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
	
	export let data;
</script>

<svelte:head>
	<title>{data.store.title}</title>
</svelte:head>

<div class="lg:w-4/5 mx-auto">
	<h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">{data.store.title}</h2>
	<h3 class="mt-4 text-lg text-gray-600 md:text-xl lg:text-2xl">{data.store.address}, {data.store.town}</h3>
	<table>
		{#each dayNames as dayName, i}
			<tr>
				<td>{dayName}: &nbsp;&nbsp;</td>
				<td>
					{#if data.store.default_start[i]}
						<input on:change={ev=>{data.store.default_start[i] = `${ev.target.value}:00`;console.log(data);}} type="time" class={inputClass} value={data.store.default_start[i]?.slice(0, -3)}>
						 - 
						<input on:change={ev=>{data.store.default_end[i] = `${ev.target.value}:00`;console.log(data);}} type="time" class={inputClass} value={data.store.default_end[i]?.slice(0, -3)}>
					{:else}
						Zatvoreno
					{/if}
				</td>
			</tr>
		{/each}
	</table>

	<div class="overflow-x-auto">
		<table class="table">
			<tr>
				<th class="hidden"></th>
				<th>Datum</th>
				<th>Radno vrijeme</th>
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