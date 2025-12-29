import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { JwtService } from '../services/JwtService';
import { GoogleVerifier } from '../services/GoogleVerifier';

const schema = z.object({
  idToken: z.string().min(10),
});

@injectable()
export class LoginWithGoogle {
  private readonly saltRounds = 10;

  constructor(
    @inject('UserRepository') private readonly users: IUserRepository,
    @inject(JwtService) private readonly jwt: JwtService,
    @inject(GoogleVerifier) private readonly verifier: GoogleVerifier,
  ) {}

  async execute(input: z.infer<typeof schema>) {
    const { idToken } = schema.parse(input);
    const google = await this.verifier.verifyIdToken(idToken);

    // Find or create user by email
    let user = await this.users.findByEmail(google.email);
    if (!user) {
      const now = new Date();
      const passwordHash = await bcrypt.hash('oauth-google', this.saltRounds);
      user = await this.users.save(new User({
        name: google.name || google.email.split('@')[0],
        email: google.email,
        passwordHash,
        language: 'ja',
        avatarUrl: google.picture,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      }));
    }

    const token = this.jwt.generateToken({ userId: user.id, email: user.email });
    return { user: user.toJSON(), token };
  }
}
