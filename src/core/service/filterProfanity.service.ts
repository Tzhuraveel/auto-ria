import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { NumberEdits } from '@prisma/client';

import { PrismaService } from '../orm';
import { CarDto } from '../../car';
import { EmailService } from '../mail';
import { EEmailAction } from '../enum';

@Injectable()
export class FilterProfanityService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  public async filterProfanity(car: CarDto): Promise<boolean> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `https://www.purgomalum.com/service/containsprofanity?text=${JSON.stringify(
          car,
        )}`,
      ),
    );
    return data;
  }

  public async checkProfanity(
    car: CarDto,
    userId: string,
    editId: string,
  ): Promise<string | void> {
    const numberEdits = editId
      ? await this.prismaService.numberEdits.findFirst({
          where: {
            id: editId,
          },
        })
      : null;

    if (numberEdits && numberEdits.edit === 3) {
      throw new HttpException(
        'You have exceeded the limit. Create a new ad',
        HttpStatus.FORBIDDEN,
      );
    }

    const includes = await this.filterProfanity(car);

    if (!includes) {
      if (numberEdits) {
        await this.prismaService.numberEdits.delete({
          where: {
            id: numberEdits.id,
          },
        });
      }
      return;
    }

    let numberEditId: NumberEdits;
    if (numberEdits) {
      numberEditId = await this.prismaService.numberEdits.update({
        where: {
          id: editId,
        },
        data: {
          edit: numberEdits.edit + 1,
        },
      });
    } else {
      numberEditId = await this.prismaService.numberEdits.create({
        data: {
          userId,
          edit: 0,
        },
      });
    }

    if (numberEdits && numberEdits.edit === 2) {
      const flaggedCar = await this.prismaService.flaggedCar.create({
        data: {
          year: car.year,
          ownerId: userId,
          currency: car.currency,
          engine: car.engine,
          description: car.description,
          price: car.price,
          cityLocative: car.cityLocative,
          model: car.model,
          marka: car.marka,
        },
      });

      const manager = await this.prismaService.user.findFirst({
        where: {
          role: 'MANAGER',
        },
      });

      await this.emailService.sendMail(manager.email, EEmailAction.MANAGER, {
        id: flaggedCar.id,
      });
    }

    return numberEditId.id;
  }
}
