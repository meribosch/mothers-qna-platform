import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';

// Extend Request type to include user
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

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user from auth middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - User not authenticated'
      });
    }

    // Check if user has admin role
    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !userRole || userRole.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden - Admin access required'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking admin status',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user from auth middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - User not authenticated'
      });
    }

    // Check if user has moderator or admin role
    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !userRole || !['admin', 'moderator'].includes(userRole.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden - Moderator access required'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking moderator status',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}; 