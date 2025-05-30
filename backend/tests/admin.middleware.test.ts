import { Request, Response, NextFunction } from 'express';
import { isAdmin, isModerator } from '../src/middleware/admin.middleware';
import { supabase } from '../src/services/supabase';
import { createTestUser, deleteTestUser } from './utils/auth.utils';

describe('Admin Middleware', () => {
  let testUser: { user: any; email: string; password: string };
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();

    // Create user roles for testing
    await supabase.from('user_roles').insert([
      { user_id: testUser.user.id, role: 'user' }
    ]);
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('user_roles').delete().eq('user_id', testUser.user.id);
    await deleteTestUser(testUser.user.id);
  });

  describe('isAdmin Middleware', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockRequest = {
        user: undefined
      };

      await isAdmin(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Unauthorized - User not authenticated'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not an admin', async () => {
      mockRequest = {
        user: {
          id: testUser.user.id,
          email: testUser.email
        }
      };

      await isAdmin(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Forbidden - Admin access required'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() if user is an admin', async () => {
      // Update user role to admin
      await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', testUser.user.id);

      mockRequest = {
        user: {
          id: testUser.user.id,
          email: testUser.email
        }
      };

      await isAdmin(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();

      // Reset user role
      await supabase
        .from('user_roles')
        .update({ role: 'user' })
        .eq('user_id', testUser.user.id);
    });
  });

  describe('isModerator Middleware', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockRequest = {
        user: undefined
      };

      await isModerator(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Unauthorized - User not authenticated'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not a moderator or admin', async () => {
      mockRequest = {
        user: {
          id: testUser.user.id,
          email: testUser.email
        }
      };

      await isModerator(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Forbidden - Moderator access required'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() if user is a moderator', async () => {
      // Update user role to moderator
      await supabase
        .from('user_roles')
        .update({ role: 'moderator' })
        .eq('user_id', testUser.user.id);

      mockRequest = {
        user: {
          id: testUser.user.id,
          email: testUser.email
        }
      };

      await isModerator(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next() if user is an admin', async () => {
      // Update user role to admin
      await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', testUser.user.id);

      mockRequest = {
        user: {
          id: testUser.user.id,
          email: testUser.email
        }
      };

      await isModerator(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();

      // Reset user role
      await supabase
        .from('user_roles')
        .update({ role: 'user' })
        .eq('user_id', testUser.user.id);
    });
  });
}); 