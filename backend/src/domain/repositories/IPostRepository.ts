import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findByUserId(userId: string): Promise<Post[]>;
  findAll(limit?: number, offset?: number): Promise<Post[]>;
  save(post: Post): Promise<Post>;
  toggleLike(postId: string, userId: string): Promise<Post>;
  getComments(postId: string): Promise<Comment[]>;
  addComment(comment: Comment): Promise<Comment>;
}