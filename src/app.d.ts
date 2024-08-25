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
				role: 'admin' | 'user';
				stores_owned: number[];
				exp: number?;
				iat: number?;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Store {
			id: number;
			default_start: string | null[];
			default_end: string | null[];
			distance: number?;
			current_start: string?;
			current_end: string?;
			created_at: string;
			address: string;
			town: string;
			coordinate_x: number;
			coordinate_y: number;
			title: string;
			store_days: {
				id: number;
				store_id: number;
				date: string;
				start: string | null;
				end: string | null
			}[];
		}
	}
	L = import('@types/leaflet')
}

export {};
