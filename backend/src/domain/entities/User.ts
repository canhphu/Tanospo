import { Coordinates } from '../valueObjects/Coordinates';
import { ObjectId } from 'mongodb';

export interface UserProps {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  language: string;
  avatarUrl?: string;
  homeLat?: number;
  homeLng?: number;
  currentLat?: number;
  currentLng?: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get language(): string {
    return this.props.language;
  }

  get role(): string {
    return this.props.role;
  }

  get homeLocation(): Coordinates | undefined {
    if (this.props.homeLat !== undefined && this.props.homeLng !== undefined) {
      return new Coordinates(this.props.homeLat, this.props.homeLng);
    }
    return undefined;
  }

  get currentLocation(): Coordinates | undefined {
    if (this.props.currentLat !== undefined && this.props.currentLng !== undefined) {
      return new Coordinates(this.props.currentLat, this.props.currentLng);
    }
    return undefined;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): Omit<UserProps, 'passwordHash' | '_id' | 'homeLat' | 'homeLng' | 'currentLat' | 'currentLng'> & { 
    id: string;
    homeLocation?: { latitude: number; longitude: number };
    currentLocation?: { latitude: number; longitude: number };
  } {
    const { passwordHash, _id, homeLat, homeLng, currentLat, currentLng, ...rest } = this.props;
    return { 
      ...rest, 
      id: this.id,
      homeLocation: this.homeLocation ? { latitude: this.homeLocation.latitude, longitude: this.homeLocation.longitude } : undefined,
      currentLocation: this.currentLocation ? { latitude: this.currentLocation.latitude, longitude: this.currentLocation.longitude } : undefined,
    };
  }

  toMongoDoc(): Omit<UserProps, 'id'> {
    const { id, ...rest } = this.props;
    if (this.props._id) {
      return rest;
    }
    return { ...rest, _id: new ObjectId() };
  }
}

