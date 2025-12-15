import { Coordinates } from '../valueObjects/Coordinates';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  language: string;
  homeLocation?: Coordinates;
  currentLocation?: Coordinates;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash : string;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string {
    return this.props.id;
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

  get homeLocation(): Coordinates | undefined {
    return this.props.homeLocation;
  }

  get currentLocation(): Coordinates | undefined {
    return this.props.currentLocation;
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}

