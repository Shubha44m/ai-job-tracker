import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Hardcoded Guest state for no-login experience
    token: 'guest-token-123',
    user: {
        id: 'guest-user',
        name: 'Guest User',
        email: 'guest@example.com'
    },

    login: (token, user) => {
        set({ token, user });
    },

    logout: () => {
        // No-op for guest experience, or we could reset to guest
        set({ token: 'guest-token-123', user: { id: 'guest-user', name: 'Guest User', email: 'guest@example.com' } });
    }
}));
