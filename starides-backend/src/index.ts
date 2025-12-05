import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './resolvers';
import { createContext } from './middleware/auth';

dotenv.config();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function startServer() {
    const app = express();

    // Connect to MongoDB
    await connectDatabase();

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            };
        }
    });

    await server.start();

    // Middleware
    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
            credentials: true
        }),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => createContext({ req })
        })
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
