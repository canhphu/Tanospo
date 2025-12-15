import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
}

@injectable()
export class JwtService {
  private readonly secret = env.jwtSecret;
  private readonly expiresIn = '7d';

  /**
   * Tạo JWT token cho người dùng.
   * @param payload Dữ liệu chứa userId và email
   * @returns JWT token
   */
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
}