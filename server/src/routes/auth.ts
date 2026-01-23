import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';

import { redisService } from '../services/redis';

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/signup', async (request: any, reply) => {
        let { name, email, password } = request.body;
        console.log(`Signup attempt: ${email}`);
        email = email?.toLowerCase();

        if (!name || !email || !password) {
            console.warn(`Signup failed: Missing fields for ${email || 'unknown email'}`);
            return reply.code(400).send({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return reply.code(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const existingUser = await redisService.getUser(email);
        if (existingUser) {
            console.log(`Signup failed: User ${email} already exists`);
            return reply.code(400).send({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Math.random().toString(36).substring(7),
            name,
            email,
            password: hashedPassword
        };

        try {
            await redisService.saveUser(newUser);
            console.log(`Signup successful: ${email}`);

            const token = fastify.jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name });

            return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
        } catch (error) {
            console.error(`Signup error for ${email}:`, error);
            return reply.code(500).send({ error: 'Internal server error during registration' });
        }
    });

    fastify.post('/auth/login', async (request: any, reply) => {
        let { email, password } = request.body;
        console.log(`Login attempt: ${email}`);
        email = email?.toLowerCase();

        const user: any = await redisService.getUser(email);
        if (!user) {
            console.log(`Login failed: User ${email} not found`);
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log(`Login failed: Invalid password for ${email}`);
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        console.log(`Login successful: ${email}`);
        const token = fastify.jwt.sign({ id: user.id, email: user.email, name: user.name });

        return { token, user: { id: user.id, name: user.name, email: user.email } };
    });

    fastify.get('/auth/me', {
        onRequest: [async (request: any) => await request.jwtVerify()]
    }, async (request: any, reply) => {
        return request.user;
    });
}
