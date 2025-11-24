import { Router } from 'express';
import userRoutes from './users';
import locationRoutes from './locations';

const router = Router();

router.use('/users', userRoutes);
router.use('/locations', locationRoutes);

export default router;

