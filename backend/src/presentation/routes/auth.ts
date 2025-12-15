import { Router } from 'express';
import { container } from '../../container';
import { RegisterUser } from '../../application/useCases/RegisterUser';
import { LoginUser } from '../../application/useCases/LoginUser';

const router = Router();

// API POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const useCase = container.resolve(RegisterUser);
    const result = await useCase.execute(req.body);
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: result 
    });
  } catch (error) {
    next(error);
  }
});

// API POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const useCase = container.resolve(LoginUser);
    const result = await useCase.execute(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;