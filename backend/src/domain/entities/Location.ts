import { Coordinates } from '../valueObjects/Coordinates';

export interface LocationProps {
  id: string;
  name: string;
  address?: string;
  coordinates: Coordinates;
  type: 'park' | 'gym' | 'trail' | 'other';
  amenities: string[];
  imageUrl?: string;
  createdAt: Date;
}

export class Location {
  constructor(private props: LocationProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get coordinates(): Coordinates {
    return this.props.coordinates;
  }

  toJSON(): LocationProps {
    return { ...this.props };
  }
}

