import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { PaymentDto } from './dto';
import { TypeAccount, User } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  public async buyPremiumAccount(body: PaymentDto, user: User) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        typeOfAccount: TypeAccount.PREMIUM,
      },
    });
  }
}
