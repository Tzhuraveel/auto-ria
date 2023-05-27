import { Module } from '@nestjs/common';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { UserModule } from '../user';
import { CurrencyConverterModule, FilterProfanityModule } from '../core';

@Module({
  imports: [CurrencyConverterModule, FilterProfanityModule, UserModule],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
