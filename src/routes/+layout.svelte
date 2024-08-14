<script>
    import "../app.css";
    import { user, logout } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { browser } from '$app/environment';
    import { fetchCache } from "$lib/db";

    async function handleLogout() {
        await logout();
        goto('/upravljanje/prijava');
    }
  </script>
  
  <!-- svelte-ignore missing-declaration -->
  <svelte:head>
    <title>Otvoreni Dućani</title>  
    {#if fetchCache}
      <template id="loaded-data" style="display:none">{browser?'':Buffer.from(JSON.stringify(fetchCache)).toString('base64')}</template>
    {/if}
  </svelte:head>
  <div class="navbar bg-[#5b3de1] text-[black]">
    <div class="navbar-start">
      <a href={$user ? `/upravljanje` : `/`} class="btn btn-ghost text-xl">Otvoreni Dućani</a>
    </div>
    <div class="navbar-end">
      {#if $user}
        <h1 class="font-bold">Dobrodošli, {$user.username}!</h1>&nbsp;&nbsp;
        <button on:click={handleLogout} class="btn btn-secondary">Odjava</button>
      {/if}
    </div>
  </div>
  <br>
  <slot />