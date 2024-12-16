import { Router } from 'express';
import authRoutes from './authRoute';
import periodRoutes from './periodRoute';
import userOptionRoutes from './userOptionRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/period', periodRoutes);
router.use('/userOption', userOptionRoutes);
export default router;