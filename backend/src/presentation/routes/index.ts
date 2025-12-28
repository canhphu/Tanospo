import { Router } from 'express';
import locationRoutes from './locations';
import authRoutes from './auth';
import postRoutes from './posts';

const router = Router();

router.use('/locations', locationRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

export default router;