<script>
    import { onMount } from 'svelte';
    import { user, initAuth } from '$lib/auth';
    export let data;

    if (data.user) $user = data.user;
    onMount(async () => {
        initAuth();
    });
</script>

<slot />