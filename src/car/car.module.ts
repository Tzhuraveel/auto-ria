import { Module } from '@nestjs/common';

import { CarController } from './car.controller';
import { UserModule } from '../user';
import { CarService } from './car.service';
import {
  CurrencyConverterModule,
  FilterProfanityModule,
  S3Module,
} from '../core';

@Module({
  imports: [
    CurrencyConverterModule,
    FilterProfanityModule,
    UserModule,
    S3Module,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
