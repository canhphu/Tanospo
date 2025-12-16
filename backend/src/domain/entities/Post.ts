import { ObjectId } from 'mongodb';

export type PostType = 'checkin' | 'review' | 'photo' | 'status';

export interface PostProps {
  _id?: ObjectId;
  id?: string;
  userId: string;
  postType: PostType;
  locationId?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Post {
  constructor(private props: PostProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get userId(): string {
    return this.props.userId;
  }

  get postType(): PostType {
    return this.props.postType;
  }

  get locationId(): string | undefined {
    return this.props.locationId;
  }

  get content(): string {
    return this.props.content;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): Omit<PostProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<PostProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<PostProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

