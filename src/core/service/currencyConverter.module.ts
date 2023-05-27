import { Module } from '@nestjs/common';

import { CurrencyConverterService } from './currencyConverter.service';

@Module({
  imports: [],
  providers: [CurrencyConverterService],
  exports: [CurrencyConverterService],
})
export class CurrencyConverterModule {}
