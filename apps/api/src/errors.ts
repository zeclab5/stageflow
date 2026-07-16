import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    next();
    return;
  }
  res.status(500).json({ error: 'internal server error' });
  next();
}
