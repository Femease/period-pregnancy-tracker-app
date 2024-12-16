import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPeriodTracker = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const periodTracker = await prisma.periodTracker.create({
      data: {
        userId,
      },
    });

    return res.status(201).json(periodTracker);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create period tracker' });
  }
};