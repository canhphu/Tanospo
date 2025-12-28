import { inject, injectable } from 'tsyringe';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  type: z.enum(['park', 'gym', 'trail', 'other']),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
});

export type CreateLocationInput = z.infer<typeof schema>;

@injectable()
export class CreateLocation {
  constructor(
    @inject('LocationRepository') private readonly locations: ILocationRepository
  ) {}

  async execute(payload: CreateLocationInput) {
    const data = schema.parse(payload);

    const location = new Location({
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
      description: data.description,
      amenities: data.amenities,
      imageUrl: data.imageUrl,
      createdAt: new Date(),
    });

    const saved = await this.locations.save(location);
    return saved.toJSON();
  }
}