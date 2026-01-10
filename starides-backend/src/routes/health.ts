import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
};

export const liveness = (req: Request, res: Response) => {
    res.status(200).json({ status: 'alive' });
};

export const readiness = (req: Request, res: Response) => {
    res.status(200).json({ status: 'ready' });
};
