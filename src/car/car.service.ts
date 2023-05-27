import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Status, User } from '@prisma/client';

import {
  CurrencyConverterService,
  FilterProfanityService,
  ICar,
  PrismaService,
} from '../core';
import { CarDto, CarResponseDto } from './dto';
import { UserService } from '../user';
import { S3Service } from '../core';

const selectedFields = {
  id: true,
  year: true,
  EUR: true,
  USD: true,
  UAH: true,
  currency: true,
  engine: true,
  cityLocative: true,
  description: true,
  ownerId: true,
  eurRate: true,
  usdRate: true,
  photo: true,
  model: {
    select: {
      model: true,
    },
  },
  modelId: true,
  marka: {
    select: {
      marka: true,
    },
  },
  markaId: true,
};

@Injectable()
export class CarService {
  private toResponse(car: ICar): CarResponseDto {
    const marka = car.marka.marka;
    const model = car.model.model;

    return {
      ...car,
      marka,
      model,
    };
  }

  private toManyResponse(cars: ICar[]): CarResponseDto[] {
    return cars.map(this.toResponse);
  }
  constructor(
    private readonly prismaService: PrismaService,
    private readonly currencyConverterService: CurrencyConverterService,
    private readonly filterProfanityService: FilterProfanityService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  public async createCar(
    car: CarDto,
    user: User,
    editId?: string,
  ): Promise<void | any> {
    await this.userService.checkTypeAccount(user);

    const numberEditsId = await this.filterProfanityService.checkProfanity(
      car,
      user.id,
      editId,
    );

    if (numberEditsId) {
      return {
        id: numberEditsId,
        message:
          'This ad failed the profanity check. This id you must put in next request the same user',
      };
    }

    const markaFromBd = await this.prismaService.markaCar.findUnique({
      where: { marka: car.marka },
    });

    if (!markaFromBd) {
      throw new BadRequestException();
    }

    const modelFromBd = await this.prismaService.modelCar.findFirst({
      where: { model: car.model, markaId: markaFromBd.id },
    });

    if (!modelFromBd) {
      throw new BadRequestException();
    }

    const { currencies, EUR, USD } =
      await this.currencyConverterService.currencyConverter(
        car.price,
        car.currency,
      );

    const carFromDb = await this.prismaService.car.create({
      data: {
        markaId: markaFromBd.id,
        engine: car.engine,
        modelId: modelFromBd.id,
        cityLocative: car.cityLocative,
        price: car.price,
        description: car.description,
        year: car.year,
        ownerId: user.id,
        currency: car.currency,
        EUR: currencies.EUR,
        USD: currencies.USD,
        UAH: currencies.UAH,
        eurRate: { sale: EUR.sale, buy: EUR.buy },
        usdRate: { sale: USD.sale, buy: USD.buy },
        status: Status.ACTIVE,
      },
    });

    await this.prismaService.statistics.create({
      data: {
        carId: carFromDb.id,
        dayViews: 0,
        monthViews: 0,
        totalViews: 0,
      },
    });
  }

  public async getCarById(carId): Promise<CarResponseDto> {
    const car = await this.prismaService.car.findUnique({
      where: {
        id: carId,
      },
      select: selectedFields,
    });

    if (!car) {
      throw new HttpException('Not found car', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.statistics.update({
      where: {
        carId: car.id,
      },
      data: {
        dayViews: { increment: 1 },
        totalViews: { increment: 1 },
        monthViews: { increment: 1 },
      },
    });

    return this.toResponse(car);
  }

  public async getAllCars(): Promise<CarResponseDto[]> {
    const car = await this.prismaService.car.findMany({
      select: selectedFields,
    });

    if (!car) {
      throw new HttpException('Not found car', HttpStatus.NOT_FOUND);
    }

    return this.toManyResponse(car);
  }

  public async uploadPhoto(
    file: Express.Multer.File,
    carId: string,
    user: User,
  ) {
    const carFromDb = await this.prismaService.car.findFirst({
      where: {
        id: carId,
        ownerId: user.id,
      },
    });

    if (!carFromDb) {
      throw new HttpException(
        'Car not found or not belong this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const filePath = await this.s3Service.upload(file, 'car', carId);

    await this.prismaService.car.update({
      where: {
        id: carId,
      },
      data: {
        photo: filePath,
      },
    });
  }
}
