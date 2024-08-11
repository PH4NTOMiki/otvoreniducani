<script>
    import { onMount } from 'svelte';
    import { user, refreshToken, initAuth } from '$lib/auth';
    import { goto } from '$app/navigation';

    onMount(async () => {
        initAuth();
        if (!$user) {
            const success = await refreshToken();
            if (!success) {
                //goto('/login');
            }
        }
    });
</script>

<slot />