<script>
    import "../app.css";
    import { fetchCache } from "$lib/db";
  </script>
  
  <svelte:head><template style="display:none">{JSON.stringify($fetchCache)}</template><title>Otvoreni Dućani</title></svelte:head>
  <slot />