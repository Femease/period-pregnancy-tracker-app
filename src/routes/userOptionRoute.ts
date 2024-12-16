import { Router } from 'express';
import { createPeriodTracker } from '../controllers/userOptionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/periodTracker', authMiddleware, createPeriodTracker);

export default router;