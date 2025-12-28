import Redis from 'ioredis';
import { logger } from './logger';

class RedisClient {
    private client: Redis;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        });

        this.client.on('connect', () => {
            this.isConnected = true;
            logger.info('✅ Redis connected successfully');
        });

        this.client.on('error', (err) => {
            // Log as warning instead of error for local dev if not connected
            if (process.env.NODE_ENV === 'development') {
                logger.warn('⚠️  Redis connection failed (optional in dev)');
            } else {
                logger.error('❌ Redis connection error:', err);
            }
            this.isConnected = false;
        });

        this.client.on('close', () => {
            this.isConnected = false;
            logger.warn('⚠️  Redis connection closed');
        });
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            logger.error(`Redis GET error for key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        try {
            if (ttl) {
                await this.client.setex(key, ttl, value);
            } else {
                await this.client.set(key, value);
            }
        } catch (error) {
            logger.error(`Redis SET error for key ${key}:`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            logger.error(`Redis DEL error for key ${key}:`, error);
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            logger.error(`Redis EXISTS error for key ${key}:`, error);
            return false;
        }
    }

    async flushAll(): Promise<void> {
        try {
            await this.client.flushall();
            logger.info('Redis cache cleared');
        } catch (error) {
            logger.error('Redis FLUSHALL error:', error);
        }
    }

    getClient(): Redis {
        return this.client;
    }

    isReady(): boolean {
        return this.isConnected;
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}

export const redisClient = new RedisClient();
