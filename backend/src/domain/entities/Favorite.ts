import { ObjectId } from 'mongodb';

export type FavoriteTargetType = 'location' | 'video' | 'post';

export interface FavoriteProps {
  _id?: ObjectId;
  id?: string;
  userId: string;
  targetType: FavoriteTargetType;
  targetId: string;
  createdAt: Date;
}

export class Favorite {
  constructor(private props: FavoriteProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get userId(): string {
    return this.props.userId;
  }

  get targetType(): FavoriteTargetType {
    return this.props.targetType;
  }

  get targetId(): string {
    return this.props.targetId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<FavoriteProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<FavoriteProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<FavoriteProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

