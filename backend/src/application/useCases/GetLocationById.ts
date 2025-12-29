import { inject, injectable } from 'tsyringe';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';

@injectable()
export class GetLocationById {
  constructor(
    @inject('LocationRepository') private readonly locations: ILocationRepository,
  ) {}

  async execute(id: string) {
    const loc = await this.locations.findById(id);
    if (!loc) {
      throw new Error('Location not found');
    }
    return loc.toJSON();
  }
}
