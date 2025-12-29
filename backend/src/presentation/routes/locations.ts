import { Router } from 'express';
import { container } from '../../container';
import { GetNearbyLocations } from '../../application/useCases/GetNearbyLocations';
import { CreateLocation } from '../../application/useCases/CreateLocation';
import { GetLocationById } from '../../application/useCases/GetLocationById';

const router = Router();


// POST /api/locations
router.post('/', async (req, res, next) => {
  try {
    const useCase = container.resolve(CreateLocation);
    const result = await useCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

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

// GET /api/locations/:id
router.get('/:id', async (req, res, next) => {
  try {
    const useCase = container.resolve(GetLocationById);
    const result = await useCase.execute(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

