<script>
    import "../app.css";
    import { user, logout } from "$lib/auth";
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { fetchCache } from "$lib/db";
	import { LogOut } from "lucide-svelte";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

    async function handleLogout() {
        await logout();
        goto('/upravljanje/prijava');
    }
  </script>
  
  <!-- svelte-ignore missing_declaration -->
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
      {#if $page.url.pathname.startsWith('/upravljanje') && $user}
        {#if $user.role === 'admin'}
          <a href="/upravljanje/korisnici" class="btn btn-ghost text-xl">Korisnici</a>
        {/if}
        <h1 class="font-bold">Dobrodošli, {$user.username}!</h1>&nbsp;&nbsp;
        <button onclick={handleLogout} class="btn btn-secondary"><LogOut class="mr-2" size={18} />Odjava</button>
      {/if}
    </div>
  </div>
  {@render children?.()}