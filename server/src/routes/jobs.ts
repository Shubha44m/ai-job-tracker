import { FastifyInstance } from 'fastify';
import { MOCK_JOBS } from '../data/mockJobs';
import { scoreJobFormatted } from '../services/ai';

export async function jobRoutes(fastify: FastifyInstance) {
    fastify.get('/jobs', async (request, reply) => {
        // In a real app, we would fetch from DB or External API here.
        // For now, return mock jobs.

        // Simulate async delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return MOCK_JOBS;
    });

    fastify.post('/jobs/match', async (request: any, reply) => {
        const { resumeText } = request.body;

        if (!resumeText) {
            return reply.code(400).send({ error: 'Resume text is required' });
        }

        const matchedJobs = await Promise.all(MOCK_JOBS.map(async (job) => {
            const match = await scoreJobFormatted(resumeText, job);
            return { ...job, match };
        }));

        return matchedJobs.sort((a, b) => b.match.score - a.match.score);
    });
}
