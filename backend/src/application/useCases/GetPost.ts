import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  postId: z.string(),
});

export type GetPostInput = z.infer<typeof schema>;

@injectable()
export class GetPost {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: GetPostInput) {
    const data = schema.parse(payload);
    const post = await this.posts.findById(data.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return post.toJSON();
  }
}