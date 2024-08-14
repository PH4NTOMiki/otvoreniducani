<script>
    import "../app.css";
    import { browser } from '$app/environment';
    import { fetchCache } from "$lib/db";
  </script>
  
  <!-- svelte-ignore missing-declaration -->
  <svelte:head>
    <title>Otvoreni Dućani</title>  
    {#if fetchCache}
      <template id="loaded-data" style="display:none">{browser?'':Buffer.from(JSON.stringify(fetchCache)).toString('base64')}</template>
    {/if}
  </svelte:head>
  <div class="navbar bg-[#5b3de1] text-[black]">
    <a href="/" class="btn btn-ghost text-xl">Otvoreni Dućani</a>
  </div>
  <br>
  <slot />