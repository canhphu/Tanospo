import { ObjectId } from 'mongodb';

export interface GoogleAccountProps {
  _id?: ObjectId;
  id?: string;
  userId: string;
  googleId: string;
  email: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  createdAt: Date;
}

export class GoogleAccount {
  constructor(private props: GoogleAccountProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get userId(): string {
    return this.props.userId;
  }

  get googleId(): string {
    return this.props.googleId;
  }

  get email(): string {
    return this.props.email;
  }

  get refreshToken(): string | undefined {
    return this.props.refreshToken;
  }

  get tokenExpiry(): Date | undefined {
    return this.props.tokenExpiry;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<GoogleAccountProps, '_id' | 'refreshToken'> & { id: string } {
    const { _id, refreshToken, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<GoogleAccountProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<GoogleAccountProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

