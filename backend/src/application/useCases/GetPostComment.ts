import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { z } from 'zod';

const schema = z.object({
  postId: z.string(),
});

export type GetPostCommentInput = z.infer<typeof schema>;

@injectable()
export class GetPostComment {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: GetPostCommentInput) {
    const data = schema.parse(payload);
    const comments = await this.posts.getComments(data.postId);
    return comments.map(c => c.toJSON());
  }
}