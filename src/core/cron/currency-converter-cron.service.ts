import { Injectable } from '@nestjs/common';
import { PrismaService } from '../orm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CurrencyConverterService } from '../service';

@Injectable()
export class CurrencyConverterCronService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly currencyConverter: CurrencyConverterService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async currencyUpdate() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      ),
    );

    const [EUR, USD] = data;

    const cars = await this.prismaService.car.findMany();

    await Promise.all([
      this.prismaService.currency.update({
        where: {
          currency: 'EUR',
        },
        data: {
          sale: +EUR.sale,
          buy: +EUR.buy,
        },
      }),
      this.prismaService.currency.update({
        where: {
          currency: 'USD',
        },
        data: {
          sale: +USD.sale,
          buy: +USD.buy,
        },
      }),
      cars.map(async (car) => {
        const currency = this.currencyConverter.converter(
          car.price,
          car.currency,
          EUR,
          USD,
        );

        await this.prismaService.car.update({
          where: {
            id: car.id,
          },
          data: {
            EUR: currency.EUR,
            UAH: currency.UAH,
            USD: currency.USD,
            eurRate: { sale: +EUR.sale, buy: +EUR.buy },
            usdRate: { sale: +USD.sale, buy: +USD.buy },
          },
        });
      }),
    ]);
  }
}
