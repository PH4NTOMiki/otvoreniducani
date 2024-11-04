<script>
    import { preventDefault } from 'svelte/legacy';

    import { login } from '$lib/auth';
    import { goto } from '$app/navigation';
	import { LogIn } from 'lucide-svelte';

    let username = $state('');
    let password = $state('');

    async function handleSubmit() {
        if (await login(username, password)) {
            await goto(`/upravljanje${new URL(location.href).searchParams.get('to') ?? ''}`, { invalidateAll: true });
        } else {
            alert('Login failed');
        }
    }
</script>
<svelte:head>
    <title>Upravljanje - Prijava</title>
</svelte:head>
<div class="mx-auto bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl min-h-[500px]">
    <!-- Left Side - Decorative -->
    <div class="bg-indigo-600 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none text-white p-8 md:w-1/2 flex flex-col justify-center items-center">
        <h2 class="text-4xl font-bold mb-4">Dobrodošli nazad!</h2>
        <p class="text-indigo-200 text-center mb-8"></p>
        <svg class="w-48 h-48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.90625 20.2491C3.82834 18.6531 5.1542 17.3278 6.75064 16.4064C8.34708 15.485 10.1579 15 12.0011 15C13.8444 15 15.6552 15.4851 17.2516 16.4065C18.848 17.3279 20.1739 18.6533 21.0959 20.2493" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
    <!-- Right Side - Login Form -->
    <div class="flex flex-col justify-center items-center p-8 md:w-1/2">
        <h2 class="text-3xl font-bold text-indigo-600 mb-8">Prijava</h2>
        <form onsubmit={preventDefault(handleSubmit)}>
            <div class="mb-6">
                <label for="username" class="block text-gray-700 text-sm font-semibold mb-2">Korisničko ime</label>
                <input bind:value={username} id="username" class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500" placeholder="korisnik" required />
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Lozinka</label>
                <input bind:value={password} type="password" id="password" class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500" placeholder="••••••••" required />
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"><LogIn class="mr-2 inline-block" size={18} />Prijava</button>
        </form>
        <!--<div class="mt-8 text-center">
            <a href="#" class="text-indigo-600 hover:underline">Forgot Password?</a>
        </div>
        <div class="mt-8 flex items-center justify-center">
            <span class="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" class="text-xs text-gray-500 uppercase px-4">or login with</a>
            <span class="border-b w-1/5 lg:w-1/4"></span>
        </div>
        <div class="mt-4 flex justify-center gap-4">
            <button class="flex items-center justify-center py-2 px-4 border rounded-lg hover:bg-gray-100">
                <svg class="h-5 w-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                        <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"/>
                        <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"/>
                        <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"/>
                        <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"/>
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect width="20" height="20" fill="white" transform="translate(0.5)"/>
                        </clipPath>
                    </defs>
                </svg>
                Google
            </button>
        </div>
        <p class="text-center mt-8 text-sm text-gray-600">
            Don't have an account? 
            <a href="#" class="text-indigo-600 font-semibold hover:underline">Sign up here</a>
        </p>-->
    </div>
</div>