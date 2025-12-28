import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Post } from '../../domain/entities/Post';
import { z } from 'zod';

const schema = z.object({
  userId: z.string(),
  postType: z.enum(['checkin', 'review', 'photo', 'status']),
  locationId: z.string().optional(),
  content: z.string().min(1, 'Content cannot be empty'),
  imageUrl: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof schema>;

@injectable()
export class CreatePost {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository,
    @inject('LocationRepository') private readonly locations: ILocationRepository
  ) {}

  async execute(payload: CreatePostInput) {
    const data = schema.parse(payload);

    // Require locationId for checkin and review posts
    if ((data.postType === 'checkin' || data.postType === 'review') && !data.locationId) {
      throw new Error(`Location is required for ${data.postType} posts`);
    }

    // Validate locationId exists if provided
    if (data.locationId) {
      const location = await this.locations.findById(data.locationId);
      if (!location) {
        throw new Error(`Location with id ${data.locationId} not found`);
      }
    }

    const now = new Date();

    const post = new Post({
      userId: data.userId,
      postType: data.postType,
      locationId: data.locationId,
      content: data.content,
      imageUrl: data.imageUrl,
      likedBy: [],
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.posts.save(post);
    return saved.toJSON();
  }
}