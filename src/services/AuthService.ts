import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'Anshul@149';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'Anshul@149';

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  age?: number | null;
  bmi?: number | null;
  isAdmin: boolean;
}

export const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  return generateToken(user);
};

export const register = async (userData: UserCreateInput): Promise<any> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
};


export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    return generateToken(user);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const logout = async (token: string): Promise<void> => {
  // Implement token blacklisting if needed
  // For a simple implementation, client-side token removal is sufficient
};

const generateToken = (user: any): string => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};