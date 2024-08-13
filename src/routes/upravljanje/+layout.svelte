<script>
    import { onMount } from 'svelte';
    import { user, refreshToken, initAuth } from '$lib/auth';
    import { goto } from '$app/navigation';
    export let data;

    onMount(async () => {
        if (!$user) {
            // @ts-ignore
            $user = data.user;
        }
        initAuth();
    });
</script>

<slot />