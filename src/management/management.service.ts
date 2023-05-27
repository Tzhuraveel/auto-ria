import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Roles, UserStatus } from '@prisma/client';

import {
  CommonService,
  EDbField,
  EDynamicallyAction,
  PrismaService,
} from '../core';

@Injectable()
export class ManagementService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  public async banUser(userId: string) {
    const userFromDb = await this.commonService.checkIsUserExist(
      EDynamicallyAction.NEXT,
      userId,
      EDbField.ID,
    );

    if (userFromDb.role !== Roles.SELLER || Roles.SELLER) {
      throw new HttpException(
        'You can ban only the seller or the buyer',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userFromDb.status === UserStatus.BANNED) {
      throw new HttpException('User already is banned', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { status: UserStatus.BANNED },
    });
  }

  public async unbanUser(userId: string) {
    const userFromDb = await this.commonService.checkIsUserExist(
      EDynamicallyAction.NEXT,
      userId,
      EDbField.ID,
    );

    if (userFromDb.role !== Roles.SELLER || Roles.SELLER) {
      throw new HttpException(
        'You can unban only the seller or the buyer',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userFromDb.status === UserStatus.ACTIVE) {
      throw new HttpException('User already is active', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { status: UserStatus.ACTIVE },
    });
  }
}
