import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { JwtService } from '../services/JwtService';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginUserInput = z.infer<typeof schema>;

@injectable()
export class LoginUser {
  constructor(
    @inject('UserRepository') private readonly users: IUserRepository,
    @inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async execute(payload: LoginUserInput) {
    const data = schema.parse(payload);
    const authUser = await this.users.findByEmail(data.email);

    if (!authUser) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, authUser.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.generateToken({
      userId: authUser.id,
      email: authUser.email,
    });

    return {
      user: authUser.toJSON(),
      token,
    };
  }
}