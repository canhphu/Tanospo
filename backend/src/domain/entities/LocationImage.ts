import { ObjectId } from 'mongodb';

export interface LocationImageProps {
  _id?: ObjectId;
  id?: string;
  locationId: string;
  imageUrl: string;
  uploadedBy?: string;
  isPrimary: boolean;
  createdAt: Date;
}

export class LocationImage {
  constructor(private props: LocationImageProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get locationId(): string {
    return this.props.locationId;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get uploadedBy(): string | undefined {
    return this.props.uploadedBy;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<LocationImageProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<LocationImageProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<LocationImageProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

