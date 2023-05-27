import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { TypeAccount, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async checkTypeAccount(user: User): Promise<void> {
    if (user.typeOfAccount === TypeAccount.BASE) {
      const car = await this.prismaService.car.findFirst({
        where: {
          ownerId: user.id,
        },
      });

      if (car) {
        throw new HttpException(
          'You can create only one car',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
