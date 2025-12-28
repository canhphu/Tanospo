import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  userId: z.string(),
});

export type GetUserPostInput = z.infer<typeof schema>;

@injectable()
export class GetUserPost {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: GetUserPostInput) {
    const data = schema.parse(payload);
    const posts = await this.posts.findByUserId(data.userId);
    return posts.map(p => p.toJSON());
  }
}