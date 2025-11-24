import { inject, injectable } from 'tsyringe';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Coordinates } from '../../domain/valueObjects/Coordinates';
import { z } from 'zod';

const schema = z.object({
  userId: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusMeters: z.number().default(2000),
});

export type GetNearbyLocationsInput = z.infer<typeof schema>;

@injectable()
export class GetNearbyLocations {
  constructor(
    @inject('LocationRepository') private readonly locations: ILocationRepository,
    @inject('UserRepository') private readonly users: IUserRepository,
  ) {}

  async execute(payload: GetNearbyLocationsInput) {
    const data = schema.parse(payload);
    let coordinates: Coordinates | undefined;

    if (data.latitude !== undefined && data.longitude !== undefined) {
      coordinates = new Coordinates(data.latitude, data.longitude);
    } else if (data.userId) {
      const user = await this.users.findById(data.userId);
      coordinates = user?.currentLocation ?? user?.homeLocation;
    }

    if (!coordinates) {
      throw new Error('Unable to resolve coordinates');
    }

    const results = await this.locations.findWithinRadius(coordinates, data.radiusMeters);
    return results.map(location => location.toJSON());
  }
}

