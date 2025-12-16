import { ObjectId } from 'mongodb';

export type EffortLevel = 'easy' | 'moderate' | 'hard' | 'very_hard';

export interface VideoReviewProps {
  _id?: ObjectId;
  id?: string;
  userId: string;
  videoId: string;
  rating: number; // 1-5
  comment?: string;
  effortLevel?: EffortLevel;
  isPublic: boolean;
  createdAt: Date;
}

export class VideoReview {
  constructor(private props: VideoReviewProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get userId(): string {
    return this.props.userId;
  }

  get videoId(): string {
    return this.props.videoId;
  }

  get rating(): number {
    return this.props.rating;
  }

  get comment(): string | undefined {
    return this.props.comment;
  }

  get effortLevel(): EffortLevel | undefined {
    return this.props.effortLevel;
  }

  get isPublic(): boolean {
    return this.props.isPublic;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<VideoReviewProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<VideoReviewProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<VideoReviewProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

