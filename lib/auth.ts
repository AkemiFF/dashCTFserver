// auth.ts
import { refreshToken } from "./api";
interface AuthData {
    access: string;
    refresh: string;
    user_id: number;
    username: string;
    email: string;
    role: string;
    access_expires_at: number;
}

export const saveAuthData = (responseData: any) => {
    const authData: AuthData = {
        access: responseData.access,
        refresh: responseData.refresh,
        user_id: responseData.user_id,
        username: responseData.username,
        email: responseData.email,
        role: responseData.role,
        access_expires_at: Date.now() + (parseInt(responseData.token_lifetime.access) * 1000)
    };

    localStorage.setItem('auth', JSON.stringify(authData));
};

// Helpers pour l'utilisation des tokens
export const getAccessToken = (): string | null => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).access : null;
};

export const getRefreshToken = (): string | null => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth).refresh : null;
};

export const isAuthenticated = (): boolean => {
    const auth = localStorage.getItem('auth');
    if (!auth) return false;

    const { access_expires_at } = JSON.parse(auth);
    return Date.now() < access_expires_at;
};

export const getAuthHeader = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAuthenticated()) {
        token = await refreshToken();
    } else {
        token = getAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};


export const getAuthHeaderFormData = async (): Promise<HeadersInit> => {
    let token: string | null;
    if (!isAuthenticated()) {
        token = await refreshToken();
    } else {
        token = getAccessToken();
    }
    return {
        'Authorization': `Bearer ${token}`,
    };
};

