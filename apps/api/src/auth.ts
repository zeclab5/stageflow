import { Request, Response, NextFunction } from 'express';

export const requiredApiKey = (req: Request, res: Response, next: NextFunction) => {
  const headerKey = req.headers['x-api-key'];
  const bearer = req.headers.authorization?.replace('Bearer ', '');
  const key = Array.isArray(headerKey) ? headerKey[0] : (headerKey ?? bearer ?? '');
  const expected = process.env.API_KEY;

  if (!expected || expected === '') {
    return next();
  }

  if (!key || key !== expected) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  return next();
};
