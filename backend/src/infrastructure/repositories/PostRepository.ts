import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post, PostProps } from '../../domain/entities/Post';
import { Comment, CommentProps } from '../../domain/entities/Comment';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const mapPost = (doc: any): Post => {
  return new Post({
    _id: doc._id,
    userId: doc.userId,
    postType: doc.postType,
    locationId: doc.locationId,
    content: doc.content,
    imageUrl: doc.imageUrl,
    videoUrl: doc.videoUrl,
    likedBy: doc.likedBy || [],
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  });
};

const mapComment = (doc: any): Comment => {
  return new Comment({
    _id: doc._id,
    postId: doc.postId,
    userId: doc.userId,
    rating: doc.rating,
    content: doc.content,
    createdAt: doc.createdAt || new Date(),
  });
};

export class PostRepository implements IPostRepository {
  private collection = 'posts';
  private commentCollection = 'comments';

  async findById(id: string): Promise<Post | null> {
    const db = await getDb();
    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    const doc = await db.collection(this.collection).findOne(query);
    return doc ? mapPost(doc) : null;
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const db = await getDb();
    const docs = await db
      .collection(this.collection)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(mapPost);
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Post[]> {
    const db = await getDb();
    const docs = await db
      .collection(this.collection)
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
    return docs.map(mapPost);
  }

  async save(post: Post): Promise<Post> {
    const db = await getDb();
    const doc = post.toMongoDoc();
    const now = new Date();

    const updateDoc: Partial<PostProps> = {
      userId: doc.userId,
      postType: doc.postType,
      locationId: doc.locationId,
      content: doc.content,
      imageUrl: doc.imageUrl,
      videoUrl: doc.videoUrl,
      likedBy: doc.likedBy,
      updatedAt: now,
    };

    const result = await db.collection(this.collection).updateOne(
      { _id: doc._id },
      {
        $set: updateDoc,
        $setOnInsert: {
          createdAt: doc.createdAt || now,
        },
      },
      { upsert: true }
    );

    if (result.upsertedId) {
      doc._id = result.upsertedId as ObjectId;
    }

    const savedId = doc._id?.toString();
    if (!savedId) {
      throw new Error('Failed to get post ID after save');
    }
    const saved = await this.findById(savedId);
    if (!saved) throw new Error('Failed to save post');
    return saved;
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const db = await getDb();
    let query: any;
    try {
      query = { _id: new ObjectId(postId) };
    } catch {
      query = { _id: postId };
    }

    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');

    post.toggleLike(userId);

    await db.collection(this.collection).updateOne(
      query,
      {
        $set: {
          likedBy: post.likedBy,
          updatedAt: new Date(),
        },
      }
    );

    return post;
  }

  async getComments(postId: string): Promise<Comment[]> {
    const db = await getDb();
    const docs = await db
      .collection(this.commentCollection)
      .find({ postId })
      .sort({ createdAt: 1 })
      .toArray();
    return docs.map(mapComment);
  }

  async addComment(comment: Comment): Promise<Comment> {
    const db = await getDb();
    const doc = comment.toMongoDoc();

    const result = await db.collection(this.commentCollection).insertOne(doc);
    doc._id = result.insertedId as ObjectId;

    const savedId = doc._id?.toString();
    if (!savedId) {
      throw new Error('Failed to get comment ID after save');
    }

    const saved = await db.collection(this.commentCollection).findOne({ _id: doc._id });
    if (!saved) throw new Error('Failed to save comment');
    return mapComment(saved);
  }

  async findLikedByUserId(userId: string): Promise<Post[]> {
    const db = await getDb();
    const docs = await db
      .collection(this.collection)
      .find({ likedBy: userId }) 
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(mapPost);
  }
}