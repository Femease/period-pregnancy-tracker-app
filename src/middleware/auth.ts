import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      console.log('token', token);
      console.log('JWT_SECRET', JWT_SECRET);
      
      // Verify token is a valid JWT format before verification
      if (!token.match(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/)) {
        throw new Error('Invalid token format');
      }
      
      // Ensure JWT_SECRET is properly formatted as a string
      const secretKey = JWT_SECRET.trim();
      if (!secretKey) {
        throw new Error('Invalid secret key');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('decoded', decoded);
      if (typeof decoded !== 'object' || !decoded.userId) {
        throw new Error('Invalid token payload');
      }
      const user = await prisma.user.findUnique({
        where: { 
          id: decoded.userId
        },
        select: {
          id: true,
          email: true,
          isAdmin: true
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
        });
      }

      req.user = {
        id: user.id.toString(),
        email: user.email,
        role: user.isAdmin ? 'admin' : 'user'
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};