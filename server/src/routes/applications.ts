import { FastifyInstance } from 'fastify';

// Simple in-memory storage for applications
// In production, use Redis/DB
let applications: any[] = [];

export async function applicationRoutes(fastify: FastifyInstance) {
    fastify.get('/applications', async (request, reply) => {
        return applications;
    });

    fastify.post('/applications', async (request: any, reply) => {
        const { jobId, jobTitle, company, status, timestamp } = request.body;
        const newApp = {
            id: Math.random().toString(36).substring(7),
            jobId,
            jobTitle,
            company,
            status: status || 'Applied',
            timestamp: timestamp || new Date().toISOString()
        };
        applications.push(newApp);
        return newApp;
    });

    fastify.patch('/applications/:id', async (request: any, reply) => {
        const { id } = request.params;
        const { status } = request.body;

        const appIndex = applications.findIndex(a => a.id === id);
        if (appIndex === -1) {
            return reply.code(404).send({ error: 'Application not found' });
        }

        applications[appIndex].status = status;
        return applications[appIndex];
    });
}
