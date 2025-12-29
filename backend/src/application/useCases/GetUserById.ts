import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class GetUserById {
  constructor(
    @inject('UserRepository') private readonly users: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }
}
