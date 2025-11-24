import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Coordinates } from '../../domain/valueObjects/Coordinates';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  language: z.string().default('ja'),
  homeLat: z.number().optional(),
  homeLng: z.number().optional(),
});

export type RegisterUserInput = z.infer<typeof schema>;

@injectable()
export class RegisterUser {
  constructor(@inject('UserRepository') private readonly users: IUserRepository) {}

  async execute(payload: RegisterUserInput) {
    const data = schema.parse(payload);
    const user = new User({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      language: data.language,
      homeLocation:
        data.homeLat !== undefined && data.homeLng !== undefined
          ? new Coordinates(data.homeLat, data.homeLng)
          : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const created = await this.users.save(user);
    return created.toJSON();
  }
}

