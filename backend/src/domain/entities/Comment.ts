import { ObjectId } from 'mongodb';

export interface CommentProps {
  _id?: ObjectId;
  id?: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  createdAt: Date;
}

export class Comment {
  constructor(private props: CommentProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get postId(): string {
    return this.props.postId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get parentCommentId(): string | undefined {
    return this.props.parentCommentId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<CommentProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<CommentProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<CommentProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

