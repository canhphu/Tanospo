import { ObjectId } from 'mongodb';

export type IntensityLevel = 'low' | 'medium' | 'high';

export interface VideoProps {
  _id?: ObjectId;
  id?: string;
  youtubeId: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  intensityLevel?: IntensityLevel;
  tags: string[];
  language: string;
  thumbnailUrl?: string;
  category?: string;
  publishedAt?: Date;
  createdAt: Date;
}
  
export class Video {
  constructor(private props: VideoProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get youtubeId(): string {
    return this.props.youtubeId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get durationSeconds(): number | undefined {
    return this.props.durationSeconds;
  }

  get intensityLevel(): IntensityLevel | undefined {
    return this.props.intensityLevel;
  }

  get tags(): string[] {
    return this.props.tags || [];
  }

  get language(): string {
    return this.props.language;
  }

  get thumbnailUrl(): string | undefined {
    return this.props.thumbnailUrl;
  }

  get category(): string | undefined {
    return this.props.category;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<VideoProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<VideoProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<VideoProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

