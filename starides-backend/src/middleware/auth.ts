import { Request } from 'express';
import { verifyToken, TokenPayload } from '../utils/auth';

export interface Context {
    user?: TokenPayload;
}

export const createContext = ({ req }: { req: Request }): Context => {
    const context: Context = {};

    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            context.user = verifyToken(token);
        }
    } catch (error) {
        // Invalid token, context.user remains undefined
    }

    return context;
};

export const requireAuth = (context: Context): TokenPayload => {
    if (!context.user) {
        throw new Error('Authentication required');
    }
    return context.user;
};

export const requireRole = (context: Context, allowedRoles: string[]): TokenPayload => {
    const user = requireAuth(context);
    if (!allowedRoles.includes(user.role)) {
        throw new Error('Insufficient permissions');
    }
    return user;
};
