import { Router } from 'express';
import { container } from '../../container';
import { RegisterUser } from '../../application/useCases/RegisterUser';
import { LoginUser } from '../../application/useCases/LoginUser';
import { GetProfile } from '../../application/useCases/GetProfile';
import { JwtService } from '../../application/services/JwtService';
import { LoginWithGoogle } from '../../application/useCases/LoginWithGoogle';
import { GetUserById } from '../../application/useCases/GetUserById';

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

// API GET /api/auth/profile
router.get('/profile', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.substring('Bearer '.length);
    const useCase = container.resolve(GetProfile);
    const profile = await useCase.execute(token);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// API GET /api/auth/user/:id - public user info
router.get('/user/:id', async (req, res, next) => {
  try {
    const useCase = container.resolve(GetUserById);
    const user = await useCase.execute(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// API POST /api/auth/google
router.post('/google', async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }
    const useCase = container.resolve(LoginWithGoogle);
    const result = await useCase.execute({ idToken });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;