import { Request, Response, NextFunction } from 'express';
import { getAuthenticatedUser } from '../utils/auth.utils';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error('[requireAuth] No authorization header provided');
      res.status(401).json({ error: 'Authorization header is required' });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        console.error('[requireAuth] Malformed authorization header');
        res.status(401).json({ error: 'Malformed authorization header' });
        return;
    }

    const userId = await getAuthenticatedUser(token);

    if (!userId) {
      console.error('[requireAuth] Invalid or expired token');
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user ID to request for use in controllers
    (req as any).userId = userId;

    next();
  } catch (error) {
    console.error('[requireAuth] Unexpected error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
