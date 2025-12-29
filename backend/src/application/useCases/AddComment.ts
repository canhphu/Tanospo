import { inject, injectable } from 'tsyringe';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Comment } from '../../domain/entities/Comment';
import { z } from 'zod';

const schema = z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string().min(1, 'Content cannot be empty'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

export type AddCommentInput = z.infer<typeof schema>;

@injectable()
export class AddComment {
  constructor(
    @inject('PostRepository') private readonly posts: IPostRepository
  ) {}

  async execute(payload: AddCommentInput) {
    const data = schema.parse(payload);

    const comment = new Comment({
      postId: data.postId,
      userId: data.userId,
      content: data.content,
      rating: data.rating,
      createdAt: new Date(),
    });

    const saved = await this.posts.addComment(comment);
    return saved.toJSON();
  }
}