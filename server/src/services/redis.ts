import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(times * 100, 3000),
});

let useRedis = false;
const usersMemo: Map<string, any> = new Map();
const appsMemo: Map<string, any[]> = new Map();

redis.on('connect', () => {
    console.log('✅ Connected to Redis. Using persistent storage.');
    useRedis = true;
});

redis.on('error', (err: any) => {
    if (useRedis || redis.status === 'connecting') {
        console.warn('⚠️ Redis not available. Using IN-MEMORY fallback.');
    }
    useRedis = false;
});

// User Keys: user:{email}
// User Set for listing: users
// Applications List: apps:{userId}

export const redisService = {
    // User Methods
    async saveUser(user: any) {
        if (useRedis) {
            try {
                const key = `user:${user.email}`;
                await redis.hset(key, user);
                await redis.sadd('users', user.email);
                return;
            } catch (e) {
                useRedis = false;
            }
        }
        usersMemo.set(user.email, user);
    },

    async getUser(email: string) {
        if (useRedis) {
            try {
                const key = `user:${email}`;
                const user = await redis.hgetall(key);
                if (Object.keys(user).length > 0) return user;
            } catch (e) {
                useRedis = false;
            }
        }
        return usersMemo.get(email) || null;
    },

    // Application Methods
    async saveApplication(userId: string, application: any) {
        if (useRedis) {
            try {
                const key = `apps:${userId}`;
                await redis.rpush(key, JSON.stringify(application));
                return;
            } catch (e) {
                useRedis = false;
            }
        }
        const userApps = appsMemo.get(userId) || [];
        userApps.push(application);
        appsMemo.set(userId, userApps);
    },

    async getApplications(userId: string) {
        if (useRedis) {
            try {
                const key = `apps:${userId}`;
                const apps = await redis.lrange(key, 0, -1);
                return apps.map((app: any) => JSON.parse(app));
            } catch (e) {
                useRedis = false;
            }
        }
        return appsMemo.get(userId) || [];
    },

    async updateApplicationStatus(userId: string, appId: string, status: string) {
        if (useRedis) {
            try {
                const key = `apps:${userId}`;
                const apps = await this.getApplications(userId);
                const appIndex = apps.findIndex((a: any) => a.id === appId);
                if (appIndex !== -1) {
                    apps[appIndex].status = status;
                    await redis.del(key);
                    for (const app of apps) {
                        await redis.rpush(key, JSON.stringify(app));
                    }
                    return apps[appIndex];
                }
            } catch (e) {
                useRedis = false;
            }
        }

        const apps = appsMemo.get(userId) || [];
        const appIndex = apps.findIndex((a: any) => a.id === appId);
        if (appIndex !== -1) {
            apps[appIndex].status = status;
            appsMemo.set(userId, apps);
            return apps[appIndex];
        }
        return null;
    }
};
