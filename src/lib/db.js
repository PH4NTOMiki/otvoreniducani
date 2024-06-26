import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
let initData = {};
if(browser && document.getElementById('loaded-data')){// @ts-ignore
    initData = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(document.getElementById('loaded-data').innerHTML), m => m.codePointAt(0))));
    
    setTimeout(() => {initData = {}}, 10e3);
}
export const fetchCache = writable({});

export const db = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {global: {
    // @ts-ignore
    fetch: async (url, init) => {
        if(browser){
            if(init?.method !== "GET") return await fetch(url, init);
            // @ts-ignore
            if(initData[url]){
                // @ts-ignore
                return objectToResponse(initData[url]);
            }
            return await fetch(url, init);
        }
        if(! browser){
            const res = await fetch(url, init);
            if(init?.method !== "GET") return res;
            const respObj = await responseToObject(res);
            // @ts-ignore
            fetchCache.update(_fC => {_fC[url] = respObj;return _fC;});
            return res;
        }
    }
}});

/** @param {Response} response */
async function responseToObject(response) {
    const _cR = response.clone();
    /** @type {Record<string, string>} */
    const headers = {};
    _cR.headers.forEach((value, name) => {headers[name] = value});
    return {body: await _cR.text(), headers, status: _cR.status, statusText: _cR.statusText, url: _cR.url, type: _cR.type, redirected: _cR.redirected};
}

/** @param {{ body: string; headers: Record<string, string>; status: number; statusText: string; url: string; type: ResponseType; redirected: boolean; }} responseObject */
function objectToResponse(responseObject) {
    const { body, ...others } = responseObject;
    return new Response(body, others);
  }
