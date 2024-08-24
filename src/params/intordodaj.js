/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	// @ts-ignore
	return param === 'dodaj' || /^\d+$/.test(param);
}