import { FastifyInstance } from 'fastify';

import { redisService } from '../services/redis';

export async function applicationRoutes(fastify: FastifyInstance) {
    // Protect all application routes
    fastify.addHook('onRequest', async (request: any, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            return reply.code(401).send({ error: 'Unauthorized' });
        }
    });

    fastify.get('/applications', async (request: any, reply) => {
        const userId = request.user.id;
        const apps = await redisService.getApplications(userId);
        return apps;
    });

    fastify.post('/applications', async (request: any, reply) => {
        const userId = request.user.id;
        const { jobId, jobTitle, company, status, timestamp } = request.body;
        const newApp = {
            id: Math.random().toString(36).substring(7),
            jobId,
            jobTitle,
            company,
            status: status || 'Applied',
            timestamp: timestamp || new Date().toISOString()
        };
        await redisService.saveApplication(userId, newApp);
        return newApp;
    });

    fastify.patch('/applications/:id', async (request: any, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const { status } = request.body;

        const updatedApp = await redisService.updateApplicationStatus(userId, id, status);
        if (!updatedApp) {
            return reply.code(404).send({ error: 'Application not found' });
        }

        return updatedApp;
    });
}
