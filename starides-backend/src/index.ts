import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './resolvers';
import { createContext } from './middleware/auth';
import { logger } from './config/logger';
import { redisClient } from './config/redis';
import { initializeWebSocket } from './config/websocket';
import { apiLimiter, graphqlLimiter } from './middleware/rateLimiter';
import { healthCheck, liveness, readiness } from './routes/health';

dotenv.config();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function startServer() {
    const app = express();
    const httpServer = createServer(app);

    // Initialize WebSocket server
    const wsServer = initializeWebSocket(httpServer);
    logger.info('🔌 WebSocket server initialized');

    // Connect to MongoDB
    await connectDatabase();

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (error) => {
            logger.error('GraphQL Error:', error);
            return {
                message: error.message,
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            };
        }
    });

    await server.start();
    logger.info('🚀 Apollo Server started');

    // Global middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Apply rate limiting to all routes
    app.use(apiLimiter);

    // Health check endpoints (no rate limiting)
    app.get('/health', healthCheck);
    app.get('/health/live', liveness);
    app.get('/health/ready', readiness);

    // GraphQL endpoint with specific rate limiting
    app.use(
        '/graphql',
        graphqlLimiter,
        cors<cors.CorsRequest>({
            origin: (origin, callback) => {
                const allowedOrigins = [
                    'http://localhost:4173',
                    'http://localhost:5173',
                    'http://localhost:5174',
                    'http://localhost:5175',
                    'http://localhost:5176',
                    'https://starides-virid.vercel.app'
                ];

                if (!origin || allowedOrigins.includes(origin) ||
                    origin.match(/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }),
        expressMiddleware(server, {
            context: async ({ req }) => createContext({ req })
        })
    );

    // Graceful shutdown
    const gracefulShutdown = async () => {
        logger.info('⚠️  Shutting down gracefully...');

        await server.stop();
        if (redisClient.isReady()) {
            await redisClient.disconnect();
        }

        httpServer.close(() => {
            logger.info('✅ Server closed');
            process.exit(0);
        });

        // Force close after 10 seconds
        setTimeout(() => {
            logger.error('❌ Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    httpServer.listen(PORT, () => {
        logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
        logger.info(`🔌 WebSocket server running`);
        logger.info(`📊 Connected users: ${wsServer.getConnectedUsersCount()}`);
    });
}

startServer().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
});
