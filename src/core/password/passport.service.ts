import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  public async compare(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isMatched = await bcrypt.compare(password, hashedPassword);

    if (!isMatched) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
