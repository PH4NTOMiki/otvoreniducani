import { writable } from 'svelte/store';
/** @type {App.Locals["user"]?} */
let _user = null;

/** @type {import('svelte/store').Writable<App.Locals["user"]?>} */
export const user = writable(null);
user.subscribe((value) => {_user = value;console.log('user changed', value)});
/** @type {NodeJS.Timeout?} */
let refreshTimeout;

export function initAuth() {
    scheduleTokenRefresh();
}

export async function refreshToken() {
    if (!_user) return false;
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
    });

    if (response.ok) {
        const userData = await response.json();
        user.set(userData.user);
        scheduleTokenRefresh();
        return true;
    } else {
        user.set(null);
        return false;
    }
}


function scheduleTokenRefresh() {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }

    if (_user) {
        // @ts-ignore
        const expiresIn = _user.exp * 1000 - Date.now();
        const refreshTime = expiresIn - 60000; // Refresh 1 minute before expiry

        if (refreshTime > 0) {
            refreshTimeout = setTimeout(refreshToken, refreshTime);
        } else {
            refreshToken(); // Token is already expired or about to expire, refresh immediately
        }
    }
}

/**
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const userData = await response.json();
        user.set(userData.user);
        scheduleTokenRefresh();
        return true;
    } else {
        return false;
    }
}

export async function logout() {
    await fetch('/api/auth/logout', {
        method: 'POST',
    });
    user.set(null);
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }
}

/**
 * @param {string} token
 */
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

/**
 * @param {string} name
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    // @ts-ignore
    if (parts.length === 2) return parts.pop().split(';').shift();
}
