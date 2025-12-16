import { ObjectId } from 'mongodb';

export interface WatchHistoryProps {
  _id?: ObjectId;
  id?: string;
  userId: string;
  videoId: string;
  watchedAt: Date;
  progressSeconds: number;
  device?: string;
}

export class WatchHistory {
  constructor(private props: WatchHistoryProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get userId(): string {
    return this.props.userId;
  }

  get videoId(): string {
    return this.props.videoId;
  }

  get watchedAt(): Date {
    return this.props.watchedAt;
  }

  get progressSeconds(): number {
    return this.props.progressSeconds;
  }

  get device(): string | undefined {
    return this.props.device;
  }

  toJSON(): Omit<WatchHistoryProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<WatchHistoryProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<WatchHistoryProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

