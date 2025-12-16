import { Coordinates } from '../valueObjects/Coordinates';
import { ObjectId } from 'mongodb';

export interface LocationProps {
  _id?: ObjectId;
  id?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  type: 'park' | 'gym' | 'trail' | 'other';
  description?: string;
  amenities: string[];
  imageUrl?: string;
  aqiStationId?: string;
  weatherStationId?: string;
  createdAt: Date;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export class Location {
  constructor(private props: LocationProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get coordinates(): Coordinates {
    return new Coordinates(this.props.latitude, this.props.longitude);
  }

  get type(): 'park' | 'gym' | 'trail' | 'other' {
    return this.props.type;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get amenities(): string[] {
    return this.props.amenities || [];
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get aqiStationId(): string | undefined {
    return this.props.aqiStationId;
  }

  get weatherStationId(): string | undefined {
    return this.props.weatherStationId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<LocationProps, '_id' | 'location'> & { id: string; coordinates: { latitude: number; longitude: number } } {
    const { _id, location, ...rest } = this.props;
    return {
      ...rest,
      id: this.id,
      coordinates: {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
      },
    };
  }

  toMongoDoc(): Omit<LocationProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<LocationProps, 'id'> = {
      ...rest,
      location: {
        type: 'Point',
        coordinates: [this.props.longitude, this.props.latitude],
      },
    };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

