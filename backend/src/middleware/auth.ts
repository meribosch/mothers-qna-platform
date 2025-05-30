import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}; 