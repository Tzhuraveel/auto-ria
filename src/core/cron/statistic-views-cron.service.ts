import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../orm';

dayjs.extend(utc);

@Injectable()
export class StatisticViewsCronService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async resetDayViews() {
    const cars = await this.prismaService.car.findMany();

    cars.map(async (car) => {
      await this.prismaService.statistics.update({
        where: {
          carId: car.id,
        },
        data: {
          dayViews: 0,
        },
      });
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  public async resetMonthViews() {
    const cars = await this.prismaService.car.findMany();

    cars.map(async (car) => {
      await this.prismaService.statistics.update({
        where: {
          carId: car.id,
        },
        data: {
          monthViews: 0,
        },
      });
    });
  }
}
