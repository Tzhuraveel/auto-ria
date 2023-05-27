import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from '../orm';
import { EDbField, EDynamicallyAction } from '../enum';
import { User } from '@prisma/client';

@Injectable()
export class CommonService {
  constructor(private readonly prismaService: PrismaService) {}

  public async checkIsUserExist(
    actionWithFoundField: EDynamicallyAction,
    field: string,
    dbField: EDbField,
  ): Promise<User> {
    const foundItem = await this.prismaService.user.findUnique({
      where: { [dbField]: field },
    });

    switch (actionWithFoundField) {
      case EDynamicallyAction.NEXT:
        if (!foundItem) {
          throw new HttpException('User not found', 400);
        }
        return foundItem;
      case EDynamicallyAction.THROW:
        if (foundItem) {
          throw new HttpException('User already exist', 400);
        }
        break;
    }
  }
}
