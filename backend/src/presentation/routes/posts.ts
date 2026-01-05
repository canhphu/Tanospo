import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../../container';
import { CreatePost } from '../../application/useCases/CreatePost';
import { GetPost } from '../../application/useCases/GetPost';
import { GetAllPost } from '../../application/useCases/GetAllPost';
import { GetUserPost } from '../../application/useCases/GetUserPost';
import { TogglePostLike } from '../../application/useCases/TogglePostLike';
import { AddComment } from '../../application/useCases/AddComment';
import { GetPostComment } from '../../application/useCases/GetPostComment';
import { JwtService } from '../../application/services/JwtService';
import { GetUserLikedPost } from '../../application/useCases/GetUserLikedPost';

const router = Router();

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Middleware to extract userId from token
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.substring('Bearer '.length);
    const jwtService = container.resolve(JwtService);
    const payload = jwtService.verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/posts - Get all posts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetAllPost);
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const result = await useCase.execute({ limit, offset });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts - Create a new post
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const useCase = container.resolve(CreatePost);
    const result = await useCase.execute({
      userId: req.userId,
      postType: req.body.postType,
      locationId: req.body.locationId,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/user/:userId - Get posts by user
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetUserPost);
    const result = await useCase.execute({
      userId: req.params.userId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/liked', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Ensure userId exists (provided by authMiddleware)
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const useCase = container.resolve(GetUserLikedPost);
    
    // 2. Pass the authenticated user's ID to the use case
    const result = await useCase.execute({
      userId: req.userId, 
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:postId - Get a single post
router.get('/:postId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetPost);
    const result = await useCase.execute({
      postId: req.params.postId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:postId/like - Toggle like on a post
router.post('/:postId/like', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const useCase = container.resolve(TogglePostLike);
    const result = await useCase.execute({
      postId: req.params.postId,
      userId: req.userId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:postId/comments - Add a comment to a post
router.post('/:postId/comments', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const useCase = container.resolve(AddComment);
    const result = await useCase.execute({
      postId: req.params.postId,
      userId: req.userId,
      content: req.body.content,
      rating: req.body.rating,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:postId/comments - Get all comments for a post
router.get('/:postId/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = container.resolve(GetPostComment);
    const result = await useCase.execute({
      postId: req.params.postId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;