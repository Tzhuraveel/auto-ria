import { Module } from '@nestjs/common';

import { CarDetailsService } from './car-details.service';
import { CarDetailsController } from './car-details.controller';
import { MailModule } from '../core';

@Module({
  imports: [MailModule],
  providers: [CarDetailsService],
  controllers: [CarDetailsController],
})
export class CarDetailsModule {}
