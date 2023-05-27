import { Injectable } from '@nestjs/common';
import { Currency, CurrencyCar } from '@prisma/client';

import { PrismaService } from '../orm';
import { ICurrency } from '../interface';

@Injectable()
export class CurrencyConverterService {
  public converter(
    price: number,
    currency: CurrencyCar,
    EUR: { buy: number; sale: number },
    USD: { buy: number; sale: number },
  ) {
    const convertedAmounts = {} as ICurrency;

    switch (currency) {
      case CurrencyCar.EUR:
        convertedAmounts.EUR = price;
        convertedAmounts.UAH = price * EUR.buy;
        convertedAmounts.USD = convertedAmounts.UAH / USD.sale;
        break;
      case CurrencyCar.USD:
        convertedAmounts.USD = price;
        convertedAmounts.UAH = price * USD.buy;
        convertedAmounts.EUR = convertedAmounts.UAH / EUR.sale;
        break;
      case CurrencyCar.UAH:
        convertedAmounts.UAH = price;
        convertedAmounts.USD = price * USD.sale;
        convertedAmounts.EUR = price * EUR.sale;
        break;
    }

    return convertedAmounts;
  }
  constructor(private readonly prismaService: PrismaService) {}
  public async currencyConverter(
    price: number,
    currency: CurrencyCar,
  ): Promise<{ currencies: ICurrency; EUR: Currency; USD: Currency }> {
    const currenciesList = await this.prismaService.currency.findMany();
    const EUR = currenciesList[0];
    const USD = currenciesList[1];

    return {
      currencies: this.converter(price, currency, EUR, USD),
      EUR,
      USD,
    };
  }
}
