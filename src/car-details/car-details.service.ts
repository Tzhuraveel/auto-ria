import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MarkaCar, ModelCar, Roles } from '@prisma/client';

import { EEmailAction, EmailService, PrismaService } from '../core';
import { CarMarkaDto, CarModelDto } from './dto';

@Injectable()
export class CarDetailsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  public getAllCarMarks(): Promise<MarkaCar[]> {
    return this.prismaService.markaCar.findMany();
  }

  public async getAllCarModels(markaId: string): Promise<ModelCar[]> {
    const models = await this.prismaService.modelCar.findMany({
      where: {
        markaId,
      },
    });

    if (models.length === 0) {
      throw new HttpException('Not found models', HttpStatus.BAD_REQUEST);
    }

    return models;
  }

  public async addCarModel(body: CarModelDto) {
    const markaFromDb = await this.prismaService.markaCar.findUnique({
      where: {
        id: body.markaId,
      },
    });

    if (!markaFromDb) {
      throw new HttpException('Marka not found', HttpStatus.BAD_REQUEST);
    }

    const modelFromDb = await this.prismaService.modelCar.findFirst({
      where: {
        markaId: markaFromDb.id,
        model: body.modelName,
      },
    });

    if (modelFromDb) {
      throw new HttpException('Model already exist', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.unknownCar.create({
      data: {
        markaName: body.markaName,
        modelName: body.modelName,
        markaId: body.markaId,
        userEmail: body.userEmail,
        userName: body.userName,
      },
    });

    const admin = await this.prismaService.user.findFirst({
      where: {
        role: Roles.ADMIN,
      },
    });

    await this.emailService.sendMail(admin.email, EEmailAction.ADMIN);
  }

  public async addCarMarka(body: CarMarkaDto) {
    const markaFromDb = await this.prismaService.markaCar.findUnique({
      where: {
        marka: body.markaName,
      },
    });

    if (markaFromDb) {
      throw new HttpException('Marka already exist', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.unknownCar.create({
      data: {
        markaName: body.markaName,
        modelName: body.modelName,
        userEmail: body.userEmail,
        userName: body.userName,
      },
    });

    const admin = await this.prismaService.user.findFirst({
      where: {
        role: Roles.ADMIN,
      },
    });

    await this.emailService.sendMail(admin.email, EEmailAction.ADMIN);
  }
}
