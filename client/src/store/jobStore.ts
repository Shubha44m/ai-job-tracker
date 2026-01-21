import { create } from 'zustand';
import { jobService } from '../services/api';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    skills: string[];
    postedAt: string;
    match?: {
        score: number;
        match_level: 'High' | 'Medium' | 'Low';
        reasons: string[];
    };
}

interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    company: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    date: string;
}

interface JobState {
    jobs: Job[];
    applications: Application[];
    loading: boolean;
    fetchJobs: () => Promise<void>;
    matchResume: (resumeText: string) => Promise<void>;
    addApplication: (application: Omit<Application, 'id' | 'date'>) => void;
    updateApplicationStatus: (id: string, status: Application['status']) => void;
}

export const useJobStore = create<JobState>((set, get) => ({
    jobs: [],
    applications: JSON.parse(localStorage.getItem('applications') || '[]'),
    loading: false,

    fetchJobs: async () => {
        set({ loading: true });
        try {
            const data = await jobService.fetchJobs();
            set({ jobs: data });
        } finally {
            set({ loading: false });
        }
    },

    matchResume: async (resumeText: string) => {
        set({ loading: true });
        try {
            const data = await jobService.matchResume(resumeText);
            set({ jobs: data });
        } finally {
            set({ loading: false });
        }
    },

    addApplication: (app) => {
        const newApp: Application = {
            ...app,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0]
        };
        const updated = [newApp, ...get().applications];
        localStorage.setItem('applications', JSON.stringify(updated));
        set({ applications: updated });
    },

    updateApplicationStatus: (id, status) => {
        const updated = get().applications.map(app =>
            app.id === id ? { ...app, status } : app
        );
        localStorage.setItem('applications', JSON.stringify(updated));
        set({ applications: updated });
    }
}));
