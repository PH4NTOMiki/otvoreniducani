<script>
	import { run } from 'svelte/legacy';

	// @ts-nocheck
	import { goto, invalidate } from '$app/navigation';
	import { Edit, Trash } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	
	const inputClass = 'input input-bordered w-36 text-center';
	const dayNames = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
	
	let { data = $bindable() } = $props();
	
	let activeTab = $state('default');
	let weekdaysGrouped = $state(false);
	let specialDays = writable(data.store.store_days);
	let newSpecialDay = $state({ date: '', start: '', end: '' });
	let editingSpecialDay = $state(null);
	let originalData;
	let isDeleteModalOpen = $state(false);
	
	onMount(() => {
	  //console.log(data);
	  originalData = JSON.parse(JSON.stringify(data));
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
	
		const mostCommonStart = findMostCommon(weekdays);
		const mostCommonEnd = findMostCommon(data.store.default_end.slice(0, 5).filter(time => time !== null));
	
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
	
	async function addSpecialDay() {
	  if (!newSpecialDay.date || !newSpecialDay.start || !newSpecialDay.end) {
		alert('Please fill in all fields for the new special day.');
		return;
	  }

	  const response = await fetch('/api/add-edit-special-day', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...newSpecialDay, start: `${newSpecialDay.start}:00`, end: `${newSpecialDay.end}:00`, store_id: data.store.id }),
	  });
	  if (response.ok) {
		const result = await response.json();
		specialDays.update(days => [...days, result.data]);
		newSpecialDay = { date: '', start: '', end: '' };
	  } else {
		console.error('Failed to add special day.');
	  }
	}
	
	async function deleteSpecialDay(day, index) {
	  const response = await fetch('/api/add-edit-special-day', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...day, delete: true }),
	  });
	  if (response.ok) {
	  	specialDays.update(days => days.filter((_, i) => i !== index));
	  } else {
		console.error('Failed to delete special day.');
	  }
	}
	
	function startEditSpecialDay(day) {
	  editingSpecialDay = { ...day, start: day.start.slice(0, -3), end: day.end.slice(0, -3) };
	}
	
	async function saveEditSpecialDay() {
	  if (!editingSpecialDay.date || !editingSpecialDay.start || !editingSpecialDay.end) {
		alert('Please fill in all fields for the special day.');
		return;
	  }
	  const response = await fetch('/api/add-edit-special-day', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({...editingSpecialDay, store_id: data.store.id}),
	  });
	  if (response.ok) {
		specialDays.update(days => 
			days.map(day => 
			day.date === editingSpecialDay.date 
				? { ...editingSpecialDay, start: `${editingSpecialDay.start}:00`, end: `${editingSpecialDay.end}:00` } 
				: day
			)
		);
		editingSpecialDay = null;
	  } else {
		console.error('Failed to save special day.');
	  }
	}
	
	async function saveChanges() {
	  try {
		const response = await fetch('/api/save-store-hours', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data.store),
		});
		
		if (response.ok) {
		  //alert('Promjene su uspješno spremljene!');
		  originalData = JSON.parse(JSON.stringify(data));
		} else {
		  throw new Error('Neuspjelo spremanje promjena.');
		}
	  } catch (error) {
		console.error('Error saving changes:', error);
		//alert('Došlo je do greške prilikom spremanja promjena. Molimo pokušajte ponovno.');
	  }
	}
	
	function resetChanges() {
	  if (confirm('Jeste li sigurni da želite poništiti sve promjene?')) {
		data = JSON.parse(JSON.stringify(originalData));
		specialDays.set(data.store.store_days);
		//alert('Promjene su poništene.');
	  }
	}

	async function handleDelete() {
        const response = await fetch('/api/edit-store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.store?.id,
                delete: true
            })
        });
        if (response.ok) {
            await invalidate('/upravljanje');
            goto('/upravljanje');
        } else {
            //formError = 'Došlo je do greške prilikom brisanja dućana.';
        }
        isDeleteModalOpen = false;
    }
	
	let weekdayStart = $derived(data.store.default_start[0]?.slice(0, -3) || '');
	let weekdayEnd = $derived(data.store.default_end[0]?.slice(0, -3) || '');

	run(() => {
		if (weekdaysGrouped) {
			toggleWeekdayGroup();
		}
	});
</script>

<svelte:head>
  <title>{data.store.title}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-8">
	<h2 class="text-4xl font-extrabold text-primary">{data.store.title}</h2>
	<h3 class="mt-2 text-xl text-gray-600">{data.store.address}, {data.store.town}</h3>
	{#if data.user.role === 'admin'}
		<br>
		<a href={`/upravljanje/ducan/${data.store.id}`} class="btn btn-primary ml-4"><Edit class="mr-2" size={18} />Uredi dućan</a>
		<button onclick={() => isDeleteModalOpen = true} class="btn btn-error ml-4"><Trash class="mr-2" size={18} />Izbriši dućan</button>
	{/if}
  </div>

  <div class="card bg-base-100 shadow-xl">
	<div class="card-body">
	  <div class="tabs tabs-boxed mb-4">
		<button class="tab {activeTab === 'default' ? 'tab-active' : ''}" onclick={() => activeTab = 'default'}>Uobičajeno radno vrijeme</button>
		<button class="tab {activeTab === 'special' ? 'tab-active' : ''}" onclick={() => activeTab = 'special'}>Posebni dani</button>
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
					onchange={(ev) => {
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
					onchange={(ev) => {
					  for (let i = 0; i < 5; i++) {
						updateStoreHours(i, 'default_end', ev.target.value);
					  }
					}}
				  >
				</td>
				<td>
				  {#if !weekdayStart || !weekdayEnd}
					<button class="btn btn-sm btn-primary" onclick={() => {
					  for (let i = 0; i < 5; i++) openStore(i);
					}}>Otvori</button>
				  {:else}
					<button class="btn btn-sm btn-error" onclick={() => {
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
						onchange={(ev) => updateStoreHours(i + 5, 'default_start', ev.target.value)}
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
						onchange={(ev) => updateStoreHours(i + 5, 'default_end', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if !data.store.default_start[i + 5] || !data.store.default_end[i + 5]}
					  <button class="btn btn-sm btn-primary" onclick={() => openStore(i + 5)}>Otvori</button>
					{:else}
					  <button class="btn btn-sm btn-error" onclick={() => closeStore(i + 5)}>Zatvori</button>
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
						onchange={(ev) => updateStoreHours(i, 'default_start', ev.target.value)}
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
						onchange={(ev) => updateStoreHours(i, 'default_end', ev.target.value)}
					  >
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					{#if !data.store.default_start[i] || !data.store.default_end[i]}
					  <button class="btn btn-sm btn-primary" onclick={() => openStore(i)}>Otvori</button>
					{:else}
					  <button class="btn btn-sm btn-error" onclick={() => closeStore(i)}>Zatvori</button>
					{/if}
				  </td>
				</tr>
			  {/each}
			{/if}
		  </tbody>
		</table>
		<div class="mt-4 flex justify-end gap-4">
		  <button class="btn btn-primary" onclick={saveChanges}>Spremi</button>
		  <button class="btn btn-outline btn-error" onclick={resetChanges}>Poništi promjene</button>
		</div>
	  {:else}
		<div class="overflow-x-auto">
		  <div class="mt-4">
		  <h3 class="text-lg font-semibold mb-2">Dodaj novi posebni dan</h3>
		  <div class="flex gap-4">
			<input type="date" bind:value={newSpecialDay.date} class={inputClass} style="width: 10rem">
			<input type="time" bind:value={newSpecialDay.start} class={inputClass}>
			<input type="time" bind:value={newSpecialDay.end} class={inputClass}>
			<button class="btn btn-primary" onclick={addSpecialDay}>Dodaj</button>
		  </div>
		</div>
		
		{#if editingSpecialDay}
		  <div class="mt-4">
			<h3 class="text-lg font-semibold mb-2">Uredi posebni dan</h3>
			<div class="flex gap-4">
			  <input type="date" bind:value={editingSpecialDay.date} class={inputClass} style="width: 10rem">
			  <input type="time" bind:value={editingSpecialDay.start} class={inputClass}>
			  <input type="time" bind:value={editingSpecialDay.end} class={inputClass}>
			  <button class="btn btn-primary" onclick={saveEditSpecialDay}>Spremi</button>
			  <button class="btn btn-ghost" onclick={() => editingSpecialDay = null}>Odustani</button>
			</div>
		  </div>
		{/if}
		  <table class="table w-full">
			<thead>
			  <tr>
				<th>Datum</th>
				<th>Radno vrijeme</th>
				<th>Akcije</th>
			  </tr>
			</thead>
			<tbody>
			  {#each $specialDays as storeDay, index}
				<tr>
				  <td>{new Date(storeDay.date).toLocaleDateString('hr-HR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
				  <td>
					{#if storeDay.start && storeDay.end}
					  {storeDay.start?.slice(0, -3)} - {storeDay.end?.slice(0, -3)}
					{:else}
					  <span class="text-error">Zatvoreno</span>
					{/if}
				  </td>
				  <td>
					<button class="btn btn-sm btn-primary mr-2" onclick={() => startEditSpecialDay(storeDay)}>Uredi</button>
					<button class="btn btn-sm btn-error" onclick={() => deleteSpecialDay(storeDay, index)}>Obriši</button>
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

{#if isDeleteModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-base-100 p-6 rounded-lg">
            <h3 class="text-lg font-bold mb-4">Jeste li sigurni da želite obrisati ovaj dućan?</h3>
            <div class="flex justify-end">
                <button class="btn btn-outline mr-2" onclick={() => isDeleteModalOpen = false}>Odustani</button>
                <button class="btn btn-error" onclick={handleDelete}>Obriši</button>
            </div>
        </div>
    </div>
{/if}