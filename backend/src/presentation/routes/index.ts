import { Router } from 'express';
import locationRoutes from './locations';
import authRoutes from './auth';

const router = Router();

router.use('/locations', locationRoutes);
router.use('/auth', authRoutes);

export default router;

