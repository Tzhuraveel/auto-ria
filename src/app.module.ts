import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  PrismaModule,
  MailModule,
  PasswordModule,
  CommonModule,
  CurrencyConverterModule,
} from './core';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { CarModule } from './car';
import { AdminModule } from './admin';
import { PassportWrapperModule } from './core';
import { ManagementModule } from './management';
import { PaymentModule } from './payment';
import { CarDetailsModule } from './car-details';
import { StatisticModule } from './statistic';
import { CronModule } from './core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    MailModule,
    PasswordModule,
    UserModule,
    CommonModule,
    CarModule,
    CurrencyConverterModule,
    PassportWrapperModule,
    AdminModule,
    ManagementModule,
    PaymentModule,
    CarDetailsModule,
    StatisticModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
