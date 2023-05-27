import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CurrencyCar, User } from '@prisma/client';

import { PrismaService } from '../core';
import { AveragePriceResponseDto } from './dto';

@Injectable()
export class StatisticService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getViewsStatistic(carId: string, user: User) {
    const car = await this.prismaService.car.findFirst({
      where: {
        ownerId: user.id,
        id: carId,
      },
    });

    if (!car) {
      throw new HttpException(
        'Car don`t belong to this user',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return this.prismaService.statistics.findUnique({
      where: {
        carId,
      },
    });
  }

  public async getAveragePriceForCity(
    carId: string,
  ): Promise<AveragePriceResponseDto> {
    const car = await this.prismaService.car.findUnique({
      where: {
        id: carId,
      },
    });

    if (!car) {
      throw new HttpException('Not found car', HttpStatus.BAD_REQUEST);
    }

    const carsFromDb = await this.prismaService.car.findMany({
      where: {
        cityLocative: car.cityLocative,
      },
    });

    const priceAllCars = carsFromDb.reduce(
      (accumulator, currentValue) => accumulator + currentValue.USD,
      0,
    );

    return {
      averagePrice: priceAllCars / carsFromDb.length,
      currency: CurrencyCar.USD,
    };
  }

  public async getAveragePriceForUkraine(): Promise<AveragePriceResponseDto> {
    const carsFromDb = await this.prismaService.car.findMany();

    const priceAllCars = carsFromDb.reduce(
      (accumulator, currentValue) => accumulator + currentValue.USD,
      0,
    );

    return {
      averagePrice: priceAllCars / carsFromDb.length,
      currency: CurrencyCar.USD,
    };
  }
}
