import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../orm';

dayjs.extend(utc);

@Injectable()
export class TokenCronService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  private async removeExpiredToken() {
    const tenDays = dayjs().utc().subtract(10, 'day').toDate();
    const twoDay = dayjs().utc().subtract(2, 'day').toDate();

    await Promise.all([
      await this.prismaService.accessToken.deleteMany({
        where: {
          createdAt: { lte: tenDays },
        },
      }),
      await this.prismaService.emailToken.deleteMany({
        where: {
          createdAt: { lte: twoDay },
        },
      }),
    ]);
  }
}
