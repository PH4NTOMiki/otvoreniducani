<script>
    import "../app.css";
    import { fetchCache } from "$lib/db";
  </script>
  
  <svelte:head>
    <title>Otvoreni Dućani</title>  
    {#if $fetchCache}
      <template id="loaded-data" style="display:none">{JSON.stringify($fetchCache)}</template>
    {/if}
  </svelte:head>
  <slot />