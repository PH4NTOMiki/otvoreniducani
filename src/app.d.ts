// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				username: string;
				email: string;
				password: string?;
				created_at: string;
				stores_owned: number[];
				exp: number?;
				iat: number?;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	L = import('@types/leaflet')
}

export {};
