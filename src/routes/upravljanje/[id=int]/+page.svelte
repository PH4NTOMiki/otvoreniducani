<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	
	const inputClass = 'input input-bordered w-32 text-center';
	const dayNames = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
	
	export let data;
	
	let activeTab = 'default';
	let weekdaysGrouped = false;
	
	onMount(() => {
	  console.log(data);
	});
	
	function updateStoreHours(index, type, value) {
	  data.store[type][index] = `${value}:00`;
	  console.log(data);
	}
	
	function openStore(index) {
	  data.store.default_start[index] = '08:00:00';
	  data.store.default_end[index] = '16:00:00';
	  console.log(data);
	}
	
	function closeStore(index) {
	  data.store.default_start[index] = null;
	  data.store.default_end[index] = null;
	  console.log(data);
	}
	
	function toggleWeekdayGroup() {
	  if (weekdaysGrouped) {
		const weekdays = data.store.default_start.slice(0, 5).filter(time => time !== null);
		
		if (weekdays.length === 0) {
		  alert("No weekday hours set. Please set hours for at least one weekday first.");
		  weekdaysGrouped = false;
		  return;
		}
	
		// Find the most common start and end times for weekdays (Monday to Friday)
		const mostCommonStart = findMostCommon(weekdays);
		const mostCommonEnd = findMostCommon(data.store.default_end.slice(0, 5).filter(time => time !== null));
	
		// Set the most common hours for weekdays only
		for (let i = 0; i < 5; i++) {
		  data.store.default_start[i] = mostCommonStart;
		  data.store.default_end[i] = mostCommonEnd;
		}
	  }
	
	  console.log(data);
	}
	
	function findMostCommon(arr) {
	  return arr.sort((a,b) =>
		arr.filter(v => v === a).length - arr.filter(v => v === b).length
	  ).pop();
	}
	
	$: weekdayStart = data.store.default_start[0]?.slice(0, -3) || '';
	$: weekdayEnd = data.store.default_end[0]?.slice(0, -3) || '';

	$: {
		if (weekdaysGrouped) {
			toggleWeekdayGroup();
		}
	}
</script>

<svelte:head>
  <title>{data.store.title}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-8">
	<h2 class="text-4xl font-extrabold text-primary">{data.store.title}</h2>
	<h3 class="mt-2 text-xl text-gray-600">{data.store.address}, {data.store.town}</h3>
  </div>

  <div class="card bg-base-100 shadow-xl">
	<div class="card-body">
	  <div class="tabs tabs-boxed mb-4">
		<button class="tab {activeTab === 'default' ? 'tab-active' : ''}" on:click={() => activeTab = 'default'}>Uobičajeno radno vrijeme</button>
		<button class="tab {activeTab === 'special' ? 'tab-active' : ''}" on:click={() => activeTab = 'special'}>Posebni dani</button>
	  </div>

	  {#if activeTab === 'default'}
		<div class="flex items-center mb-4">
		  <label class="cursor-pointer label">
			<input type="checkbox" class="checkbox checkbox-primary mr-2" bind:checked={weekdaysGrouped} />
			<span class="label-text">Grupiraj radne dane (Pon-Pet)</span> 
		  </label>
		</div>
		<table class="table w-full">
		  <thead>
			<tr>
			  <th>Dan</th>
			  <th>Otvaranje</th>
			  <th>Zatvaranje</th>
			  <th>Akcija</th>
			</tr>
		  </thead>
		  <tbody>
			{#if weekdaysGrouped}
			  <tr>
				<td>Radni dan (Pon-Pet)</td>
				<td>
				  <input 
					type="time" 
					class={inputClass} 
					value={weekdayStart}
					on:change={(ev) => {
					  for (let i = 0; i < 5; i++) {
						updateStoreHours(i, 'default_start', ev.target.value);
					  }
					}}
				  >
				</td>
				<td>
				  <input 
					type="time" 
					class={inputClass} 
					value={weekdayEnd}
					on:change={(ev) => {
					  for (let i = 0; i < 5; i++) {
						updateStoreHours(i, 'default_end', ev.target.value);
					  }
					}}
				  >
				</td>
				<td>
				  {#if !weekdayStart || !weekdayEnd}
					<button class="btn btn-sm btn-primary" on:click={() => {
					  for (let i = 0; i < 5; i++) openStore(i);
					}}>Otvori</button>
				  {:else}
					<button class="btn btn-sm btn-error" on:click={() => {
					  for (let i = 0; i < 5; i++) closeStore(i);
					}}>Zatvori</button>
				  {/if}
				</td>
			  </tr>
			  {#each dayNames.slice(5) as dayName, i}
				<tr>
				  <td>{dayName}</td>
				  <td>
					{#if data.store.default_start[i + 5]}
					  <input 
						type="time" 
						class={inputClass} 
						value={data.store.default_start[i + 5]?.slice(0, -3)}
						on:change={(ev) => updateStoreHours(i + 5, 'default_start', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if data.store.default_end[i + 5]}
					  <input 
						type="time" 
						class={inputClass} 
						value={data.store.default_end[i + 5]?.slice(0, -3)}
						on:change={(ev) => updateStoreHours(i + 5, 'default_end', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if !data.store.default_start[i + 5] || !data.store.default_end[i + 5]}
					  <button class="btn btn-sm btn-primary" on:click={() => openStore(i + 5)}>Otvori</button>
					{:else}
					  <button class="btn btn-sm btn-error" on:click={() => closeStore(i + 5)}>Zatvori</button>
					{/if}
				  </td>
				</tr>
			  {/each}
			{:else}
			  {#each dayNames as dayName, i}
				<tr>
				  <td>{dayName}</td>
				  <td>
					{#if data.store.default_start[i]}
					  <input 
						type="time" 
						class={inputClass} 
						value={data.store.default_start[i]?.slice(0, -3)}
						on:change={(ev) => updateStoreHours(i, 'default_start', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if data.store.default_end[i]}
					  <input 
						type="time" 
						class={inputClass} 
						value={data.store.default_end[i]?.slice(0, -3)}
						on:change={(ev) => updateStoreHours(i, 'default_end', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if !data.store.default_start[i] || !data.store.default_end[i]}
					  <button class="btn btn-sm btn-primary" on:click={() => openStore(i)}>Otvori</button>
					{:else}
					  <button class="btn btn-sm btn-error" on:click={() => closeStore(i)}>Zatvori</button>
					{/if}
				  </td>
				</tr>
			  {/each}
			{/if}
		  </tbody>
		</table>
	  {:else}
		<div class="overflow-x-auto">
		  <table class="table w-full">
			<thead>
			  <tr>
				<th>Datum</th>
				<th>Radno vrijeme</th>
			  </tr>
			</thead>
			<tbody>
			  {#each data.store.store_days as storeDay}
				<tr>
				  <td>{new Date(storeDay.date).toLocaleDateString('hr-HR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
				  <td>
					{#if storeDay.start && storeDay.end}
					  {storeDay.start?.slice(0, -3)} - {storeDay.end?.slice(0, -3)}
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				</tr>
			  {/each}
			</tbody>
		  </table>
		</div>
	  {/if}
	</div>
  </div>
</div>