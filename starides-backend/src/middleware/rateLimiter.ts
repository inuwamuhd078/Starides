import { Request, Response, NextFunction } from 'express';

export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const graphqlLimiter = (req: Request, res: Response, next: NextFunction) => {
    next();
};
