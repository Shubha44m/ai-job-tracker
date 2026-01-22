import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    skills: string[];
    postedAt: string;
    salary?: string;
    redirect_url: string;
}

export const fetchRealJobs = async (query: string = 'Software Engineer', location: string = '', country: string = 'in'): Promise<Job[]> => {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
        throw new Error('Adzuna API credentials are missing in .env');
    }

    try {
        // Fallback to 'us' or 'gb' if no country is specified and 'in' returns empty? 
        // For now let's just use 'in' (India) as the user is likely there.
        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=15&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&content-type=application/json`;

        console.log(`[JobService] Calling Adzuna (${country}): ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[JobService] Adzuna API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data: any = await response.json();
        const results = data.results || [];

        console.log(`[JobService] Found ${results.length} jobs for "${query}" in "${location}" (${country})`);

        if (results.length === 0 && country !== 'gb') {
            console.log(`[JobService] No results in ${country}, trying fallback to 'gb'...`);
            return fetchRealJobs(query, location, 'gb');
        }

        return results.map((result: any) => ({
            id: result.id,
            title: result.title,
            company: result.company?.display_name || 'Generic Company',
            location: result.location?.display_name || 'Remote',
            type: result.contract_time || 'Full-time',
            description: result.description || 'No description available.',
            skills: result.category?.label?.split(' ') || [],
            postedAt: result.created,
            salary: result.salary_max ? `${result.salary_max}` : undefined,
            redirect_url: result.redirect_url
        }));
    } catch (error) {
        console.error('[JobService] Error fetching jobs:', error);
        return [];
    }
};
