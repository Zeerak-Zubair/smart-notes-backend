import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[requireAuth] Error getting session:', error);
      res.status(401).json({ error: 'Failed to get session' });
      return;
    }

    if (!data.session) {
      res.status(401).json({ error: 'No active session. Please sign in.' });
      return;
    }

    // Attach user to request for use in controllers
    (req as any).user = data.session.user;
    (req as any).session = data.session;

    next();
  } catch (error) {
    console.error('[requireAuth] Unexpected error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
