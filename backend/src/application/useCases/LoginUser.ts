import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { JwtService } from '../services/JwtService';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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

    // 1. Tìm người dùng và lấy hash mật khẩu
    const authUser = await this.users.findByEmail(data.email);

    // Kiểm tra người dùng tồn tại
    if (!authUser) {
      throw new Error('Invalid credentials');
    }

    // 2. So sánh mật khẩu mã hoá
    const isPasswordValid = await bcrypt.compare(data.password, (authUser as any).passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // 3. Tạo JWT Token
    const token = this.jwtService.generateToken({
      userId: authUser.id,
      email: authUser.email,
    });

    // Trả về token và thông tin cơ bản của người dùng
    return {
      user: authUser.toJSON(), // Dữ liệu người dùng (không có hash mật khẩu)
      token,
    };
  }
}