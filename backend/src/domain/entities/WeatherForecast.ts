import { ObjectId } from 'mongodb';

export interface WeatherForecastProps {
  _id?: ObjectId;
  id?: string;
  locationId: string;
  temperature?: number;
  humidity?: number;
  condition?: string;
  forecastAt: Date;
}

export class WeatherForecast {
  constructor(private props: WeatherForecastProps) {}

  get id(): string {
    return this.props._id?.toString() || this.props.id || '';
  }

  get locationId(): string {
    return this.props.locationId;
  }

  get temperature(): number | undefined {
    return this.props.temperature;
  }

  get humidity(): number | undefined {
    return this.props.humidity;
  }

  get condition(): string | undefined {
    return this.props.condition;
  }

  get forecastAt(): Date {
    return this.props.forecastAt;
  }

  toJSON(): Omit<WeatherForecastProps, '_id'> & { id: string } {
    const { _id, ...rest } = this.props;
    return { ...rest, id: this.id };
  }

  toMongoDoc(): Omit<WeatherForecastProps, 'id'> {
    const { id, ...rest } = this.props;
    const doc: Omit<WeatherForecastProps, 'id'> = { ...rest };
    if (!doc._id) {
      doc._id = new ObjectId();
    }
    return doc;
  }
}

