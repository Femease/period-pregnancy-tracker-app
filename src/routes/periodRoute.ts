import { Router } from 'express';
import {
  getCycleInsights,
  logSymptoms,
  logPeriodStart,
  updatePeriodLength,
  getSymptomHistory,
  getCycleAnalytics,
  updateCycleLength
} from '../controllers/periodController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.get('/insights', authMiddleware,getCycleInsights);
router.post('/symptoms', authMiddleware, logSymptoms);
router.post('/start', authMiddleware, logPeriodStart);
router.post('/length', authMiddleware, updatePeriodLength);
router.get('/symptoms/history', authMiddleware, getSymptomHistory);
router.get('/analytics', authMiddleware, getCycleAnalytics);
router.post('/cycle',authMiddleware,updateCycleLength)
export default router;