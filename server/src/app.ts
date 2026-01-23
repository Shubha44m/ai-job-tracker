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

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey123'
});

import fastifyMultipart from '@fastify/multipart';
const pdf = require('pdf-parse');

app.register(fastifyMultipart);

app.post('/api/resume/parse', async (request: any, reply) => {
  const data = await request.file();
  if (!data) return reply.code(400).send({ error: 'No file uploaded' });

  const buffer = await data.toBuffer();
  let text = '';

  if (data.filename.endsWith('.pdf')) {
    const pdfData = await (pdf as any)(buffer);
    text = pdfData.text;
  } else {
    text = buffer.toString('utf-8');
  }

  return { text };
});

app.register(jobRoutes, { prefix: '/api' });
app.register(applicationRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api' });

app.get('/api', async (request, reply) => {
  return {
    status: 'OK',
    message: 'AI Job Tracker API is running 🚀',
    redis: (redis as any).status
  };
});

app.get('/', async (request, reply) => {
  return {
    status: 'OK',
    message: 'AI Job Tracker Backend is running 🚀'
  };
});

app.post('/api/chat', async (request: any, reply) => {
  const { message, context } = request.body;
  const response = await chatWithAI(message, context);
  return { response };
});

// Export the app for serverless environments (like Vercel)
export default async (req: any, res: any) => {
  await app.ready();
  app(req, res);
};

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const start = async () => {
    try {
      const port = parseInt(process.env.PORT || '3001');
      await app.listen({ port, host: '0.0.0.0' });
      console.log(`🚀 Server gracefully running on http://localhost:${port}`);
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${process.env.PORT || '3001'} is already in use.`);
        console.error(`💡 Try killing the process running on this port or change the PORT in .env`);
      } else {
        app.log.error(err);
      }
      process.exit(1);
    }
  };

  start();
}
