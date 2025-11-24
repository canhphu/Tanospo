import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Coordinates } from '../../domain/valueObjects/Coordinates';
import { withClient } from '../db';

interface DbUser {
  id: string;
  name: string;
  email: string;
  language: string;
  avatar_url: string | null;
  home_lat: number | null;
  home_lng: number | null;
  current_lat: number | null;
  current_lng: number | null;
  created_at: Date;
  updated_at: Date;
}

const mapUser = (row: DbUser): User =>
  new User({
    id: row.id,
    name: row.name,
    email: row.email,
    language: row.language,
    avatarUrl: row.avatar_url ?? undefined,
    homeLocation:
      row.home_lat !== null && row.home_lng !== null
        ? new Coordinates(row.home_lat, row.home_lng)
        : undefined,
    currentLocation:
      row.current_lat !== null && row.current_lng !== null
        ? new Coordinates(row.current_lat, row.current_lng)
        : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const row = await withClient(async client => {
      const result = await client.query<DbUser>('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
      return result.rows[0];
    });
    return row ? mapUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await withClient(async client => {
      const result = await client.query<DbUser>('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      return result.rows[0];
    });
    return row ? mapUser(row) : null;
  }

  async save(user: User): Promise<User> {
    const data = user.toJSON();
    const row = await withClient(async client => {
      const result = await client.query<DbUser>(
        `INSERT INTO users
          (id, name, email, language, avatar_url, home_lat, home_lng, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          language = EXCLUDED.language,
          avatar_url = EXCLUDED.avatar_url,
          home_lat = EXCLUDED.home_lat,
          home_lng = EXCLUDED.home_lng,
          updated_at = NOW()
        RETURNING *`,
        [
          data.id,
          data.name,
          data.email,
          data.language,
          data.avatarUrl ?? null,
          data.homeLocation?.latitude ?? null,
          data.homeLocation?.longitude ?? null,
          data.createdAt,
          data.updatedAt,
        ],
      );
      return result.rows[0];
    });
    return mapUser(row);
  }

  async updateCurrentLocation(userId: string, lat: number, lng: number): Promise<void> {
    await withClient(client =>
      client.query('UPDATE users SET current_lat = $2, current_lng = $3, updated_at = NOW() WHERE id = $1', [
        userId,
        lat,
        lng,
      ]),
    );
  }
}

