import { Location } from '../entities/Location';
import { Coordinates } from '../valueObjects/Coordinates';

export interface ILocationRepository {
  findWithinRadius(center: Coordinates, radiusMeters: number): Promise<Location[]>;
  findById(id: string): Promise<Location | null>;
  save(location: Location): Promise<Location>;
}

