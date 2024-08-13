import { writable } from 'svelte/store';

export const user = writable(null);
/** @type {NodeJS.Timeout?} */
let refreshTimeout;

export async function refreshToken() {
    if (!localStorage.getItem('refreshToken')) return false;
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
    });

    if (response.ok) {
        const userData = await response.json();
        user.set(userData.user);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
        scheduleTokenRefresh();
        return true;
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        user.set(null);
        return false;
    }
}


function scheduleTokenRefresh() {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }

    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = parseJwt(token);
            // @ts-ignore
            const expiresIn = decodedToken.exp * 1000 - Date.now();
            const refreshTime = expiresIn - 60000; // Refresh 1 minute before expiry

            if (refreshTime > 0) {
                refreshTimeout = setTimeout(refreshToken, refreshTime);
            } else {
                refreshToken(); // Token is already expired or about to expire, refresh immediately
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            logout();
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
        credentials: 'include',
    });

    if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
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
        credentials: 'include',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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

export function initAuth() {
    scheduleTokenRefresh();
}