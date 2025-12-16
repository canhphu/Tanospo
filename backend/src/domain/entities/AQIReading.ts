import { ObjectId } from 'mongodb';

export interface AQIReadingProps {
  _id?: ObjectId;
  id?: string;
  locationId: string;
  source: string;
  aqi: number;
  recordedAt: Date;
}

export class AQIReading {
  constructor(private props: AQIReadingProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get locationId(): string {
    return this.props.locationId;
  }

  get source(): string {
    return this.props.source;
  }

  get aqi(): number {
    return this.props.aqi;
  }

  get recordedAt(): Date {
    return this.props.recordedAt;
  }

  toJSON(): Omit<AQIReadingProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<AQIReadingProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<AQIReadingProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

