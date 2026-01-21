// Basic API wrapper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const jobService = {
    fetchJobs: async () => {
        const res = await fetch(`${API_URL}/jobs`);
        return res.json();
    },

    uploadResume: async (file: File) => {
        // In real implementation, this would POST to /upload
        // For now we just return mock success
        return new Promise(resolve => setTimeout(resolve, 1000));
    },

    matchResume: async (resumeText: string) => {
        const res = await fetch(`${API_URL}/jobs/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText })
        });
        return res.json();
    },

    chatWithAI: async (message: string, context: { jobs: any[], applications: any[] }) => {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context })
        });
        return res.json();
    }
};

export const authService = {
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    signup: async (data: any) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
    }
};
