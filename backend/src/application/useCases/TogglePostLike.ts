import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  postId: z.string(),
  userId: z.string(),
});

export type TogglePostLikeInput = z.infer<typeof schema>;

@injectable()
export class TogglePostLike {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: TogglePostLikeInput) {
    const data = schema.parse(payload);
    const post = await this.posts.toggleLike(data.postId, data.userId);
    return post.toJSON();
  }
}