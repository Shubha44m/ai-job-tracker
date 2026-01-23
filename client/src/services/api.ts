// Basic API wrapper
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:3001');

export const jobService = {
    fetchJobs: async (query: string = 'Software Engineer', location: string = 'London') => {
        const res = await fetch(`${API_URL}/jobs?what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`);
        return res.json();
    },

    uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/resume/parse`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Failed to parse resume');
        return res.json();
    },

    matchResume: async (resumeText: string, query: string = 'Software Engineer', location: string = 'London') => {
        const res = await fetch(`${API_URL}/jobs/match?what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`, {
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        return data;
    },

    signup: async (data: any) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Signup failed');
            return result;
        } catch (err: any) {
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                throw new Error('Could not connect to the server. Please ensure the backend is running.');
            }
            throw err;
        }
    }
};
