import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { JwtService } from '../services/JwtService';

@injectable()
export class GetProfile {
  constructor(
    @inject('UserRepository') private readonly users: IUserRepository,
    @inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    const payload = this.jwtService.verifyToken(token);
    const user = await this.users.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { passwordHash, ...safeUser } = { ...user.toJSON(), passwordHash: undefined };
    return safeUser;
  }
}

