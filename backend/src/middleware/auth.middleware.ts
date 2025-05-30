import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';

// Extend Express Request type to include user
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

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get JWT from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization header'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token using Supabase
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
    console.error('Authentication error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Optional: Middleware to check if user owns the resource
export const checkResourceOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const resourceUserId = req.body.user_id || req.params.userId;

    if (!userId || userId !== resourceUserId) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to access this resource'
      });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(403).json({
      status: 'error',
      message: 'Authorization failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}; 