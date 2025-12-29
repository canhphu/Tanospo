import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type GetAllPostInput = z.infer<typeof schema>;

@injectable()
export class GetAllPost {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: GetAllPostInput = {}) {
    const data = schema.parse(payload);
    const posts = await this.posts.findAll(data.limit, data.offset);
    return posts.map(p => p.toJSON());
  }
}