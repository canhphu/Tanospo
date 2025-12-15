import { Router } from 'express';
import { container } from '../../container';
import { GetNearbyLocations } from '../../application/useCases/GetNearbyLocations';

const router = Router();

router.get('/nearby', async (req, res, next) => {
  try {
    const useCase = container.resolve(GetNearbyLocations);
    const result = await useCase.execute({
      userId: req.query.userId?.toString(),
      latitude: req.query.lat ? Number(req.query.lat) : undefined,
      longitude: req.query.lng ? Number(req.query.lng) : undefined,
      radiusMeters: req.query.radius ? Number(req.query.radius) : 2000,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

