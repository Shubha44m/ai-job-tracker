import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { jobRoutes } from './routes/jobs';
import { applicationRoutes } from './routes/applications';
import { authRoutes } from './routes/auth';
import { chatWithAI } from './services/ai';

dotenv.config();

const app = fastify({ logger: true });

app.register(cors);
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey123'
});

app.register(jobRoutes);
app.register(applicationRoutes);
app.register(authRoutes);

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.post('/chat', async (request: any, reply) => {
  const { message, context } = request.body;
  const response = await chatWithAI(message, context);
  return { response };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    // Listen on all interfaces
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
