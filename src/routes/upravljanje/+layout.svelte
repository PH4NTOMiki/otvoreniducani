<script>
    import { onMount } from 'svelte';
    import { user, initAuth } from '$lib/auth';
    let { data, children } = $props();

    if (data.user) $user = data.user;
    onMount(async () => {
        initAuth();
    });
</script>

{@render children?.()}