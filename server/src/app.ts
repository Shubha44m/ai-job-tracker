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
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS']
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey123'
});

import fastifyMultipart from '@fastify/multipart';
const pdf = require('pdf-parse');

app.register(fastifyMultipart);

app.post('/resume/parse', async (request: any, reply) => {
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
