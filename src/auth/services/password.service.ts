import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

/**
 * Password Hashing Service (argon2 algorithm used, most secure hashing till 2024 https://en.wikipedia.org/wiki/Argon2)
 */
@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, { type: argon2.argon2id });
  }

  async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }
}
