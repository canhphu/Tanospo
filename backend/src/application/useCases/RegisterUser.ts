import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  language: z.string().default('ja'),
  homeLat: z.number().optional(),
  homeLng: z.number().optional(),
});

export type RegisterUserInput = z.infer<typeof schema>;

@injectable()
export class RegisterUser {
  private readonly saltRounds = 10;

  constructor(@inject('UserRepository') private readonly users: IUserRepository) {}

  async execute(payload: RegisterUserInput) {
    const data = schema.parse(payload);

    // 1. Kiểm tra email trùng
    const existingUser = await this.users.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // 2. Mã hoá mật khẩu
    const newPasswordHash = await bcrypt.hash(data.password, this.saltRounds);

    const now = new Date();
    const user = new User({
      name: data.name,
      email: data.email,
      language: data.language,
      passwordHash: newPasswordHash,
      homeLat: data.homeLat,
      homeLng: data.homeLng,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    });
    
    // 3. Lưu người dùng cùng với hash mật khẩu
    const created = await this.users.save(user);
    
    // Trả về dữ liệu người dùng (không bao gồm hash mật khẩu)
    return created.toJSON();
  }
}