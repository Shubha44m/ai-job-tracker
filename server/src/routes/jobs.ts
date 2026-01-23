import { FastifyInstance } from 'fastify';
import { fetchRealJobs } from '../services/jobApi';
import { scoreJobFormatted } from '../services/ai';

export async function jobRoutes(fastify: FastifyInstance) {
    fastify.get('/jobs', async (request: any, reply) => {
        const { what, where } = request.query;
        const jobs = await fetchRealJobs(what || 'Software Engineer', where || 'United Kingdom');
        return jobs;
    });

    fastify.post('/jobs/match', async (request: any, reply) => {
        const { resumeText } = request.body;
        const { what, where } = request.query;

        if (!resumeText) {
            return reply.code(400).send({ error: 'Resume text is required' });
        }

        const realJobs = await fetchRealJobs(what || 'Software Engineer', where || 'United Kingdom');

        const matchedJobs = await Promise.all(realJobs.map(async (job) => {
            const match = await scoreJobFormatted(resumeText, job);
            return { ...job, match };
        }));

        return matchedJobs.sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));
    });
}
