import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  userId: z.string(),
});

export type GetUserLikedPostInput = z.infer<typeof schema>;

@injectable()
export class GetUserLikedPost {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: GetUserLikedPostInput) {
    const data = schema.parse(payload);
    const posts = await this.posts.findLikedByUserId(data.userId);
    if (!posts) {
      throw new Error('Posts not found');
    }
    return posts.map(p => p.toJSON());
  }
}