import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';
import { Coordinates } from '../../domain/valueObjects/Coordinates';
import { withClient } from '../db';

interface DbLocation {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  type: string;
  amenities: string[];
  image_url: string | null;
  created_at: Date;
}

const mapLocation = (row: DbLocation): Location =>
  new Location({
    id: row.id,
    name: row.name,
    address: row.address ?? undefined,
    coordinates: new Coordinates(row.latitude, row.longitude),
    type: (row.type as Location['toJSON']['type']) ?? 'other',
    amenities: row.amenities ?? [],
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
  });

export class LocationRepository implements ILocationRepository {
  async findWithinRadius(center: Coordinates, radiusMeters: number): Promise<Location[]> {
    const rows = await withClient(async client => {
      const result = await client.query<DbLocation>(
        `SELECT *,
            ST_DistanceSphere(
              ST_MakePoint(longitude, latitude),
              ST_MakePoint($2, $1)
            ) AS distance
         FROM locations
         WHERE ST_DistanceSphere(
              ST_MakePoint(longitude, latitude),
              ST_MakePoint($2, $1)
            ) <= $3
         ORDER BY distance ASC
         LIMIT 50`,
        [center.latitude, center.longitude, radiusMeters],
      );
      return result.rows;
    });
    return rows.map(mapLocation);
  }

  async findById(id: string): Promise<Location | null> {
    const row = await withClient(async client => {
      const result = await client.query<DbLocation>('SELECT * FROM locations WHERE id = $1', [id]);
      return result.rows[0];
    });
    return row ? mapLocation(row) : null;
  }

  async save(location: Location): Promise<Location> {
    const data = location.toJSON();
    const row = await withClient(async client => {
      const result = await client.query<DbLocation>(
        `INSERT INTO locations
          (id, name, address, latitude, longitude, type, amenities, image_url, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE
          SET name = EXCLUDED.name,
              address = EXCLUDED.address,
              latitude = EXCLUDED.latitude,
              longitude = EXCLUDED.longitude,
              type = EXCLUDED.type,
              amenities = EXCLUDED.amenities,
              image_url = EXCLUDED.image_url
        RETURNING *`,
        [
          data.id,
          data.name,
          data.address ?? null,
          data.coordinates.latitude,
          data.coordinates.longitude,
          data.type,
          data.amenities,
          data.imageUrl ?? null,
          data.createdAt,
        ],
      );
      return result.rows[0];
    });
    return mapLocation(row);
  }
}

