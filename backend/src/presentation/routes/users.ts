import { Router } from 'express';
import { container } from '../../container';
import { RegisterUser } from '../../application/useCases/RegisterUser';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const useCase = container.resolve(RegisterUser);
    const result = await useCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

