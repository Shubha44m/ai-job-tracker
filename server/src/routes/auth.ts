import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';

// In-memory user store
// In production, use a Database (Postgres/MongoDB)
const users: any[] = [];

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/auth/signup', async (request: any, reply) => {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        if (users.find(u => u.email === email)) {
            return reply.code(400).send({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Math.random().toString(36).substring(7),
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        const token = fastify.jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name });

        return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
    });

    fastify.post('/auth/login', async (request: any, reply) => {
        const { email, password } = request.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const token = fastify.jwt.sign({ id: user.id, email: user.email, name: user.name });

        return { token, user: { id: user.id, name: user.name, email: user.email } };
    });

    fastify.get('/auth/me', {
        onRequest: [async (request: any) => await request.jwtVerify()]
    }, async (request: any, reply) => {
        return request.user;
    });
}
